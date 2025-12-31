# LeetCode Tracker Backend

This is the backend part of the LeetCode Tracker application, responsible for handling user authentication, storing user data, interacting with the LeetCode API (or simulating it), and providing data to the frontend.

## Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Authentication:** Passport.js (Google OAuth 2.0 strategy), Express Session
*   **Encryption:** Node.js `crypto` module
*   **Environment Variables:** `dotenv`

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd lc-tracker/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:** Create a `.env` file in the `backend` directory (refer to the section below).
4.  **Start development server:**
    ```bash
    npm start
    ```
    The server will typically run on `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the `backend` root directory with the following variables:

```dotenv
# MongoDB connection string
MONGODB_URI=your_mongodb_connection_string

# Google OAuth Credentials (obtain from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Express Session Secret (a long, random string)
SESSION_SECRET=your_session_secret

# Secret for encrypting/decrypting LeetCode session keys (a long, random string)
LEETCODE_KEY_ENCRYPTION_SECRET=your_encryption_secret

# URL of the deployed frontend (used for CORS and redirects)
# For local development:
FRONTEND_URL=http://localhost:5173
# For production:
# FRONTEND_URL=https://your-deployed-frontend-url.com
```

## API Endpoints

*(Note: This is a summary. Refer to the route files in `src/routes/` for detailed implementation.)*

*   **Authentication (`/auth`)**
    *   `GET /google`: Initiates the Google OAuth flow.
    *   `GET /google/callback`: Handles the callback from Google after authentication.
    *   `GET /logout`: Logs the user out and destroys the session.
    *   `GET /session`: Checks if a user session exists and returns user data.
*   **User (`/api/user`)**
    *   `GET /profile`: Retrieves the profile of the logged-in user.
    *   `POST /leetcode-key`: Saves/updates the user's LeetCode session key (encrypted).
    *   `DELETE /leetcode-key`: Deletes the user's LeetCode session key.
*   **LeetCode Data (`/api/leetcode`)**
    *   `GET /stats`: Fetches user stats (requires LeetCode key).
    *   `GET /submissions`: Fetches recent submissions (requires LeetCode key).
    *   *(Add other LeetCode related endpoints as needed)*

## Authentication Flow

1.  Frontend redirects the user to `GET /auth/google`.
2.  Backend redirects the user to Google's OAuth consent screen.
3.  User logs in and grants permission.
4.  Google redirects the user back to `GET /auth/google/callback`.
5.  Passport middleware verifies the Google profile, finds or creates a user in the database.
6.  User information is stored in an Express session, identified by a cookie sent to the browser.
7.  Backend redirects the user back to the frontend (`FRONTEND_URL`).
8.  Subsequent requests from the frontend include the session cookie, allowing the backend to identify the logged-in user.
9.  `GET /auth/session` can be used by the frontend on page load to check authentication status.
10. `GET /auth/logout` destroys the session on the server and clears the cookie.

## Database

*   Uses MongoDB to store user information.
*   Mongoose is used as the ODM (Object Data Modeling) library.
*   Key Schemas:
    *   **User:** Stores Google profile ID, display name, email, avatar, and encrypted LeetCode session key.
*   Refer to `src/models/` for schema definitions.

## LeetCode Session Key

*   The user's LeetCode session key is required to fetch certain data directly from LeetCode's internal APIs.
*   The key is provided by the user via the frontend.
*   It is **encrypted** using Node.js `crypto` and the `LEETCODE_KEY_ENCRYPTION_SECRET` before being stored in the database.
*   It is **decrypted** only when needed to make requests to LeetCode on the user's behalf.
*   **Security Note:** Handle this key with care. Ensure the `LEETCODE_KEY_ENCRYPTION_SECRET` is strong and kept confidential.

## Deployment Notes

*   Ensure all environment variables listed above are set in your production environment (e.g., Vercel, Heroku, AWS environment variables).
*   Set `NODE_ENV=production` in your production environment for optimizations.
*   Configure CORS properly by setting `FRONTEND_URL` to your deployed frontend's URL.
*   Ensure your database is accessible from your deployment environment.
*   Consider using a process manager like `pm2` for running the Node.js application in production.