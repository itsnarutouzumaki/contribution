import axios from "axios";

const auth = (req, res) => {
  // console.log("/auth/github got hit");
  const redirect_uri = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=https://contribution-1.onrender.com/auth/github/callback`;
  // console.log("redirected successfully");
  res.redirect(redirect_uri);
};

const authCallback = async (req, res) => {
  // console.log("/auth/github/callback got hit");
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing code parameter");
  }

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
    // console.log("token res got");
    const access_token = tokenRes.data.access_token;

    if (!access_token) {
      throw new Error("No access token received");
    }

    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
        Accept: "application/vnd.github+json",
      },
    });
    // console.log("userRes got");
    const user = userRes.data;

    // Set the access token in a secure HttpOnly cookie
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", access_token, options).send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(${JSON.stringify({ user })}, "*");
            window.close();
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    // console.error("OAuth Error:", err.message);
    res.status(500).send("Authentication failed");
  }
};

export { auth, authCallback };
