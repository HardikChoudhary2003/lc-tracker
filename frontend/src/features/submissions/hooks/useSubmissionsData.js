import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchRecentSubmissions } from '../../../services/leetcodeService';

const submissionsPerPage = 20; // Define limit consistently

const useSubmissionsData = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dataCache = useRef({}); // Cache for submissions data per page

  // Function to clear the cache
  const clearCache = useCallback(() => {
    // console.log("[useSubmissionsData] Clearing cache."); // Optional log
    dataCache.current = {};
    // Optionally, trigger a refetch for the current page after clearing
    // fetchSubmissions(currentPage, true); // Pass a flag to force refetch
  }, []); // No dependencies needed

  // Renamed loadSubmissions to fetchSubmissions for clarity
  const fetchSubmissions = useCallback(async (page, forceRefetch = false) => {
    // Check cache first, unless forcing refetch
    if (!forceRefetch && dataCache.current[page]) {
      // console.log(`[useSubmissionsData] Cache hit for page ${page}. Loading from cache.`); // Optional log
      const cached = dataCache.current[page];
      setSubmissions(cached.submissions);
      setHasMore(cached.hasMore);
      setLoading(false);
      setError(null);
      return; // Exit early
    }

    // console.log(`[useSubmissionsData] Cache miss for page ${page}. Fetching from API.`); // Optional log
    setLoading(true);
    setError(null);
    const offset = (page - 1) * submissionsPerPage;

    try {
      const data = await fetchRecentSubmissions(offset, submissionsPerPage);
      const fetchedSubmissions = data?.submissions_dump || [];
      const fetchedHasMore = data?.has_next || false;

      setSubmissions(fetchedSubmissions);
      setHasMore(fetchedHasMore);

      // Store in cache
      dataCache.current[page] = {
        submissions: fetchedSubmissions,
        hasMore: fetchedHasMore,
      };
      // console.log(`[useSubmissionsData] Stored data for page ${page} in cache.`); // Optional log

    } catch (err) {
      console.error("Failed to load submissions:", err);
      setError(err.message || 'Failed to load submissions. Please ensure your LeetCode session is valid.');
      // Don't clear submissions on error, keep potentially stale data? Or clear?
      // setSubmissions([]); // Decide based on desired UX
      // setHasMore(false);
    } finally {
      setLoading(false);
    }
  // dataCache is a ref, doesn't need to be in deps.
  // fetchRecentSubmissions is stable if defined outside or wrapped in useCallback.
  }, [/* fetchRecentSubmissions */]); // Dependencies: only stable functions/values

  // Effect to fetch data when currentPage changes
  useEffect(() => {
    fetchSubmissions(currentPage);
  }, [currentPage, fetchSubmissions]);

  // Pagination handler - now part of the hook
  const handlePageChange = useCallback((newPage) => {
    // Basic pagination logic based on currentPage and hasMore
    if (newPage > currentPage && hasMore) {
      setCurrentPage(newPage);
    } else if (newPage < currentPage && newPage > 0) {
      setCurrentPage(newPage);
    }
    // If you want to allow jumping, you'd need totalPages or adjust logic
  }, [currentPage, hasMore]); // Dependencies for the handler


  return {
    submissions,
    loading,
    error,
    currentPage,
    hasMore,
    setCurrentPage, // Expose setter if direct page setting is needed
    handlePageChange, // Expose the handler
    fetchSubmissions, // Expose fetch function if manual refetch is needed
    clearCache      // Expose cache clearing function
  };
};

export default useSubmissionsData;
