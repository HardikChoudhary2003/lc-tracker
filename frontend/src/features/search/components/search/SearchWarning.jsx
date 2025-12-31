import React from 'react';

function SearchWarning({ show }) {
  if (!show) return null;

  return (
    <div className="mt-2 flex items-center text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md">
      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <p className="text-sm font-medium">
        Please enter at least 3 characters to search
      </p>
    </div>
  );
}

export default SearchWarning;
