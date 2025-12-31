import React from 'react';

function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  isSearching, 
  handleSearch, 
  clearSearch 
}) {
  return (
    <div className="relative">
      {/* Search icon - absolute positioned at left */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400 dark:text-indigo-300/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Input with left padding for search icon */}
      <input
        type="text"
        className="block w-full pl-10 pr-12 py-3 sm:text-sm border-gray-300 dark:border-gray-600 rounded-lg 
                 dark:bg-gray-800 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-400 
                 shadow-sm transition-all duration-200 focus:shadow-md
                 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 dark:focus:bg-gray-800/70
                 dark:shadow-lg dark:shadow-indigo-900/10 backdrop-blur-sm
                 dark:placeholder-gray-400 dark:hover:bg-gray-750"
        placeholder="Search problems or contests (min 3 characters)..."
        value={searchQuery}
        onChange={handleSearch}
      />
      
      {/* Loading indicator or clear button */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        {isSearching ? (
          <svg className="animate-spin h-5 w-5 text-indigo-400 dark:text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : searchQuery ? (
          <button 
            onClick={clearSearch}
            className="text-gray-400 hover:text-gray-500 dark:text-indigo-300/70 dark:hover:text-indigo-200 focus:outline-none transition-colors duration-200"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 101.414 1.414L10 11.414l1.293 1.293a1 1 001.414-1.414L11.414 10l1.293-1.293a1 1 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default SearchBar;
