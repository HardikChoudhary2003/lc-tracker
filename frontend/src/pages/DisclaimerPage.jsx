import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

function DisclaimerPage() {
  useEffect(() => {
    document.title = 'Disclaimer - LeetCode Tracker';
  }, []);

  return (
    // Styling consistent with Credits/Privacy pages
    <div className="py-10 px-6 sm:px-8 lg:px-10 mt-8 relative"> 
      
      {/* Back to Home Link */}
      <Link 
        to="/dashboard" 
        className="absolute top-4 left-4 sm:left-6 lg:left-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        aria-label="Back to Dashboard"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center pt-8 sm:pt-0">
        🔍 Data Source Disclaimer
      </h1>
      
      {/* Consistent prose styling */}
      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6 text-base leading-relaxed">
        <p>
          This project uses data retrieved from LeetCode through publicly accessible endpoints observed via browser developer tools.
        </p>
        <p className="font-medium"> 
          Please note: LeetCode does not provide an officially documented public API for third-party use. All data is fetched in read-only mode, respecting the platform's integrity and usage policies.
        </p>
        <p>
          We do not store or distribute any LeetCode content — this tracker simply visualizes data available to authenticated users via their own session key.
        </p>
        <p>
          All rights to problem content, contests, and user data remain the property of LeetCode.
        </p>
        <p className="pt-6 border-t border-gray-300 dark:border-gray-600 mt-10 font-semibold tracking-tight text-center">
          No scraping. No spam. Just vibes. ✨
        </p>
      </div>
    </div>
  );
}

export default DisclaimerPage;
