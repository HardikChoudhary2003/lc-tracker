import React from 'react';
import ProblemStatusCell from '../../../components/ProblemStatusCell';

// Add userId and hasLeetcodeKey to props
const ContestRow = ({ contest, userStatuses, highlightMatches = false, userId, hasLeetcodeKey }) => {
  const problems = contest.problems.slice(0, 4);

  return (
    <>
      {/* Contest Title Cell - Enhanced mobile styling with improved dark mode colors */}
      {/* Contest Title Cell - Enhanced mobile styling with improved dark mode colors */}
      <div className={`p-3 border-b border-gray-200 dark:border-gray-600 dark:bg-gray-750/80 ${
        highlightMatches && contest.isContestMatch 
          ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
      }`}>
        {/* Contest Title */}
        <div className="font-bold text-gray-800 dark:text-gray-100 mb-2"> 
          {contest.title}
          {highlightMatches && contest.isContestMatch && (
            <span className="ml-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-800/50 dark:text-indigo-200">
                Match
              </span>
          )}
        </div>

        {/* Solution Link Buttons */}
        {contest.link && contest.link.trim() !== '' && (
          <div className="flex space-x-2 mt-1"> {/* Container for buttons */}
            <a
              href={contest.link} // Assuming link1 for now, adjust if needed
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 py-0.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 dark:ring-offset-gray-800 dark:focus:ring-blue-500 transition-colors duration-150"
              title="Open Solution Link 1"
            >
              Solution Link 1
            </a>
            {/* Conditionally render Solution Link 2 only if contest.link2 exists */}
            {contest.link2 && contest.link2.trim() !== '' && (
              <a
                href={contest.link2} // Use the new link2 field
                target="_blank"
                rel="noopener noreferrer"
                className="px-1.5 py-0.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 dark:ring-offset-gray-800 dark:focus:ring-blue-500 transition-colors duration-150"
                title="Open Solution Link 2"
              >
                Solution Link 2
              </a>
            )}
          </div>
        )}

        {/* Enhanced mobile problem header label */}
        <div className="mt-3 sm:hidden text-xs font-semibold text-gray-500 dark:text-gray-400 pb-1 border-b border-gray-200 dark:border-gray-700">
          Problems:
        </div>
      </div>

      {/* Problem Cells */}
      {problems.map((problem) => (
        <ProblemStatusCell
          key={problem.titleSlug}
          problem={problem}
          userId={userId} // Pass down the received userId prop
          hasLeetcodeKey={hasLeetcodeKey} // Pass down the received hasLeetcodeKey prop
          initialStatus={userStatuses[problem.titleSlug]}
        />
      ))}
      
      {/* Empty Cells - only show on larger screens - improved dark mode colors */}
      {[...Array(4 - problems.length)].map((_, idx) => (
        <div key={`empty-${idx}`} className="hidden sm:block p-3 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30" />
      ))}
    </>
  );
};

export default ContestRow;
