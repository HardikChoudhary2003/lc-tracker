import React, { useState } from 'react';
import { refreshVisibleProblemStatuses } from '../utils/problemRefreshUtil';

const SyncButton = ({ userId, contests, onSyncComplete }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  const handleSync = async () => {
    if (isSyncing || !userId || !contests?.length) return;
    
    setIsSyncing(true);
    
    try {
      const updatedStatuses = await refreshVisibleProblemStatuses(userId, contests);
      setLastSynced(new Date());
      
      if (typeof onSyncComplete === 'function') {
        onSyncComplete(updatedStatuses);
      }
    } catch (error) {
      console.error('Error syncing problem statuses:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md 
                   ${isSyncing 
                     ? 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-300' 
                     : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                   } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {isSyncing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Syncing...
          </>
        ) : (
          <>
            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Sync Status
          </>
        )}
      </button>
      
      {lastSynced && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Last synced: {lastSynced.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default SyncButton;
