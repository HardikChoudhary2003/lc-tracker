import React, { useEffect, useMemo } from 'react';
import useDashboardData from '../../dashboard/useDashboardData';
import ContestCard from '../components/ContestCard'; // Import ContestCard
// Removed Pagination import
import ContestGridSkeleton from '../../../components/skeletons/ContestGridSkeleton'; // Keep skeleton for loading

function ContestsPage() {
  const {
    rawContests, // Get the raw, unfiltered contests
    userStatuses,
    loading,
    // Removed isLastPage, setCurrentPage as pagination UI is removed
    error,
    currentPage, // Keep currentPage for the initial fetch
    fetchDashboardData
  } = useDashboardData();

  // Filter rawContests to get only upcoming ones
  const upcomingContests = useMemo(() => {
    const now = new Date();
    return rawContests.filter(contest => { // Filter rawContests
      if (!contest.startTime) return false;
      try {
        // Keep contests where startTime is in the future
        return new Date(contest.startTime) > now;
      } catch (e) {
        console.error("Error parsing contest startTime:", contest.startTime, e);
        return false;
      }
    });
  }, [rawContests]); // Re-filter only when rawContests changes

  useEffect(() => {
    document.title = 'Upcoming Contests - LeetCode Tracker';
    // Fetch only the first page's data since pagination is removed
    if (currentPage === 1) {
      fetchDashboardData(1);
    }
    // We only fetch page 1 now. If more contests are needed later, this needs adjustment.
  }, [fetchDashboardData, currentPage]); // Keep currentPage dependency for initial load logic

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming Contests</h1>

        {/* Card wrapper */}
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="px-3 py-4 sm:p-6">
            {error && (
              <div className="text-center text-red-500 dark:text-red-400 py-4">{error}</div>
            )}

            {loading && currentPage === 1 && !error ? (
              <ContestGridSkeleton />
            ) : !loading && upcomingContests.length === 0 && !error ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">No upcoming contests found for this page.</div> // Adjusted message
            ) : (
              <>
                {/* Responsive Grid for Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {upcomingContests.map((contest) => (
                    <ContestCard key={contest._id || contest.titleSlug || contest.title} contest={contest} /> // Use titleSlug for key if available
                  ))}
                </div>
                {/* Pagination component removed */}
              </>
            )}
             {/* Loading indicator removed as we only load page 1 */}
          </div> {/* Close padding div */}
        </div> {/* Close card wrapper div */}
      </main>
    </div>
  );
}

export default ContestsPage;
