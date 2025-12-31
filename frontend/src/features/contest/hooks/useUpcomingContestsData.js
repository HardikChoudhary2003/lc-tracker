import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

const useUpcomingContestsData = () => {
  const [upcomingContests, setUpcomingContests] = useState([]);
  // Note: We might not need userStatuses for upcoming contests,
  // but including it for potential future use or consistency.
  const [userStatuses, setUserStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false); // Assuming pagination might be needed
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const dataCache = useRef({}); // Cache for upcoming contests

  // Function to clear the cache
  const clearCache = useCallback(() => {
    dataCache.current = {};
  }, []);

  const fetchUpcomingContests = useCallback(async (page) => {
    // Check cache first
    if (dataCache.current[page]) {
      const cachedData = dataCache.current[page];
      setUpcomingContests(cachedData.contests);
      setUserStatuses(cachedData.userStatuses);
      setIsLastPage(cachedData.isLastPage);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Fetch from the dedicated upcoming contests endpoint
      const res = await axios.get(`/api/upcoming-contests?page=${page}`);
      const fetchedContests = Array.isArray(res.data.contests) ? res.data.contests : [];

      // No date filtering needed here as the API should only return upcoming ones
      setUpcomingContests(fetchedContests);
      setUserStatuses(res.data.userStatuses || {}); // Include statuses if provided

      // Determine if it's the last page based on fetched count (e.g., assuming 10 per page)
      const isLast = fetchedContests.length < 10;
      setIsLastPage(isLast);

      // Store fetched data in cache
      dataCache.current[page] = {
        contests: fetchedContests,
        userStatuses: res.data.userStatuses || {},
        isLastPage: isLast,
      };

    } catch (err) {
      console.error('Upcoming contests fetch error:', err);
      setError('Failed to load upcoming contests');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUpcomingContests, setUserStatuses, setIsLastPage]); // Dependencies

  return {
    upcomingContests,
    userStatuses, // Keep statuses if needed
    loading,
    isLastPage,
    error,
    currentPage,
    setCurrentPage,
    fetchUpcomingContests,
    clearCache
  };
};

export default useUpcomingContestsData;
