import React from 'react';

const ContestGridSkeleton = () => {
  // Reduce the number of skeleton rows from 5 to 3
  const skeletonRows = Array(3).fill(0);
  
  return (
    <div className="overflow-x-auto sm:overflow-visible max-h-[70vh]">
      {/* Match the grid structure exactly */}
      <div className="sm:grid sm:grid-cols-[auto_repeat(4,minmax(0,1fr))] w-full gap-x-4 gap-y-2 block">
        {/* Replace text headers with skeleton placeholders */}
        <div className="hidden sm:block p-3 border-b-2 border-gray-200 dark:border-gray-600">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
        </div>
        <div className="hidden sm:flex justify-center p-3 border-b-2 border-gray-200 dark:border-gray-600">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
        </div>
        <div className="hidden sm:flex justify-center p-3 border-b-2 border-gray-200 dark:border-gray-600">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
        </div>
        <div className="hidden sm:flex justify-center p-3 border-b-2 border-gray-200 dark:border-gray-600">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
        </div>
        <div className="hidden sm:flex justify-center p-3 border-b-2 border-gray-200 dark:border-gray-600">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
        </div>
        
        {/* Skeleton rows with mobile view support */}
        <div className="sm:contents block space-y-4 mb-4">
          {skeletonRows.map((_, index) => (
            <div key={index} className="sm:contents block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              {/* Contest title cell - reduced height */}
              <div className="p-2 border-b border-gray-200 dark:border-gray-600 sm:border-t sm:border-l">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
              
              {/* Problem cells - 4 of them, with reduced height */}
              {Array(4).fill(0).map((_, problemIndex) => (
                <div 
                  key={problemIndex} 
                  className="p-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40 sm:border-t-0 sm:border-l-0 border-t border-l border-r border-gray-200 dark:border-gray-700 sm:border-r-0 sm:rounded-none rounded-sm mt-1 sm:mt-0 mx-1 sm:mx-0"
                >
                  {/* Problem title - smaller */}
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-4/5 mb-2"></div>
                  
                  {/* Status indicator - smaller */}
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/3"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestGridSkeleton;
