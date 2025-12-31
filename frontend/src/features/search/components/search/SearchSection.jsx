import React from 'react';
import SearchBar from './SearchBar';
import SearchMetadata from './SearchMetadata';
import SearchWarning from './SearchWarning';

function SearchSection({
  searchQuery,
  setSearchQuery,
  isSearching,
  handleSearch,
  searchResults,
  setSearchResults,
  searchLimit,
  setSearchLimit,
  isActiveSearch
}) {
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const showWarning = searchQuery.trim().length > 0 && searchQuery.trim().length < 3;

  return (
    <div className="mb-8">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
      />
      
      {isActiveSearch && (
        <SearchMetadata
          isSearching={isSearching}
          searchQuery={searchQuery}
          searchResults={searchResults}
          searchLimit={searchLimit}
          setSearchLimit={setSearchLimit}
        />
      )}
      
      <SearchWarning show={showWarning} />
    </div>
  );
}

export default SearchSection;
