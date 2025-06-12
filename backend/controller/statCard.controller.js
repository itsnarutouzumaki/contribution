import * as cardResponse from './../utils/cardResponse.utils.js';

const statCard = async (req, res) => {
  try {
    const { organization, repo } = req.query;
    let response;
    if (!organization) {
      return res.status(400).json({ error: "Organization is required" });
    }

    if (!repo) {
      response = await cardResponse.organizationRank(organization, process.env.ACCESS_TOKEN);
    } else {
      response = await cardResponse.repoRank(organization, repo, process.env.ACCESS_TOKEN);
      response=response.slice(0, 5);
    }

    const startY = 60;
    const rowHeight = 40;

    const svgRows = response.map((entry, index) => {
      return `
        <g transform="translate(10, ${startY + index * rowHeight})">
          <text x="0" y="0" font-size="18" fill="#FFD700">${index + 1}.</text>
          <text x="30" y="0" font-size="18" fill="#FFFFFF">${entry.assignee}</text>
          <text x="280" y="0" font-size="18" fill="#00FFAA" text-anchor="end">${entry.marks}</text>
        </g>
      `;
    }).join('');

    const height = startY + response.length * rowHeight;

    const titleText = repo
      ? `🏆 Repo Contribution Rank`
      : `🏆 Organization Contribution Rank`;

    const svg = `
      <svg width="300" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          text { font-family: 'Segoe UI', sans-serif; dominant-baseline: middle; }
        </style>
        <rect width="100%" height="100%" fill="#1e1e1e" rx="10" />
        <text x="150" y="20" text-anchor="middle" font-size="16" fill="#FFFFFF">${titleText}</text>
        ${svgRows}
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (error) {
    console.error("Error in statCard:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { statCard };
