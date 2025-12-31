import React from 'react';
import Pagination from '../../../common/components/Pagination'; // Keep default import
import useSubmissionsData from '../hooks/useSubmissionsData'; // Import the new hook

// --- Helper Functions (remain the same) ---
const formatTimestamp = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

const getStatusClass = (statusDisplay) => {
  switch (statusDisplay) {
    case 'Accepted': return 'text-green-600 dark:text-green-400';
    case 'Wrong Answer': return 'text-red-600 dark:text-red-400';
    case 'Time Limit Exceeded': return 'text-yellow-600 dark:text-yellow-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

const getLangBadgeClass = (lang) => {
  return 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-medium mr-2 px-2.5 py-0.5 rounded';
}

// --- Submission Row Component (remains the same) ---
const SubmissionRow = ({ submission }) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="py-4 px-6 whitespace-nowrap">{formatTimestamp(submission.timestamp)}</td>
      <td className="py-4 px-6">
        <a
          href={`https://leetcode.com/problems/${submission.title_slug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {submission.title}
        </a>
      </td>
      <td className={`py-4 px-6 font-medium ${getStatusClass(submission.status_display)}`}>
        {submission.status_display}
      </td>
      <td className="py-4 px-6">{submission.runtime}</td>
      <td className="py-4 px-6">
        <span className={getLangBadgeClass(submission.lang)}>
          {submission.lang}
        </span>
      </td>
    </tr>
  );
};

// --- Submissions Table Component (remains the same) ---
const SubmissionsTable = ({ submissions }) => {
  if (!submissions || submissions.length === 0) {
    return null;
  }
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg mb-6">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">Time</th>
            <th scope="col" className="py-3 px-6">Problem</th>
            <th scope="col" className="py-3 px-6">Status</th>
            <th scope="col" className="py-3 px-6">Runtime</th>
            <th scope="col" className="py-3 px-6">Language</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <SubmissionRow key={submission.id} submission={submission} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Main Submissions Page Component (Refactored to use hook) ---
const SubmissionsPage = () => {
  // Use the custom hook to manage state and fetching logic
  const {
    submissions,
    loading,
    error,
    currentPage,
    hasMore,
    handlePageChange,
    // clearCache // Can be used if a refresh button is added
  } = useSubmissionsData();

  // Render logic using values from the hook
  const renderContent = () => {
    if (loading && submissions.length === 0) { // Show loading only on initial load or when submissions are empty
      return <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading submissions...</p>;
    }
    if (error) {
      return <p className="text-center text-red-600 dark:text-red-400 py-4">Error: {error}</p>;
    }
    // Show "No submissions" only if not loading, no error, and submissions array is empty
    if (!loading && !error && submissions.length === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent submissions found.</p>;
    }
    // Render table and pagination if there are submissions (even if loading more in background)
    return (
      <>
        <SubmissionsTable submissions={submissions} />
        <Pagination
          currentPage={currentPage}
          onPrev={() => handlePageChange(currentPage - 1)}
          onNext={() => handlePageChange(currentPage + 1)}
          isLastPage={!hasMore}
          loading={loading} // Indicate loading state on buttons
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Note: Pagination provides basic next/previous navigation.
        </p>
      </>
    );
  };

  // Use main tag and classes consistent with DashboardPage for layout
  return (
    <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Recent Submissions</h1>
      {/* Optional: Add a button to clear cache and refetch */}
      {/* <button onClick={() => clearCache()} className="mb-4 px-3 py-1 bg-blue-500 text-white rounded">Refresh</button> */}
      {renderContent()}
    </main> // Close main tag
  );
};

export default SubmissionsPage;
