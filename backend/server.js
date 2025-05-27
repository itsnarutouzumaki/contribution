import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/auth/github", (req, res) => {
  const redirect_uri = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:4000/auth/github/callback`;
  res.redirect(redirect_uri);
});

app.get("/auth/github/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const user = userRes.data;

    // Set the access token in a secure HttpOnly cookie
    const options = {
      httpOnly: true,
      secure: false, // Set true only in production with HTTPS
      sameSite: "Lax",
    };

    res.cookie("accessToken", access_token, options).send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(${JSON.stringify({
              user,
            })}, "http://localhost:5173");
            window.close();
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("OAuth Error:", err.message);
    res.status(500).send("Authentication failed");
  }
});

app.post("/get/marks", async (req, res) => {
  console.log("Got hit");

  const ORGANIZATION_NAME = process.env.ORGANIZATION_NAME;
  const { username } = req.body;
  const access_token = req.cookies?.accessToken;

  if (!access_token) {
    return res.status(401).json({ error: "Access token missing or expired" });
  }

  try {
    const headers = {
      Authorization: `token ${access_token}`,
    };

    const reposResponse = await axios.get(
      `https://api.github.com/users/${ORGANIZATION_NAME}/repos`,
      { headers }
    );

    const repos = reposResponse.data;
    console.log(
      `Found ${repos.length} repos for Organization ${ORGANIZATION_NAME}`
    );

    const assigneeScores = {};
    const assigneeScoresLast30 = {};
    assigneeScores[username] = 0;
    assigneeScoresLast30[username] = 0;
    let allIssues = [];

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (const repo of repos) {
      let page_no = 1;
      while (true) {
        const issuesResponse = await axios.get(
          `https://api.github.com/repos/${ORGANIZATION_NAME}/${repo.name}/issues?state=closed&per_page=100&page=${page_no}`,
          { headers }
        );

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
              // Total marks
              assigneeScores[assigneeName] =
                (assigneeScores[assigneeName] || 0) + marks;

              // Last 30 days
              const closedDate = new Date(issue.closed_at);
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

    const sortedScores = Object.entries(assigneeScores)
      .sort((a, b) => b[1] - a[1])
      .map(([assignee, marks]) => ({ assignee, marks }));

    const sortedScoresLast30 = Object.entries(assigneeScoresLast30)
      .sort((a, b) => b[1] - a[1])
      .map(([assignee, marks]) => ({ assignee, marks }));

    res.json({
      totalIssues: allIssues.length,
      repos,
      sortedScores,
      sortedScoresLast30,
    });
  } catch (error) {
    console.error("API Error:", error.message);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "GitHub user or repo not found" });
    }
    res.status(500).json({
      error: "Failed to fetch issues",
      details: error.message,
    });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
