import axios from "axios";
import { repoData } from "../Model/repoData.model.js";

const isOlderThan24Hours = (date) => {
  if (!date) return true;
  const now = new Date();
  const lastUpdated = new Date(date);
  const diffInHours = (now - lastUpdated) / (1000 * 60 * 60);
  return diffInHours > 24;
};

const repoRank = async (organization, repo, token) => {
  const cachedData = await repoData.findOne({ organization, repo });

  if (cachedData && !isOlderThan24Hours(cachedData.updatedAt)) {
    return cachedData.responseData.sort((a, b) => b.marks - a.marks);
  }

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
    .map(([assignee, marks]) => ({ assignee, marks }));

  // Add upsert: true to create if doesn't exist, and add timestamps
  await repoData.findOneAndUpdate(
    { organization, repo },
    {
      organization,
      repo,
      responseData: sortedScoresAllTime,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

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
  let allReposFresh = true;

  // First pass: Check if all repos have fresh data
  for (const repo of repos) {
    const cachedData = await repoData.findOne({
      organization,
      repo: repo.name,  // Changed from 'Repo' to 'repo' for consistency
    });

    if (!cachedData || isOlderThan24Hours(cachedData.updatedAt)) {
      allReposFresh = false;
      break;
    }
  }

  // Second pass: Process data
  for (const repo of repos) {
    let repoData;
    
    if (allReposFresh) {
      // Use cached data
      repoData = await repoData.findOne({
        organization,
        repo: repo.name,
      });
    } else {
      // Fetch fresh data (which will be saved to DB)
      repoData = await repoRank(organization, repo.name, token);
    }

    // Handle both cases (DB document or direct API response)
    const contributors = Array.isArray(repoData) ? repoData : repoData.responseData;
    
    contributors.forEach(({ assignee, marks }) => {
      assigneeScoresAllTime[assignee] =
        (assigneeScoresAllTime[assignee] || 0) + marks;
    });
  }

  const sortedScoresAllTime = Object.entries(assigneeScoresAllTime)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([assignee, marks]) => ({ assignee, marks }));

  return sortedScoresAllTime;
};

export { repoRank, organizationRank };