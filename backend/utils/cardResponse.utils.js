import axios from "axios";

const repoRank = async (organization, repo, token) => {
  const assigneeScoresAllTime = {};
  let page_no = 1;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  while (true) {
    const response = await axios.get(
      `https://api.github.com/repos/${organization}/${repo}/issues?state=closed&per_page=100&page=${page_no}`,
      { headers }
    );

    const issues = response.data;

    for (const issue of issues) {
      if (!issue.assignee || !issue.assignee.login) continue;

      const assigneeName = issue.assignee.login;

      const spLabel = issue.labels.find((label) =>
        /^sp\s*-\s*\d+$/i.test(label.name)
      );

      if (spLabel) {
        const marks = parseInt(spLabel.name.split("-")[1].trim());
        if (!isNaN(marks)) {
          assigneeScoresAllTime[assigneeName] =
            (assigneeScoresAllTime[assigneeName] || 0) + marks;
        }
      }
    }

    if (issues.length < 100) break;
    page_no++;
  }

  const sortedScoresAllTime = Object.entries(assigneeScoresAllTime)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([assignee, marks]) => ({ assignee, marks }));

  return sortedScoresAllTime;
};

const organizationRank = async (organization, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  const reposResponse = await axios.get(
    `https://api.github.com/users/${organization}/repos`,
    { headers }
  );

  const repos = reposResponse.data;
  const assigneeScoresAllTime = {};

  var remainingAPICall;

  for (const repo of repos) {
    let page_no = 1;

    while (true) {
      const issuesResponse = await axios.get(
        `https://api.github.com/repos/${organization}/${repo.name}/issues?state=closed&per_page=100&page=${page_no}`,
        { headers }
      );

      const issues = issuesResponse.data;
      remainingAPICall=parseInt(
            issuesResponse.headers["x-ratelimit-remaining"]
          );
      for (const issue of issues) {
        if (!issue.assignee || !issue.assignee.login) continue;

        const assigneeName = issue.assignee.login;

        const spLabel = issue.labels.find((label) =>
          /^sp\s*-\s*\d+$/i.test(label.name)
        );

        if (spLabel) {
          const marks = parseInt(spLabel.name.split("-")[1].trim());
          if (!isNaN(marks)) {
            assigneeScoresAllTime[assigneeName] =
              (assigneeScoresAllTime[assigneeName] || 0) + marks;
          }
        }
      }

      if (issues.length < 100) break;
      page_no++;
    }
  }
  const sortedScoresAllTime = Object.entries(assigneeScoresAllTime)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([assignee, marks]) => ({ assignee, marks }));

  return sortedScoresAllTime;
};

export { repoRank, organizationRank };
