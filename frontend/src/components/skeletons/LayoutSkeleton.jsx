import React from 'react';

const LayoutSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Simple header skeleton */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* App name */}
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          
          {/* Avatar */}
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      </header>
      
      {/* Main content - positioned to match the actual app layout */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Search bar skeleton - aligned to match app */}
        <div className="mb-6">
          <div className="max-w-md h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        
        {/* Section title */}
        <div className="mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64"></div>
        </div>
        
        {/* Contest cards - positioned to match actual layout */}
        <div className="w-full">
          {/* First contest card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
            <div className="flex justify-between mb-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
            </div>
            
            {/* Simple grid-like structure to match contest layout */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Second contest card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex justify-between mb-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
            </div>
            
            {/* Simple grid-like structure */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Simple footer skeleton */}
      <footer className="bg-white dark:bg-gray-800 py-3 mt-auto border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
        </div>
      </footer>
    </div>
  );
};

export default LayoutSkeleton;
