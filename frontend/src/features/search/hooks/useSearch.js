import { useState, useCallback, useMemo } from 'react';
import debounce from '../../../utils/debounce';
import { fetchSearchResults } from '../services/searchService';

/**
 * Custom hook for contest search functionality
 * 
 * @param {number} searchLimit - Maximum number of search results to return
 * @returns {Object} - Search state and handlers
 */
const useSearch = (searchLimit) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchUserStatuses, setSearchUserStatuses] = useState({}); // Ensure this is defined
  const [searchError, setSearchError] = useState('');

  // Function to perform the actual search
  const performSearch = useCallback(async (query) => {
    // Skip search for empty queries
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Skip search for very short queries
    if (query.trim().length < 3) {
      setSearchResults([]);
      setSearchUserStatuses({});
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchError('');
    
    try {
      const { contests, userStatuses } = await fetchSearchResults(query, searchLimit);
      setSearchResults(contests);
      setSearchUserStatuses(userStatuses);
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchLimit]);

  // Create a debounced version of the search function
  const debouncedSearch = useCallback(
    debounce(performSearch, 500),
    [performSearch]
  );

  // Handle search input change
  const handleSearch = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Determine if there's an active search
  const isActiveSearch = useMemo(() => 
    searchQuery.trim() !== '', 
    [searchQuery]
  );

  // Reset search state
  const resetSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchUserStatuses({});
    setSearchError('');
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    setSearchResults,
    searchUserStatuses,
    setSearchUserStatuses, // Make sure this is included in the return object
    searchError,
    handleSearch,
    isActiveSearch,
    resetSearch
  };
};

export default useSearch;
