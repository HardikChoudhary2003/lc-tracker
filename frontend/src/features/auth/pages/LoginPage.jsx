import { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Updated import path


// Load environment variables


function LoginPage() {
  const { user } = useAuth();

  useEffect(() => {
    // Update document title
    document.title = 'Login - LeetCode Tracker';
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_BACKEND_URL + '/auth/google';
  };

  return (
    // Add dark mode background to the main container
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"> 
      {/* Add dark mode background to the card */}
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"> 
        <div className="text-center">
          {/* Add dark mode text color to the heading */}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100"> 
            LeetCode Tracker
          </h2>
          {/* Add dark mode text color to the paragraph */}
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"> 
            Track your LeetCode progress and stay motivated
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={handleGoogleLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                // Removed duplicate viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                viewBox="0 0 48 48" // Correct viewBox for Google icon
              >
                {/* Google Icon SVG Path */}
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </span>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
