import React from 'react';

/**
 * Individual problem cell with solved status and highlighting
 */
const ProblemCell = ({ 
  problem, 
  isSolved, 
  highlightMatches = false 
}) => {
  return (
    <div
      className={`p-3 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200 ${
        isSolved
          ? 'bg-green-50 dark:bg-green-900/50' : 'bg-gray-50 dark:bg-gray-700/50'
      } ${
        highlightMatches && problem.isMatch
          ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <a
          href={`https://leetcode.com/problems/${problem.titleSlug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className={`block text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline break-words ${
            highlightMatches && problem.isMatch 
              ? 'text-indigo-700 dark:text-indigo-300' : ''
          }`}
          title={problem.title}
        >
          {problem.title}
          {highlightMatches && problem.isMatch && (
            <span className="ml-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
              Match
            </span>
          )}
        </a>
        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium">
          {problem.credit}
        </span>
      </div>
      
      <p
        className={`text-xs font-medium mt-1 ${
          isSolved
            ? 'text-green-700 dark:text-green-400' : 'text-red-500 dark:text-red-400'
        }`}
      >
        {isSolved ? 'Solved' : 'Not Solved'}
      </p>
    </div>
  );
};

export default ProblemCell;
