import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend's origin
    credentials: true,
  })
);

app.get("/auth/github", (req, res) => {
  const redirect_uri = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:4000/auth/github/callback`;
  res.redirect(redirect_uri);
});

app.get("/auth/github/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // 1. Exchange code for access token
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

    // 2. Use access token to fetch user profile
    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const user = userRes.data;

    // 3. Send user back to frontend via postMessage
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(${JSON.stringify(
              user
            )}, "http://localhost:5173");
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

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
