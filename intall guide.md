---

## ✅ **1. Clone the Repository**

```bash
git clone https://github.com/itsnarutouzumaki/contribution
cd contribution
```

---

## ✅ **2. Install Frontend Dependencies**

```bash
cd frontend
npm install
```

---

## ✅ **3. Set Up Frontend Environment File**

Create a file named `.env` inside the `frontend` directory:

```bash
touch .env
```

Paste the following in `.env`:

```
VITE_BACKEND_URL=https://your-hosted-backend.com
```

Replace `https://your-hosted-backend.com` with your actual **backend hosted URL** (e.g., from Render, Railway, or any other hosting platform).

---

## ✅ **4. Install Backend Dependencies**

Go to backend directory:

```bash
cd ../backend
npm install
```

---

## ✅ **5. Set Up Backend Environment File**

Create a `.env` file in the `backend` directory:

```bash
touch .env
```

Paste the following in `.env`:

```
CLIENT_ID=your_github_client_id
CLIENT_SECRET=your_github_client_secret
ORGANIZATION_NAME=your_github_organization_name
ACCESS_TOKEN=temporary_placeholder_token
FRONTEND_URL=https://your-frontend-url.com
BACKEND_URL=https://your-backend-url.com
```

✅ **Note**:

* `CLIENT_ID` and `CLIENT_SECRET` will be generated when you create a GitHub OAuth App (explained below).
* `ACCESS_TOKEN` will be dynamically set later from the cookie after GitHub login (initially set a dummy placeholder).
* `ORGANIZATION_NAME`: name of the GitHub org you want to fetch stats for.

---

## ✅ **6. Create a GitHub OAuth App**

Go to: [https://github.com/settings/developers](https://github.com/settings/developers)

* Click on **"New OAuth App"**
* Fill the form as below:

### → Application name:

Any name (e.g., Contribution Tracker)

### → Homepage URL:

```
https://your-frontend-url.com
```

### → Authorization callback URL:

```
https://your-backend-url.com/api/github/callback
```

> ⚠️ Important: The callback URL **must** match your backend GitHub login route (i.e., where GitHub will redirect after auth).

### → Click "Register application"

You will now get:

* **Client ID**
* **Client Secret**

Copy both and paste them in your `.env` in the backend.

---

## ✅ **7. GitHub Login Flow**

1. When user clicks “Login with GitHub” from frontend:

   * Frontend redirects to GitHub login using the `CLIENT_ID`.

2. GitHub redirects back to:

   ```
   https://your-backend-url.com/api/github/callback
   ```

3. Backend exchanges the code received with:

   * Access Token (short-lived)
   * This access token is set in cookies.

4. You can inspect the token by:

   * Open browser
   * DevTools → Application tab → Cookies
   * Look for `access_token` value

⚠️ This is the **token you can use** in `.env` → `ACCESS_TOKEN=` (only needed for testing or direct API usage — the app works dynamically via login otherwise).

---

## ✅ **8. Run the App (Locally)**

### Start Backend:

```bash
cd backend
npm run dev
```

### Start Frontend:

```bash
cd frontend
npm run dev
```

---

## ✅ **9. Deploying**

### Frontend Deployment:

You can deploy on:

* Netlify
* Vercel

Just point it to `/frontend` directory.
Set **Environment Variable**:

```
VITE_BACKEND_URL=https://your-backend-url.com
```

### Backend Deployment:

You can deploy on:

* Render
* Railway
* Cyclic

Set these environment variables in the backend host:

```
CLIENT_ID=
CLIENT_SECRET=
ACCESS_TOKEN=
FRONTEND_URL=
BACKEND_URL=
ORGANIZATION_NAME=
```

---

## ✅ **10. Test GitHub Auth Flow**

* Go to your deployed frontend
* Click on **“Login with GitHub”**
* Authorize the app
* Token will be set in cookie
* You'll be able to fetch data like organization rank, repo rank etc.

---
