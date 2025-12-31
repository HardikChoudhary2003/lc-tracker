import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjusted import path
import SyncButton from '../../components/SyncButton'; // Adjusted import path
import SearchSection from '../../features/search/components/search/SearchSection'; // Adjusted import path

// Renamed props for clarity and consistency
function DashboardHeader({
  statusMessage,
  searchQuery,
  setSearchQuery,
  isSearching,
  handleSearch,
  searchResults,
  setSearchResults,
  searchLimit,
  setSearchLimit,
  isActiveSearch,
  displayContests, // Renamed from contests for clarity
  handleSyncComplete,
}) {
  const { user } = useAuth();

  return (
    <>
      {statusMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900/40 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-2 rounded z-50 shadow-md transition-opacity duration-300 max-w-[90%] sm:max-w-md text-center">
          {statusMessage}
        </div>
      )}

      {/* Add Personalized Greeting */}
      {user?.leetcodeUsername && (
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Hi <span className="text-indigo-600 dark:text-indigo-400">{user.leetcodeUsername}</span>!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Here's your LeetCode activity.</p>
        </div>
      )}

      {/* Removed Main Content Card wrapper */}
      {/* <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg"> */}
        <div className="px-3 pt-4 sm:pt-6"> {/* Keep top padding, remove horizontal padding here, will be added by parent */}
          {/* Section containing Title and Sync Button */}
          <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6`}>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-0 text-center sm:text-left">
              Recent Contests & Your Progress
            </h2>
            {/* Sync Button */}
            {user?.hasLeetCodeKey && (
              <div className={`w-full sm:w-auto ${user?.leetcodeUsername ? 'sm:ml-auto' : ''}`}>
                <SyncButton
                  userId={user.id}
                  contests={displayContests} // Pass the currently displayed contests
                  onSyncComplete={handleSyncComplete}
                />
              </div>
            )}
          </div>

          {/* Search Section */}
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearching={isSearching}
            handleSearch={handleSearch}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            searchLimit={searchLimit}
            setSearchLimit={setSearchLimit}
            isActiveSearch={isActiveSearch}
          />
        </div> {/* End content padding */}
      {/* </div> */} {/* End removed card container */}
    </>
  );
}

export default DashboardHeader;
