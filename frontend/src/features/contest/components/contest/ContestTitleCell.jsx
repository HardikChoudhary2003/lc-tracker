import React from 'react';

/**
 * Title cell for a contest row with highlighting support
 */
const ContestTitleCell = ({ 
  contest, 
  highlightMatches = false 
}) => {
  return (
    <div className={`p-3 border-b border-gray-200 dark:border-gray-600 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200 dark:bg-gray-700/50 ${
      highlightMatches && contest.isContestMatch 
        ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
    }`}>
      <div className="flex items-center justify-between">
        <span className={highlightMatches && contest.isContestMatch 
          ? 'text-indigo-700 dark:text-indigo-300' : ''
        }>
          {contest.title}
          {highlightMatches && contest.isContestMatch && (
            <span className="ml-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
              Match
            </span>
          )}
        </span>

        {/* Solution Link Button */}
        {contest.link && contest.link.trim() !== '' && (
          <a
            href={contest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
            title="Open Solution Video/Link"
          >
            Solution Link
          </a>
        )}
      </div>
    </div>
  );
};

export default ContestTitleCell;
