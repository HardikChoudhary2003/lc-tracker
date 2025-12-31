import React from 'react';
import ContestRow from './ContestRow';
import ContestGridSkeleton from '../../../components/skeletons/ContestGridSkeleton'; // Use relative path

const ContestGrid = ({ contests, userStatuses, loading, error, highlightMatches = false, userId, hasLeetcodeKey }) => {

  // Use the reusable ContestGridSkeleton component when loading
  if (loading) return <ContestGridSkeleton />;

  if (error) return <p className="text-red-600 dark:text-red-400">Error loading data: {error}</p>;

  if (contests.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-300">
        No contests found or data is still loading. If you just added your key, it might take a moment for data to sync.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto sm:overflow-visible">
      {/* Add responsive grid classes with improved dark mode colors */}
      <div className="sm:grid sm:grid-cols-[auto_repeat(4,minmax(0,1fr))] w-full gap-x-4 gap-y-2 block">
        {/* Hide headers on mobile - improved dark mode colors */}
        <div className="hidden sm:block font-semibold text-gray-700 dark:text-gray-200 p-3 border-b-2 border-gray-200 dark:border-gray-600">Contest</div>
        <div className="hidden sm:block font-semibold text-gray-700 dark:text-gray-200 p-3 border-b-2 border-gray-200 dark:border-gray-600 text-center">Problem 1</div>
        <div className="hidden sm:block font-semibold text-gray-700 dark:text-gray-200 p-3 border-b-2 border-gray-200 dark:border-gray-600 text-center">Problem 2</div>
        <div className="hidden sm:block font-semibold text-gray-700 dark:text-gray-200 p-3 border-b-2 border-gray-200 dark:border-gray-600 text-center">Problem 3</div>
        <div className="hidden sm:block font-semibold text-gray-700 dark:text-gray-200 p-3 border-b-2 border-gray-200 dark:border-gray-600 text-center">Problem 4</div>

        {/* Mobile view contest list with stronger visual separation and improved dark colors */}
        <div className="sm:contents block space-y-6 mb-6">
          {contests.map((contest) => (
            <div key={contest._id} className="sm:contents block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <ContestRow 
                contest={contest} 
                userStatuses={userStatuses} 
                highlightMatches={highlightMatches}
                userId={userId}
                hasLeetcodeKey={hasLeetcodeKey}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestGrid;
