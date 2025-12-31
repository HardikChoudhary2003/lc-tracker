import React from 'react';

const LoginCardSkeleton = () => {
  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors">
      <div className="text-center">
        {/* Title skeleton */}
        <div className="mt-6 h-9 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        {/* Subtitle skeleton */}
        <div className="mt-2 h-4 w-72 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      
      {/* Button skeleton */}
      <div className="mt-8">
        <div className="w-full h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoginCardSkeleton;
