import * as cardResponse from './../utils/cardResponse.utils.js';

/**
 * Controller to generate a contribution ranking SVG card for an organization or repository.
 * Responds with an SVG image showing the top contributors.
 *
 * Query Parameters:
 *   - organization (string, required): The organization name.
 *   - repo (string, optional): The repository name within the organization.
 *
 * Behavior:
 *   - If only organization is provided, returns organization-wide ranking.
 *   - If both organization and repo are provided, returns top 5 contributors for the repo.
 *
 * Response:
 *   - SVG image with contributor rankings.
 */
const statCard = async (req, res) => {
  try {
    const { organization, repo } = req.query;
    let response;

    // Validate required query parameter
    if (!organization) {
      return res.status(400).json({ error: "Organization is required" });
    }

    // Fetch ranking data based on presence of repo parameter
    if (!repo) {
      response = await cardResponse.organizationRank(organization, process.env.ACCESS_TOKEN);
    } else {
      response = await cardResponse.repoRank(organization, repo, process.env.ACCESS_TOKEN);
      response = response.slice(0, 5); // Limit to top 5 contributors for repo
    }

    // SVG layout configuration
    const startY = 60;
    const rowHeight = 40;

    // Generate SVG rows for each contributor
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

    // Set dynamic title based on context
    const titleText = repo
      ? `🏆 Repo Contribution Rank`
      : `🏆 Organization Contribution Rank`;

    // Build SVG response
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

    // Set response headers and send SVG
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (error) {
    // Log error and return generic server error response
    console.error("Error in statCard:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { statCard };
