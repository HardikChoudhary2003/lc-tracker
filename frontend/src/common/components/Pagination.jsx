import React from 'react';

const Pagination = ({ currentPage, onPrev, onNext, isLastPage, loading }) => (
  <div className="mt-8 flex justify-between items-center">
    <button
      onClick={onPrev}
      disabled={currentPage === 1 || loading}
      className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
    >
      Previous
    </button>
    {/* Added dark mode text color */}
    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Page {currentPage}</span>
    <button
      onClick={onNext}
      disabled={isLastPage || loading}
      className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

export default Pagination;
