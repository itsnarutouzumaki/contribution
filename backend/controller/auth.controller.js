import axios from "axios";

/**
 * Initiates GitHub OAuth authentication by redirecting the user
 * to GitHub's authorization page with the required client ID and redirect URI.
 */
const auth = (req, res) => {
  // Construct the GitHub OAuth authorization URL
  const redirect_uri = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.BACKEND_URL}/auth/github/callback`;
  // Redirect the user to GitHub for authentication
  res.redirect(redirect_uri);
};

/**
 * Handles the OAuth callback from GitHub.
 * Exchanges the authorization code for an access token,
 * fetches the authenticated user's profile, and sets a secure cookie.
 */
const authCallback = async (req, res) => {
  // Extract the authorization code from the query parameters
  const code = req.query.code;

  // If no code is provided, return an error
  if (!code) {
    return res.status(400).send("Missing code parameter");
  }

  try {
    // Exchange the authorization code for an access token
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

    // Extract the access token from the response
    const access_token = tokenRes.data.access_token;

    // If no access token is received, throw an error
    if (!access_token) {
      throw new Error("No access token received");
    }

    // Fetch the authenticated user's profile from GitHub
    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
        Accept: "application/vnd.github+json",
      },
    });

    // Extract user data from the response
    const user = userRes.data;

    // Set the access token in a secure HttpOnly cookie
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    // Send a script to the client to post the user data to the opener window and close the popup
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
    // Handle errors during the OAuth process
    res.status(500).send("Authentication failed");
  }
};

export { auth, authCallback };
