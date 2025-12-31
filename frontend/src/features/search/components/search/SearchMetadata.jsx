import React from 'react';

function SearchMetadata({ 
  isSearching, 
  searchQuery, 
  searchResults, 
  searchLimit, 
  setSearchLimit 
}) {
  return (
    <div className="mt-3 bg-gray-50 dark:bg-gray-750 rounded-lg p-2 sm:p-3 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div className="flex items-center">
          {!isSearching && searchResults.length > 0 && (
            <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 py-1 px-2 rounded text-xs font-medium mr-2">
              {searchResults.length} found
            </span>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[250px] sm:max-w-none">
            {isSearching 
              ? `Searching for "${searchQuery}"...` 
              : searchResults.length > 0 
                ? `Results for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
          </p>
        </div>
        
        <div className="flex items-center ml-0 sm:ml-auto">
          <label htmlFor="search-limit" className="mr-2 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            Show:
          </label>
          <div className="relative inline-block">
            <select
              id="search-limit"
              value={searchLimit}
              onChange={(e) => setSearchLimit(Number(e.target.value))}
              className="appearance-none pl-3 pr-8 py-1 text-sm bg-white dark:bg-gray-700 border 
                       border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                       text-gray-700 dark:text-gray-200 focus:outline-none 
                       focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={5}>5 results</option>
              <option value={10}>10 results</option>
              <option value={15}>15 results</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMetadata;
