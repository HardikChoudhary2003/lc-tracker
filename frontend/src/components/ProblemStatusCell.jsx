import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { 
  getProblemStatusFromIndexedDB, 
  saveProblemStatusToIndexedDB,
  isStatusStale
} from '../utils/indexedDbStorage';
import { addProblematicSlug, isProblematicSlug } from '../utils/apiHealthCheck';

// Helper for retry with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 300) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      if (retries >= maxRetries) throw error;
      
      // Exponential backoff: 300ms, 600ms, 1200ms
      const delay = baseDelay * Math.pow(2, retries - 1);
      console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Helper for formatted logging with timestamps
const logWithTime = (message, data) => {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  console.log(`[${timestamp}] ${message}`, data || '');
};

const ProblemStatusCell = ({ problem, userId, hasLeetcodeKey, initialStatus }) => {
  // State and refs
  const [isSolved, setIsSolved] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const cellRef = useRef(null);
  const observerRef = useRef(null);
  const hasCheckedRef = useRef(false);
  
  // API call with retries, memoized to avoid recreation on re-renders
  const fetchProblemStatus = useCallback(async (slug) => {
    // Skip API call for known problematic slugs
    if (isProblematicSlug(slug)) {
      logWithTime(`Skipping API call for known problematic slug: ${slug}`);
      throw new Error(`Known problematic slug: ${slug}`);
    }
    
    return retryWithBackoff(async () => {
      logWithTime(`Fetching status for ${slug}...`);
      try {
        const response = await axios.get(`/api/problem-status/${slug}?forceRefresh=true&t=${Date.now()}`);
        logWithTime(`API result for ${slug}: ${response.data.isSolved} (source: ${response.data.source || 'unknown'})`);
        return response.data.isSolved;
      } catch (error) {
        // Log the specific error details for better debugging
        if (error.response) {
          // Server responded with an error status
          logWithTime(`Server error (${error.response.status}) for ${slug}: ${error.response.data?.message || 'Unknown error'}`);
          
          // Add to problematic slugs if server returns 500
          if (error.response.status === 500) {
            addProblematicSlug(slug);
          }
        } else if (error.request) {
          // Request made but no response received
          logWithTime(`No response received for ${slug}`);
        } else {
          // Error setting up the request
          logWithTime(`Request setup error for ${slug}: ${error.message}`);
        }
        throw error; // Rethrow for the retry mechanism
      }
    }, 2, 500); // Reduced to 2 retries since 500 errors are likely to persist
  }, []);
  
  // Check and set problem status, handle all cases
  const checkProblemStatus = useCallback(async () => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    setIsLoading(true);
    logWithTime(`${problem.titleSlug} is visible, checking status... (hasLeetcodeKey: ${hasLeetcodeKey})`);

    try {
      // Step 1: Try IndexedDB first for a FRESH status
      logWithTime(`Checking IndexedDB for ${problem.titleSlug}...`);
      const cachedStatus = await getProblemStatusFromIndexedDB(userId, problem.titleSlug);

      if (cachedStatus && !isStatusStale(cachedStatus)) {
        logWithTime(`Using fresh IndexedDB cache for ${problem.titleSlug}: ${cachedStatus.isSolved}`);
        setIsSolved(cachedStatus.isSolved);
        setIsLoading(false); // Stop loading early if fresh cache found
        return;
      }

      // Log if cache is stale
      if (cachedStatus) {
        const ageMs = Date.now() - cachedStatus.lastChecked;
        const ageMinutes = Math.floor(ageMs / 60000);
        logWithTime(`Cache for ${problem.titleSlug} is stale (${ageMinutes} minutes old)`);
      }

      // Step 2: Check if we have the LeetCode key
      logWithTime(`hasLeetcodeKey value: ${hasLeetcodeKey}`);
      if (hasLeetcodeKey) {
        // Step 2a: Has key, attempt API call
        logWithTime(`Has LeetCode key, will attempt API call for ${problem.titleSlug}`);
        try {
          const status = await fetchProblemStatus(problem.titleSlug);
          logWithTime(`Saving to IndexedDB: ${problem.titleSlug} = ${status}`);
          await saveProblemStatusToIndexedDB(userId, problem.titleSlug, status);
          setIsSolved(status);
        } catch (apiError) {
          // API failed, use fallbacks: stale cache > initialStatus > false
          logWithTime(`API call failed for ${problem.titleSlug}, using fallbacks: ${apiError.message}`);
          if (cachedStatus) {
            logWithTime(`Falling back to stale cache for ${problem.titleSlug}: ${cachedStatus.isSolved}`);
            setIsSolved(cachedStatus.isSolved);
          } else if (initialStatus !== undefined) {
            logWithTime(`Falling back to initialStatus for ${problem.titleSlug}: ${initialStatus}`);
            setIsSolved(initialStatus);
            // Cache the initialStatus if API failed and no cache existed
            await saveProblemStatusToIndexedDB(userId, problem.titleSlug, initialStatus);
          } else {
            logWithTime(`No fallbacks available after API error for ${problem.titleSlug}, defaulting to false`);
            setIsSolved(false);
          }
        }
      } else {
        // Step 2b: No key, default to false (since fresh cache wasn't found in Step 1)
        logWithTime(`Skipping API call - no LeetCode key available for user ${userId}. Defaulting status to false for ${problem.titleSlug}.`);
        setIsSolved(false);
        // Do not cache 'false' derived purely from lack of key, as it's not confirmed.
      }
    } catch (error) {
      console.error(`Error checking status for ${problem.titleSlug}:`, error);
      // On general error, use fallbacks: stale cache > initialStatus > false
      const cachedStatusOnError = await getProblemStatusFromIndexedDB(userId, problem.titleSlug).catch(() => null);
      if (cachedStatusOnError) {
        logWithTime(`Error recovery: using cached status ${cachedStatusOnError.isSolved}`);
        setIsSolved(cachedStatusOnError.isSolved);
      } else if (initialStatus !== undefined) {
        logWithTime(`Error recovery: using initialStatus ${initialStatus}`);
        setIsSolved(initialStatus);
      } else {
        setIsSolved(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [problem.titleSlug, userId, hasLeetcodeKey, initialStatus, fetchProblemStatus]);
  
  // Check IndexedDB on mount (before visibility)
  useEffect(() => {
    const checkIndexedDbOnMount = async () => {
      if (hasCheckedRef.current) return;
      
      try {
        // Only check IndexedDB, don't make API calls yet
        const cachedStatus = await getProblemStatusFromIndexedDB(userId, problem.titleSlug);
        
        if (cachedStatus && !isStatusStale(cachedStatus)) {
          logWithTime(`[Mount] Using IndexedDB for ${problem.titleSlug}: ${cachedStatus.isSolved}`);
          setIsSolved(cachedStatus.isSolved);
          // Don't set hasCheckedRef to true so IntersectionObserver can still refresh if needed
        }
      } catch (error) {
        console.error(`[Mount] Error checking initial IndexedDB status:`, error);
      }
    };
    
    checkIndexedDbOnMount();
  }, [userId, problem.titleSlug]);
  
  // Set up the intersection observer
  useEffect(() => {
    if (!cellRef.current) return;
    
    // Create and store the observer in a ref
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          checkProblemStatus();
          // Disconnect after triggering
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    // Start observing
    observerRef.current.observe(cellRef.current);
    
    return () => {
      // Clean up properly
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [checkProblemStatus]);
  
  // Simple skeleton loader - with smaller dots and reduced spacing
  const SkeletonLoader = () => (
    <span className="animate-pulse inline-flex space-x-0.5">
      <span className="h-1.5 w-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
      <span className="h-1.5 w-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
      <span className="h-1.5 w-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
    </span>
  );
  
  // Render status badge with consistent styling
  const renderStatusBadge = (mobile = false) => {
    // Use smaller text for status badges and reduced padding
    const baseClasses = 'text-[10px] px-1 py-0.5 rounded leading-none';
    let statusClasses = '';
    let statusText = '';
    
    if (isLoading) {
      statusClasses = 'bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-300';
      statusText = 'Checking...';
    } else if (isSolved) {
      statusClasses = 'bg-green-100 text-green-700 dark:bg-emerald-900/60 dark:text-emerald-100';
      statusText = 'Solved';
    } else {
      statusClasses = 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200';
      statusText = 'Not Solved';
    }
    
    // Desktop version has slightly different styling
    if (!mobile) {
      return (
        <p className={`font-medium mt-1 hidden sm:block text-[11px] ${
          isLoading
            ? 'text-gray-500 dark:text-gray-400'
            : isSolved
            ? 'text-green-700 dark:text-emerald-300'
            : 'text-red-500 dark:text-red-300'
        }`}>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            statusText
          )}
        </p>
      );
    }
    
    return (
      <span className={`${baseClasses} ${statusClasses}`}>
        {statusText}
      </span>
    );
  };

  return (
    <div
      ref={cellRef}
      className={`p-3 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200 relative ${
        isSolved
          ? 'bg-green-50 dark:bg-emerald-900/20 dark:border-emerald-900/30'
          : 'bg-gray-50 dark:bg-gray-700/40'
      } sm:border-t-0 sm:border-l-0 border-t border-l border-r border-gray-200 dark:border-gray-700 sm:border-r-0 sm:rounded-none rounded-sm mt-1 sm:mt-0 mx-2 sm:mx-0`}
    >
      {/* Mobile view */}
      <div className="flex justify-between items-center mb-2 sm:hidden">
        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-medium mr-2">
          {problem.credit}
        </span>
        {renderStatusBadge(true)}
      </div>

      {/* Desktop difficulty badge */}
      <div 
        className="absolute bottom-2 right-2 hidden sm:block" 
        title={`Difficulty: ${problem.credit}`}
      >
        <span className="inline-block px-1.5 py-0.5 text-xs leading-none text-center font-medium rounded-full shadow-sm bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 text-[10px] min-w-[18px]">
          {problem.credit}
        </span>
      </div>

      {/* Problem title with link */}
      <a
        href={`https://leetcode.com/problems/${problem.titleSlug}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline break-words"
        title={problem.title}
      >
        {problem.title}
      </a>
      
      {/* Desktop status */}
      {renderStatusBadge()}
    </div>
  );
};

export default ProblemStatusCell;
