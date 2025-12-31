# LeetCode Tracker Frontend

This is the frontend part of the LeetCode Tracker application, built with React and Vite. It provides the user interface for interacting with the LeetCode Tracker backend.

## Tech Stack

*   **Framework/Library:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (or specify if using something else like Material UI, CSS Modules, etc.)
*   **State Management:** (Specify if using Redux, Zustand, Context API, etc.)
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios (or Fetch API)
*   **Language:** TypeScript / JavaScript

## Features

*   User authentication via Google OAuth.
*   Dashboard displaying LeetCode statistics (problems solved, submission stats).
*   Securely store and manage LeetCode session key for data fetching.
*   (Add other specific features)

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd lc-tracker/frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:** Create a `.env` file in the `frontend` directory (refer to the section below).
4.  **Start development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173`.

## Environment Variables

### Local Development

For local development, create a `.env` file in the `frontend` root directory with the following variable:

```dotenv
# .env
# URL of the locally running backend server
VITE_BACKEND_URL=http://localhost:3000
```

This variable tells the frontend where the backend API is running locally. Vite exposes variables prefixed with `VITE_` to the client-side code via `import.meta.env`.