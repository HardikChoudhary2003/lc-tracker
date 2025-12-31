import { 
  getProblemStatusFromIndexedDB, 
  saveProblemStatusToIndexedDB,
  getAllProblemStatusesFromIndexedDB,
  clearProblemStatusesFromIndexedDB,
  isStatusStale
} from './indexedDbStorage.js';

/**
 * Gets stored problem statuses for a user (from IndexedDB or localStorage fallback)
 * @param {string} userId - User ID 
 * @returns {Promise<Object>} Problem statuses object with titleSlug as key and boolean as value
 */
export async function getStoredProblemStatuses(userId) {
  if (!userId) return {};
  
  try {
    // Try to get from IndexedDB first
    const statuses = await getAllProblemStatusesFromIndexedDB(userId);
    
    // If no statuses found in IndexedDB, try to get from localStorage as fallback
    if (Object.keys(statuses).length === 0) {
      try {
        const key = `leetcode-problem-statuses-${userId}`;
        const stored = localStorage.getItem(key);
        const localStorageStatuses = stored ? JSON.parse(stored) : {};
        
        // If we found statuses in localStorage, migrate them to IndexedDB
        if (Object.keys(localStorageStatuses).length > 0) {
          for (const [titleSlug, isSolved] of Object.entries(localStorageStatuses)) {
            await saveProblemStatusToIndexedDB(userId, titleSlug, isSolved);
          }
          return localStorageStatuses;
        }
      } catch (error) {
        console.error('Error reading problem statuses from localStorage:', error);
      }
    }
    
    return statuses;
  } catch (error) {
    console.error('Error getting stored problem statuses:', error);
    return {};
  }
}

/**
 * Stores a problem's status in IndexedDB
 * @param {string} userId - User ID
 * @param {string} titleSlug - Problem's titleSlug
 * @param {boolean} isSolved - Whether the problem is solved
 * @returns {Promise<void>}
 */
export async function storeProblemStatus(userId, titleSlug, isSolved) {
  if (!userId || !titleSlug) return;
  
  try {
    await saveProblemStatusToIndexedDB(userId, titleSlug, isSolved);
    
    // Also update localStorage as fallback
    try {
      const key = `leetcode-problem-statuses-${userId}`;
      const statuses = await getStoredProblemStatuses(userId);
      statuses[titleSlug] = isSolved;
      localStorage.setItem(key, JSON.stringify(statuses));
    } catch (error) {
      console.error('Error storing problem status in localStorage:', error);
    }
  } catch (error) {
    console.error('Error storing problem status:', error);
  }
}

/**
 * Gets a problem's status from storage
 * @param {string} userId - User ID
 * @param {string} titleSlug - Problem's titleSlug
 * @param {number} maxAgeMs - Maximum age in milliseconds before status is considered stale
 * @returns {Promise<{isSolved: boolean, isStale: boolean}>} Problem status and staleness
 */
export async function getProblemStatus(userId, titleSlug, maxAgeMs = 24 * 60 * 60 * 1000) {
  if (!userId || !titleSlug) return { isSolved: false, isStale: true };
  
  try {
    const status = await getProblemStatusFromIndexedDB(userId, titleSlug);
    
    if (!status) {
      // Try localStorage fallback
      const key = `leetcode-problem-statuses-${userId}`;
      try {
        const stored = localStorage.getItem(key);
        const statuses = stored ? JSON.parse(stored) : {};
        
        if (titleSlug in statuses) {
          // Migrate to IndexedDB
          await saveProblemStatusToIndexedDB(userId, titleSlug, statuses[titleSlug]);
          return { isSolved: statuses[titleSlug], isStale: true };
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
      
      return { isSolved: false, isStale: true };
    }
    
    return { 
      isSolved: status.isSolved, 
      isStale: isStatusStale(status, maxAgeMs)
    };
  } catch (error) {
    console.error('Error getting problem status:', error);
    return { isSolved: false, isStale: true };
  }
}

/**
 * Clears all stored problem statuses for a user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export async function clearStoredProblemStatuses(userId) {
  if (!userId) return;
  
  try {
    // Clear from IndexedDB
    await clearProblemStatusesFromIndexedDB(userId);
    
    // Also clear from localStorage
    try {
      const key = `leetcode-problem-statuses-${userId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing problem statuses from localStorage:', error);
    }
  } catch (error) {
    console.error('Error clearing problem statuses:', error);
  }
}
