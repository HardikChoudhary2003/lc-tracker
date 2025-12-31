import { useState, useCallback, useRef } from 'react'; // Import useRef
import axios from 'axios';
import { useMemo } from 'react'; // Import useMemo

const useDashboardData = () => {
  const [rawContests, setRawContests] = useState([]); // Store all fetched contests
  const [userStatuses, setUserStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const dataCache = useRef({}); // Use useRef for cache to avoid re-renders on cache update

  // Function to clear the cache
  const clearCache = useCallback(() => {
    // console.log("[useDashboardData] Clearing cache."); // Optional: Log cache clear
    dataCache.current = {};
  }, []); // No dependencies needed

  const fetchDashboardData = useCallback(async (page) => {
    // Check cache first
    if (dataCache.current[page]) {
      // console.log(`[useDashboardData] Cache hit for page ${page}. Loading from cache.`);
      const cachedData = dataCache.current[page];
      setRawContests(cachedData.rawContests); // Load raw from cache
      setUserStatuses(cachedData.userStatuses);
      setIsLastPage(cachedData.isLastPage);
      setLoading(false);
      setError(''); // Clear any previous error
      return; // Exit early
    }

    // console.log(`[useDashboardData] Cache miss for page ${page}. Fetching from API.`); // Optional: Log cache miss
    setLoading(true);
    setError('');
    try {
      // console.log(`[useDashboardData] Fetching data for page ${page}...`); // Removed log
      const res = await axios.get(`/api/dashboard-data?page=${page}`);
      const fetchedContests = Array.isArray(res.data.contests) ? res.data.contests : [];
      // console.log(`[useDashboardData] Fetched ${fetchedContests.length} contests from API.`);

      // Store the raw fetched contests
      setRawContests(fetchedContests);
      setUserStatuses(res.data.userStatuses || {});

      // Base isLastPage on the length of the fetched contests
      const isLast = fetchedContests.length < 10;
      // console.log(`[useDashboardData] Setting isLastPage to: ${isLast}`);
      setIsLastPage(isLast);

      // Store raw data in cache
      dataCache.current[page] = {
        rawContests: fetchedContests, // Store raw contests
        userStatuses: res.data.userStatuses || {},
        isLastPage: isLast,
      };
      // console.log(`[useDashboardData] Stored raw data for page ${page} in cache.`);

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
      // Clear potentially stale data on error? Maybe not, depends on desired UX.
    } finally {
      setLoading(false);
    }
    // dataCache is a ref, so it doesn't need to be in the dependency array.
  }, [setLoading, setError, setRawContests, setUserStatuses, setIsLastPage]); // Update dependencies

  // Derive filtered contests (past/present) using useMemo
  const filteredContests = useMemo(() => {
    const now = new Date();
    return rawContests.filter(contest => {
      if (!contest.startTime) return false;
      try {
        return new Date(contest.startTime) <= now;
      } catch (e) {
        console.error("Error parsing contest startTime:", contest.startTime, e);
        return false;
      }
    });
  }, [rawContests]); // Recalculate when rawContests changes

  return {
    rawContests,        // Expose raw contests
    filteredContests,   // Expose filtered contests (past/present)
    setRawContests,     // Expose setter if needed externally (e.g., for search)
    userStatuses,
    setUserStatuses,
    loading,
    setLoading,
    isLastPage,
    error,
    setError,
    currentPage,
    setCurrentPage,
    fetchDashboardData,
    clearCache // Expose the clearCache function
  };
};

export default useDashboardData;
