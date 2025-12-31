import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjusted import path
import { refreshVisibleProblemStatuses } from '../../features/contest/utils/problemStatusRefresh'; // Keep this utility import
import useDashboardData from './useDashboardData'; // Use the new hook location
import useSearch from '../../features/search/hooks/useSearch'; // Keep this hook import
import { checkLeetCodeKeyStatus } from '../../utils/userDiagnostic'; // Keep this utility import
import DashboardHeader from './DashboardHeader'; // Import new header component
import DashboardTable from './DashboardTable'; // Import new table component
import WarningBanner from '../../common/components/WarningBanner'; // Import the new banner component
// Import constants if needed in the future, e.g.:
// import { DEFAULT_SEARCH_LIMIT } from './dashboardConstants';

// Constants (can be moved to dashboardConstants.js if preferred)
const DEFAULT_SEARCH_LIMIT = 10;

function DashboardPage() {
  const { user, setUser } = useAuth();
  const [statusMessage, setStatusMessage] = useState("");
  const [searchLimit, setSearchLimit] = useState(DEFAULT_SEARCH_LIMIT);

  const {
    rawContests,        // Get raw contests
    filteredContests,   // Get filtered contests (past/present)
    userStatuses,
    setUserStatuses,
    loading,
    isLastPage,
    error,
    currentPage,
    setCurrentPage,
    fetchDashboardData,
    clearCache // Get the clearCache function from the hook
  } = useDashboardData();

  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    setSearchResults,
    searchUserStatuses,
    setSearchUserStatuses,
    searchError,
    handleSearch,
    isActiveSearch
  } = useSearch(searchLimit);

  // Effect for fetching dashboard data
  useEffect(() => {
    console.log(`[DashboardPage] useEffect triggered. currentPage: ${currentPage}, isActiveSearch: ${isActiveSearch}`);
    document.title = 'Dashboard - LeetCode Tracker';
    if (!isActiveSearch) { // Fetch only if not actively searching
      console.log(`[DashboardPage] Calling fetchDashboardData for page ${currentPage}`);
      fetchDashboardData(currentPage);
    } else {
      console.log('[DashboardPage] Skipping fetchDashboardData because isActiveSearch is true.');
    }
  }, [currentPage, isActiveSearch, fetchDashboardData]); // Depend on isActiveSearch

  // Handle user update (e.g., when LeetCode key is added)
  const handleUserUpdate = useCallback(async (updatedUser) => {
    setUser(updatedUser);
    setStatusMessage("LeetCode key added successfully! Refreshing your data...");

    // Clear the cache before refetching
    clearCache(); 

    // Refetch dashboard data regardless of search state after key update
    await fetchDashboardData(1); // Fetch page 1 after key update
    setCurrentPage(1); // Reset to page 1

    if (updatedUser.hasLeetCodeKey) {
      try {
    // Need to refresh based on the contests currently displayed
    // If searching, use searchResults. If not searching, use filteredContests.
    const contestsToRefresh = isActiveSearch ? searchResults : filteredContests;
    if (contestsToRefresh.length > 0) {
         const updatedStatuses = await refreshVisibleProblemStatuses(
               updatedUser.id,
               contestsToRefresh // Use currently displayed contests
             );

             // Update the correct status state based on search
             if (isActiveSearch) {
               setSearchUserStatuses(prev => ({ ...prev, ...updatedStatuses }));
             } else {
               setUserStatuses(prev => ({ ...prev, ...updatedStatuses }));
             }
             setStatusMessage("Your problem statuses have been updated!");
        } else {
             setStatusMessage("Data refreshed. Problem statuses will update as you browse.");
        }

      } catch (error) {
        console.error("Error refreshing problem statuses:", error);
        setStatusMessage("Your data has been loaded but some problem statuses may not be up to date.");
      }
    }

    setTimeout(() => setStatusMessage(""), 3000);
    // Add clearCache to the dependency array
  }, [fetchDashboardData, clearCache, filteredContests, searchResults, isActiveSearch, setUser, setUserStatuses, setSearchUserStatuses, setCurrentPage]); // Use filteredContests


  // Handler for sync completion
  const handleSyncComplete = useCallback((newStatuses) => {
    if (isActiveSearch) {
      setSearchUserStatuses(prev => ({ ...prev, ...newStatuses }));
    } else {
      setUserStatuses(prev => ({ ...prev, ...newStatuses }));
    }
    setStatusMessage("Your problem statuses have been updated!");
    setTimeout(() => setStatusMessage(""), 3000);
  }, [isActiveSearch, setUserStatuses, setSearchUserStatuses]);

  // Determine which contests and statuses to display
  // Use filteredContests for the main dashboard view when not searching
  const displayContests = isActiveSearch ? searchResults : filteredContests;
  const displayStatuses = isActiveSearch ? searchUserStatuses : userStatuses;
  const displayError = error || (isActiveSearch ? searchError : '');

  // Removed the useEffect hook for checkLeetCodeKeyStatus as it's now handled in App.jsx

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* Conditionally render the warning banner *before* the card */}
        {user && !user.hasLeetCodeKey && (
          <WarningBanner
            message="Add your LeetCode session key to track your progress and sync problem statuses."
            storageKey="dismissedLeetCodeKeyWarning"
          />
        )}

        {/* Add the card wrapper here */}
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="px-3 py-4 sm:p-6"> {/* Apply original padding */}
            <DashboardHeader
              statusMessage={statusMessage}
              searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          handleSearch={handleSearch}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          searchLimit={searchLimit}
          setSearchLimit={setSearchLimit}
          isActiveSearch={isActiveSearch}
          displayContests={displayContests} // Pass displayContests here
              handleSyncComplete={handleSyncComplete}
            />

            {/* Banner moved outside the card */}

            {/* Remove the extra div and margin */}
            {/* <div className="mt-4 sm:mt-6"> */}
              <DashboardTable
                displayContests={displayContests}
                displayStatuses={displayStatuses}
            loading={loading}
            isSearching={isSearching}
            displayError={displayError}
            isActiveSearch={isActiveSearch}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
                isLastPage={isLastPage}
              />
            {/* </div> */}
          </div> {/* Close padding div */}
        </div> {/* Close card wrapper div */}
      </main>
    </div>
  );
}

export default DashboardPage;
