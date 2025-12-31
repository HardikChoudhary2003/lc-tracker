# LeetCode Tracker (lc-tracker)

A comprehensive web application to track your LeetCode contest progress, view upcoming contests, monitor recent submissions, and visualize your problem-solving status.

---

## ✨ Features

-   **🔐 Secure Google OAuth Login:** Authenticate quickly and securely using your Google account.
-   **📊 Dashboard:**
    -   View past Weekly & Biweekly contests in a paginated grid.
    -   See problems within each contest, including titles and difficulty credits.
    *   Track your solve status for each problem (requires adding your LeetCode session key via the UI).
    *   Status indicators update automatically as you scroll (lazy loading via IntersectionObserver).
    *   Manual "Sync Status" button to refresh problem statuses on demand.
-   **📅 Upcoming Contests:**
    *   Dedicated page listing future contests.
    *   Live countdown timer for each upcoming contest.
    *   Direct links to register on LeetCode.
-   **📄 Recent Submissions:**
    *   View your latest LeetCode submissions in a paginated table.
    *   See submission time, problem title (linked), status, runtime, and language.
-   **🔍 Search:** Find specific contests or problems by searching titles.
-   **🚀 Performance:**
    *   Client-side caching of problem statuses using IndexedDB for fast subsequent loads.
    *   Lazy loading of problem statuses to reduce initial load time.
    *   Backend caching for search results (though population mechanism needs review).
    *   Efficient backend queries and frontend rendering.
-   **🎨 Modern UI:**
    *   Clean, responsive interface built with React and Tailwind CSS.
    *   Full Dark Mode support.
    *   Loading skeletons for a smoother user experience.
-   **⚙️ Secure Backend:**
    *   Node.js/Express backend handles authentication and proxies LeetCode API requests securely.
    *   User LeetCode session keys are encrypted at rest.

---

## 🧰 Tech Stack

-   **Frontend:** React, Vite, Tailwind CSS, Axios, React Router DOM
-   **Backend:** Node.js, Express, Mongoose, Passport.js (Google OAuth 2.0 strategy), Axios, node-cron
-   **Database:** MongoDB (stores user profiles, contest data, server-side problem status cache)
-   **Client-side Storage:** IndexedDB (problem status cache), LocalStorage (dark mode preference, login status hint)
-   **External APIs:**
    *   LeetCode GraphQL API (contests, problems, user status, problem status)
    *   LeetCode REST API (submissions)
    *   Google OAuth 2.0 API (authentication)
    *   YouTube Data API v3 (optional, for fetching contest video links)

---

## 🛠️ Local Setup

### Prerequisites

-   Node.js (v16 or later recommended)
-   npm or yarn
-   MongoDB instance (local or cloud like MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone <your-repo-url> lc-tracker
cd lc-tracker
```

### 2. Install Dependencies

Install dependencies for both the backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

### 3. Configure Environment Variables

#### Backend (`backend/.env`)

Create a `.env` file inside the `backend` directory:

```bash
touch backend/.env
```

Add the following variables, replacing placeholder values:

```dotenv
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority

# Session Secret (a long random string)
SESSION_SECRET=YOUR_VERY_SECRET_RANDOM_STRING_HERE

# Google OAuth Credentials (obtain from Google Cloud Console)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# Application URLs (adjust ports if necessary)
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# LeetCode Tokens (Needed for backend contest fetching job)
# How to get: Login to leetcode.com, open DevTools -> Application -> Cookies
# Copy the value for 'csrftoken'
CSRF_TOKEN=YOUR_LEETCODE_CSRF_TOKEN

# YouTube API Key (Optional - for contest video link fetching/updating)
# Obtain from Google Cloud Console if needed
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY

# YouTube Channel IDs (Optional - for contest video link scripts)
YOUTUBE_CHANNEL_ID_1=TARGET_YOUTUBE_CHANNEL_ID_1
YOUTUBE_CHANNEL_ID_2=TARGET_YOUTUBE_CHANNEL_ID_2
```

> **Note:** The `LEETCODE_SESSION` token is **not** required in the backend `.env`. Users add their session key via the UI if they want status tracking, and it's stored encrypted in the database. The `CSRF_TOKEN` is used by the backend job that fetches contest data.

#### Frontend (`frontend/.env`)

Create a `.env` file inside the `frontend` directory:

```bash
touch frontend/.env
```

Add the following variable:

```dotenv
# URL of the running backend server
VITE_BACKEND_URL=http://localhost:3000
```

### 4. Run the Application

You need two terminals open: one for the backend and one for the frontend.

**Terminal 1: Run Backend**

```bash
cd backend
npm run dev
# Or: node server.js
```

The backend server should start, typically on port 3000.

**Terminal 2: Run Frontend**

```bash
cd frontend
npm run dev
```

The frontend development server (Vite) should start, typically on port 5173.

### 5. Access the Application

Open your browser and navigate to the frontend URL (usually `http://localhost:5173`). You should be redirected to the Google login page.

---

## 🌐 Project Structure

```
lc-tracker/
├── backend/
│   ├── server.js           # Main Express server setup
│   ├── config/             # Passport setup, etc.
│   ├── controllers/        # Route handlers (logic for API endpoints)
│   ├── jobs/               # Scheduled tasks (e.g., contest fetching)
│   ├── middleware/         # Custom middleware (e.g., auth checks)
│   ├── models/             # Mongoose schemas (User, Contest, ProblemStatusCache)
│   ├── routes/             # API route definitions (auth, api, profile)
│   ├── services/           # Business logic separation (e.g., search, video)
│   ├── scripts/            # Standalone utility scripts
│   ├── utils/              # Helper utilities (crypto, API wrappers)
│   └── .env                # Backend environment variables (GITIGNORED)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main application component, routing
│   │   ├── main.jsx        # Application entry point
│   │   ├── assets/         # Static assets (if any)
│   │   ├── components/     # Reusable UI components (shared)
│   │   ├── common/         # Common components/utilities
│   │   ├── context/        # React Context providers (e.g., AuthContext)
│   │   ├── features/       # Feature-specific modules (auth, dashboard, contest, etc.)
│   │   │   └── .../ (pages, components, hooks)
│   │   ├── hooks/          # Custom React hooks (shared)
│   │   ├── layout/         # Layout components (Header, Footer, Layout)
│   │   ├── pages/          # Static pages (Credits, Privacy, etc.)
│   │   ├── services/       # Frontend API service wrappers (e.g., leetcodeService)
│   │   ├── styles/         # CSS files
│   │   └── utils/          # Frontend utilities (IndexedDB, helpers)
│   ├── public/             # Static files served by Vite
│   ├── index.html          # Main HTML entry point
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── .env                # Frontend environment variables (GITIGNORED)
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md               # This file
```

---

## 🚀 Deployment

-   **Frontend (React/Vite):** Deploy easily to static hosting platforms like Vercel, Netlify, or Cloudflare Pages. Ensure the `VITE_BACKEND_URL` environment variable is set correctly during the build process to point to your deployed backend URL.
-   **Backend (Node.js/Express):** Deploy to platforms like Render, Fly.io, Railway, or Heroku.
    -   Ensure all necessary environment variables from `backend/.env` are configured in your hosting provider's settings.
    -   Make sure your `BACKEND_URL` and `FRONTEND_URL` environment variables on the backend match your deployed frontend and backend URLs respectively (especially important for OAuth redirects and CORS).
    -   Configure CORS correctly in `backend/server.js` if needed for your deployed frontend origin.

---

## ⚙️ Available Scripts

The `backend/scripts/` directory contains utility scripts:

-   `updateContestLinks.js`: Attempts to find and update YouTube video links for contests in the database. Requires YouTube API key and channel IDs configured in `.env`. Run with `node backend/scripts/updateContestLinks.js`.
-   `updateProblemCredits.js`: Fetches the latest problem credit information from LeetCode and updates the database. Run with `node backend/scripts/updateProblemCredits.js`.

---

## 💬 Contribute

Found a bug? Have suggestions? Feel free to open an issue or submit a pull request!

---

## 📜 License

MIT
