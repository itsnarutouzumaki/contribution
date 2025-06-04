import axios from "axios";

/**
 * Retrieves and calculates marks for a given user based on closed GitHub issues
 * across all repositories in a specified organization. Marks are determined by
 * issue labels matching the pattern "sp-<number>". The function computes scores
 * for all time, the last 60 days, and the last 30 days, and returns sorted
 * leaderboards for recent activity and all-time performance.
 *
 * Authentication is performed using an access token from cookies. Handles
 * GitHub API rate limits and various error scenarios.
 *
 * Response JSON structure:
 *   - totalIssues: Total number of closed issues processed.
 *   - repos: Array of repository metadata.
 *   - sortedScoresLast30: Array of assignee scores for the last 30 days, sorted descending.
 *   - sortedScoresAllTime: Array of assignee scores for all time, sorted descending.
 *   - remainingAPICall: Number of GitHub API calls remaining (rate limit).
 *
 * @async
 * @function getMarks
 * @param {import('express').Request} req - Express request object, expects 'username' in body and 'accessToken' cookie.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with marks data or an error message.
 */
const getMarks = async (req, res) => {

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
