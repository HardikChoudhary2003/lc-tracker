import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react'; // Using lucide-react for icons

function WarningBanner({ message, storageKey }) {
  // Check local storage to see if the banner was previously dismissed
  const [isVisible, setIsVisible] = useState(() => {
    if (!storageKey) return true; // If no storage key, always show initially
    // Use sessionStorage to check dismissal state only for the current session
    return sessionStorage.getItem(storageKey) !== 'dismissed';
  });

  const handleDismiss = () => {
    setIsVisible(false);
    if (storageKey) {
      // Use sessionStorage to store dismissal state only for the current session
      sessionStorage.setItem(storageKey, 'dismissed');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    // Removed background colors, adjusted text/icon colors for contrast on potentially gray backgrounds
    <div className="border-l-4 border-yellow-500 dark:border-yellow-400 text-gray-800 dark:text-gray-200 p-4 my-4 rounded-md shadow-md flex items-center justify-between" role="alert">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="ml-4 p-1 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400"
        aria-label="Dismiss warning"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export default WarningBanner;
