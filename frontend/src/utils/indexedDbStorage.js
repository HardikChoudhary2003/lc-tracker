/**
 * IndexedDB utility for problem status caching
 */

const DB_NAME = 'leetcode-tracker-db';
const DB_VERSION = 1;
const PROBLEM_STORE = 'problem-statuses';

/**
 * Opens the IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
export const openDatabase = () => { // Add export keyword here
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(PROBLEM_STORE)) {
        const store = db.createObjectStore(PROBLEM_STORE, { keyPath: 'key' });
        store.createIndex('userId', 'userId');
        store.createIndex('problemSlug', 'problemSlug');
        store.createIndex('lastChecked', 'lastChecked');
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Saves a problem status to IndexedDB
 * @param {string} userId - User ID
 * @param {string} problemSlug - Problem slug
 * @param {boolean} isSolved - Whether the problem is solved
 * @returns {Promise<void>}
 */
export const saveProblemStatusToIndexedDB = async (userId, problemSlug, isSolved) => {
  if (!userId || !problemSlug) return;
  
  try {
    const db = await openDatabase();
    const transaction = db.transaction(PROBLEM_STORE, 'readwrite');
    const store = transaction.objectStore(PROBLEM_STORE);
    
    const key = `${userId}-${problemSlug}`;
    store.put({
      key,
      userId,
      problemSlug,
      isSolved,
      lastChecked: Date.now()
    });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
  }
};

/**
 * Gets a problem status from IndexedDB
 * @param {string} userId - User ID
 * @param {string} problemSlug - Problem slug
 * @returns {Promise<{key: string, userId: string, problemSlug: string, isSolved: boolean, lastChecked: number}|null>}
 */
export const getProblemStatusFromIndexedDB = async (userId, problemSlug) => {
  if (!userId || !problemSlug) return null;
  
  try {
    const db = await openDatabase();
    const transaction = db.transaction(PROBLEM_STORE, 'readonly');
    const store = transaction.objectStore(PROBLEM_STORE);
    
    const key = `${userId}-${problemSlug}`;
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        db.close();
        resolve(request.result || null);
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error reading from IndexedDB:', error);
    return null;
  }
};

/**
 * Gets all problem statuses for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Object with problem slugs as keys and status as values
 */
export const getAllProblemStatusesFromIndexedDB = async (userId) => {
  if (!userId) return {};
  
  try {
    const db = await openDatabase();
    const transaction = db.transaction(PROBLEM_STORE, 'readonly');
    const store = transaction.objectStore(PROBLEM_STORE);
    const index = store.index('userId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(userId);
      request.onsuccess = () => {
        db.close();
        // Convert to {problemSlug: isSolved} format
        const statuses = {};
        for (const record of request.result || []) {
          statuses[record.problemSlug] = record.isSolved;
        }
        resolve(statuses);
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error getting all statuses from IndexedDB:', error);
    return {};
  }
};

/**
 * Checks if a status is stale (older than maxAgeMs)
 * @param {Object} status - The status object from IndexedDB
 * @param {number} maxAgeMs - Maximum age in milliseconds (default: 24 hours)
 * @returns {boolean} - True if the status is stale
 */
export const isStatusStale = (status, maxAgeMs = 24 * 60 * 60 * 1000) => {
  if (!status || !status.lastChecked) return true;
  
  const ageMs = Date.now() - status.lastChecked;
  return ageMs > maxAgeMs;
};

/**
 * Deletes all problem statuses for a user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const clearProblemStatusesFromIndexedDB = async (userId) => {
  if (!userId) return;
  
  try {
    const db = await openDatabase();
    const transaction = db.transaction(PROBLEM_STORE, 'readwrite');
    const store = transaction.objectStore(PROBLEM_STORE);
    const index = store.index('userId');
    
    const keyRequest = index.getAllKeys(userId);
    
    return new Promise((resolve, reject) => {
      keyRequest.onsuccess = () => {
        const keys = keyRequest.result || [];
        
        if (keys.length === 0) {
          db.close();
          resolve();
          return;
        }
        
        keys.forEach(key => {
          store.delete(key);
        });
        
        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
      };
      
      keyRequest.onerror = () => {
        db.close();
        reject(keyRequest.error);
      };
    });
  } catch (error) {
    console.error('Error clearing problem statuses from IndexedDB:', error);
  }
};

// Add these aliases for compatibility with existing code
export const getAllProblemStatuses = getAllProblemStatusesFromIndexedDB;
export const clearProblemStatuses = clearProblemStatusesFromIndexedDB;
