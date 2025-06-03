# GitHub Login

A simple project to demonstrate GitHub OAuth login integration with separate frontend and backend installations.

## Features

- GitHub OAuth authentication
- Secure session management
- User profile retrieval from GitHub
- Environment-based configuration

## Limitations

- Only supports GitHub as an OAuth provider
- No database integration (user data is not persisted)
- 500- GitHub API call per user per hours

## Installation

### 1. **Clone the repository:**
```bash
git clone https://github.com/itsnarutouzumaki/contribution.git
cd github-login
```

### 2. **Install backend dependencies:**
```bash
cd backend
npm install
```

### 3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

### 4. **Setup environment variables for backend:**
- Copy `.sample.env` to `.env` in the `backend` directory:
  ```bash
  cp .sample.env .env
  ```
- Edit `backend/.env` and fill in the required values:
  - `GITHUB_CLIENT_ID`: Your GitHub OAuth app client ID
  - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth app client secret
  - `SESSION_SECRET`: A random string for session encryption
  - `CALLBACK_URL`: The callback URL registered with your GitHub OAuth app

### 5. **Run the backend application:**
```bash
cd backend
npm run start
```

### 6. **Run the frontend application:**
```bash
cd ../frontend
npm run dev
```

### 7. **Open your browser:**
- Visit the frontend port and click "Login with GitHub"

## .env Configuration (Backend)

Your `backend/.env` file should look like as `backend/.sample.env`

## Process Overview

1. User clicks "Login with GitHub" on the frontend.
2. User is redirected to GitHub for authentication.
3. After successful login, GitHub redirects back to your backend.
4. The backend exchanges the code for an access token.
5. User profile information is retrieved and sent to the frontend for display.

