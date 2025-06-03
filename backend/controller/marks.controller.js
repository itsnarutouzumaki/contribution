import axios from "axios";

const getMarks = async (req, res) => {
  // console.log("Got hit");

  const ORGANIZATION_NAME = process.env.ORGANIZATION_NAME;
  const { username } = req.body;
  const access_token = req.cookies?.accessToken;

  if (!access_token) {
    return res.status(408).json({ error: "Access token missing or expired" });
  }

  try {
    const headers = {
      Authorization: `token ${access_token}`,
    };

    let remainingAPICall = null;

    const reposResponse = await axios.get(
      `https://api.github.com/users/${ORGANIZATION_NAME}/repos`,
      { headers }
    );

    if (reposResponse.headers["x-ratelimit-remaining"]) {
      remainingAPICall = parseInt(
        reposResponse.headers["x-ratelimit-remaining"]
      );
    }

    const repos = reposResponse.data;
    // console.log(
    //   `Found ${repos.length} repos for Organization ${ORGANIZATION_NAME}`
    // );

    const assigneeScoresAllTime = {};
    const assigneeScoresLast30 = {};
    const assigneeScoresLast60 = {};
    assigneeScoresAllTime[username] = 0;
    assigneeScoresLast30[username] = 0;
    assigneeScoresLast60[username] = 0;

    let allIssues = [];

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    for (const repo of repos) {
      let page_no = 1;
      while (true) {
        const issuesResponse = await axios.get(
          `https://api.github.com/repos/${ORGANIZATION_NAME}/${repo.name}/issues?state=closed&per_page=100&page=${page_no}`,
          { headers }
        );

        if (issuesResponse.headers["x-ratelimit-remaining"]) {
          remainingAPICall = parseInt(
            issuesResponse.headers["x-ratelimit-remaining"]
          );
        }

        const issues = issuesResponse.data;
        allIssues = allIssues.concat(issues);

        for (const issue of issues) {
          if (!issue.assignee || !issue.assignee.login) continue;

          const assigneeName = issue.assignee.login;

          const spLabel = issue.labels.find((label) =>
            /^sp\s*-\s*\d+$/i.test(label.name)
          );

          if (spLabel) {
            const marks = parseInt(spLabel.name.split("-")[1].trim());
            if (!isNaN(marks)) {
              const closedDate = new Date(issue.closed_at);

              assigneeScoresAllTime[assigneeName] =
                (assigneeScoresAllTime[assigneeName] || 0) + marks;

              if (closedDate >= sixtyDaysAgo) {
                assigneeScoresLast60[assigneeName] =
                  (assigneeScoresLast60[assigneeName] || 0) + marks;
              }

              if (closedDate >= thirtyDaysAgo) {
                assigneeScoresLast30[assigneeName] =
                  (assigneeScoresLast30[assigneeName] || 0) + marks;
              }
            }
          }
        }

        if (issues.length < 100) break;
        page_no++;
      }
    }

    const allRecentAssignees = new Set([
      ...Object.keys(assigneeScoresLast30),
      ...Object.keys(assigneeScoresLast60),
    ]);

    const sortedScoresLast30 = [...allRecentAssignees]
      .map((assignee) => ({
        assignee,
        marks: assigneeScoresLast30[assignee] || 0,
        last60: assigneeScoresLast60[assignee] || 0,
      }))
      .sort((a, b) => b.marks - a.marks);

    const sortedScoresAllTime = Object.entries(assigneeScoresAllTime)
      .sort((a, b) => b[1] - a[1])
      .map(([assignee, marks]) => ({ assignee, marks }));
    // console.log("number of api call left", remainingAPICall);
    res.json({
      totalIssues: allIssues.length,
      repos,
      sortedScoresLast30,
      sortedScoresAllTime,
      remainingAPICall,
    });
  } catch (error) {
    // console.error("API Error:", error.message);

    if (error.response && error.response.status === 403) {
      const rateLimitMessage =
        error.response.headers["x-ratelimit-remaining"] === "0"
          ? "GitHub API rate limit exceeded. Please try again after 1 hour."
          : "Access forbidden by GitHub API.";
      return res.status(429).json({
        error: rateLimitMessage,
        details: error.message,
      });
    }

    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "GitHub user or repo not found" });
    }

    res.status(500).json({
      error: "Failed to fetch issues",
      details: error.message,
    });
  }
};

export { getMarks };
