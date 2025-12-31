import { useState, useCallback } from 'react';
import axios from 'axios';

const useDashboardData = () => {
  const [contests, setContests] = useState([]);
  const [userStatuses, setUserStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDashboardData = useCallback(async (page) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/dashboard-data?page=${page}`);
      const fetchedContests = Array.isArray(res.data.contests) ? res.data.contests : [];
      
      // Filter out upcoming contests
      const now = new Date();
      // Assuming contest.startTime is a comparable date string (e.g., ISO) or timestamp
      const pastOrPresentContests = fetchedContests.filter(contest => {
        // Add a check for valid startTime property
        if (!contest.startTime) return false; 
        try {
          return new Date(contest.startTime) <= now;
        } catch (e) {
          console.error("Error parsing contest startTime:", contest.startTime, e);
          return false; // Exclude if date parsing fails
        }
      });

      setContests(pastOrPresentContests);
      setUserStatuses(res.data.userStatuses || {});
      // Base isLastPage on the length of the filtered contests
      setIsLastPage(pastOrPresentContests.length < 10); 
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contests,
    setContests,
    userStatuses,
    setUserStatuses,
    loading,
    setLoading,
    isLastPage,
    error,
    setError,
    currentPage,
    setCurrentPage,
    fetchDashboardData
  };
};

export default useDashboardData;
