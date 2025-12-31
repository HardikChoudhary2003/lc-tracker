import React from 'react';
import ContestGrid from '../../features/contest/components/ContestGrid'; // Adjusted import path
import Pagination from '../../common/components/Pagination'; // Adjusted import path
import { useAuth } from '../../context/AuthContext'; // Adjusted import path

// Renamed props for clarity and consistency
function DashboardTable({
  displayContests, // Renamed from contests
  displayStatuses, // Renamed from userStatuses
  loading,
  isSearching, // Added to combine loading states
  displayError, // Renamed from error
  isActiveSearch,
  currentPage,
  setCurrentPage,
  isLastPage,
}) {
  const { user } = useAuth();
  const isLoading = loading || isSearching; // Combine loading states

  // Log the value being passed down right before rendering ContestGrid
  console.log(`[DashboardTable] User from context:`, user);
  console.log(`[DashboardTable] Rendering ContestGrid with hasLeetcodeKey: ${user?.hasLeetCodeKey ?? false}`);

  return (
    // Removed card layout wrapper
    // <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
      <div className="px-3 pb-4 sm:pb-6"> {/* Keep bottom padding, remove horizontal padding */}
        {/* Contest Grid */}
        <ContestGrid
          contests={displayContests}
          userStatuses={displayStatuses}
          loading={isLoading}
          error={displayError}
          highlightMatches={isActiveSearch}
          userId={user?.id}
          hasLeetcodeKey={user?.hasLeetCodeKey ?? false}
        />

        {/* Pagination */}
        {!isLoading && !isActiveSearch && (displayContests.length > 0 || currentPage > 1) && (
          <Pagination
            currentPage={currentPage}
            onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => p + 1)}
            isLastPage={isLastPage}
            loading={loading} // Pass the original loading prop, not the combined one
          />
        )}
      </div> // End content padding
  ); // Return the single div element
}

export default DashboardTable;
