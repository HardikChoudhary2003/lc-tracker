import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

function CreditsPage() {
  useEffect(() => {
    document.title = 'Credits - LeetCode Tracker';
  }, []);

  // Placeholder URLs - replace these!
  const tleEliminatorsUrl = "[TLE Eliminators YouTube Channel URL - Placeholder]";
  const vivekGuttaUrl = "[Vivek Gutta YouTube Channel URL - Placeholder]";

  return (
    // Removed card styling (bg, shadow, rounded, border), kept padding and margin
    <div className="py-10 px-6 sm:px-8 lg:px-10 mt-8 relative"> {/* Added relative positioning */}
      
      {/* Back to Home Link */}
      <Link 
        to="/dashboard" 
        className="absolute top-4 left-4 sm:left-6 lg:left-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        aria-label="Back to Dashboard"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>

      {/* Using text-center for the main title/emoji */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center pt-8 sm:pt-0"> {/* Added padding-top for small screens */}
        🙌 Credits
      </h1>
      
      {/* Adjusted prose size to base, removed sm:text-lg for consistency */}
      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6 text-base leading-relaxed"> 
        <p className="italic text-gray-600 dark:text-gray-400"> {/* Slightly styled intro */}
          Built this project as a side escape while prepping DSA for placements — just wanted to make something cool, clean, and mine. AI helped, but the vibe is all me.
        </p>
        
        <p>
          Big thanks to the awesome folks behind the tools and libraries that made this easier — you know who you are. Open-source rocks.
        </p>

        <p className="font-medium"> {/* Added font-medium for emphasis */}
          Special shoutout to:
        </p>
        
        {/* Links for the channels */}
        <ul className="list-none pl-0 space-y-2">
          <li>
            <a 
              href={tleEliminatorsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              TLE Eliminators
            </a>
          </li>
          <li>
            <a 
              href={vivekGuttaUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Vivek Gupta
            </a>
          </li>
        </ul>

        <p>
          Your video solutions? Lifesavers. Appreciate all the effort you put into making tough problems feel doable.
        </p>

        {/* Added font-semibold and tracking-tight to the final message */}
        <p className="pt-6 border-t border-gray-300 dark:border-gray-600 mt-10 font-semibold tracking-tight"> 
          And to anyone building, learning, or vibing with code — keep going. This one’s for the builders.
        </p>
      </div>
    </div>
  );
}

export default CreditsPage;
