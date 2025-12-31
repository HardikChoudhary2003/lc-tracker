import React from 'react';
import CountdownTimer from '../../../common/components/CountdownTimer'; // Import the timer

// Helper function to format the date and time
const formatDateTime = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Invalid Date';
    }
    // Example Format: Sat, Apr 26, 20:00 GMT+05:30
    // Note: Getting the exact timezone offset string like "GMT+05:30" reliably across browsers/OS
    // can be tricky with native Date. Intl.DateTimeFormat is better but more complex.
    // This provides a simpler locale-based format.
    const optionsDate = { weekday: 'short', month: 'short', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false }; // Use 24-hour format

    const formattedDate = date.toLocaleDateString('en-US', optionsDate);
    const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

    // Attempt to get timezone offset (might not be exactly GMT+05:30 format)
    const offsetMinutes = date.getTimezoneOffset();
    const offsetHours = Math.abs(offsetMinutes / 60);
    const offsetSign = offsetMinutes <= 0 ? '+' : '-';
    const timezoneString = `GMT${offsetSign}${String(Math.floor(offsetHours)).padStart(2, '0')}:${String(Math.abs(offsetMinutes % 60)).padStart(2, '0')}`;


    return `${formattedDate}, ${formattedTime} ${timezoneString}`;
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return 'Invalid Date';
  }
};


const ContestCard = ({ contest }) => {
  if (!contest) {
    return null; // Don't render if no contest data
  }

  // Destructure titleSlug as well
  const { title, startTime, url, titleSlug } = contest;
  const formattedStartTime = formatDateTime(startTime);

  // Construct the registration URL using titleSlug if available
  const registrationUrl = titleSlug ? `https://leetcode.com/contest/${titleSlug}` : url; // Fallback to url if titleSlug is missing

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700 flex flex-col justify-between min-h-[150px]">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate" title={title}>
          {title || 'Untitled Contest'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {formattedStartTime}
        </p>
        <div className="mb-3">
           <CountdownTimer targetDate={startTime} />
        </div>
      </div>
      <div>
        {registrationUrl ? ( // Check if we have a URL to link to
          <a
            href={registrationUrl} // Use the constructed or fallback URL
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out"
          >
            Register
          </a>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">No registration link</span>
        )}
      </div>
    </div>
  );
};

export default ContestCard;
