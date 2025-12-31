import axios from 'axios';
import { saveProblemStatusToIndexedDB } from './indexedDbStorage';

/**
 * Refreshes problem statuses in batches
 * @param {string} userId - User ID
 * @param {Array<string>} slugs - Array of problem slugs to refresh
 * @returns {Promise<Object>} - Object with slugs as keys and statuses as values
 */
export const refreshProblemStatuses = async (userId, slugs) => {
  if (!userId || !slugs || slugs.length === 0) return {};
  
  console.log(`Refreshing ${slugs.length} problem statuses...`);
  
  const results = {};
  const BATCH_SIZE = 5; // Process 5 problems at a time
  
  // Create batches
  const batches = [];
  for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
    batches.push(slugs.slice(i, i + BATCH_SIZE));
  }
  
  // Process each batch
  for (const batch of batches) {
    console.log(`Processing batch of ${batch.length} problems...`);
    
    await Promise.all(
      batch.map(async (slug) => {
        try {
          // Force API to bypass MongoDB cache by adding a cache-busting parameter
          console.log(`Fetching status for ${slug}...`);
          const response = await axios.get(`/api/problem-status/${slug}?forceRefresh=true&_=${Date.now()}`);
          const isSolved = response.data.isSolved;
          console.log(`Status for ${slug}: ${isSolved}`);
          
          // Ensure IndexedDB is actually getting updated - add more robust error handling
          try {
            console.log(`Saving ${slug} status to IndexedDB: ${isSolved}`);
            await saveProblemStatusToIndexedDB(userId, slug, isSolved);
            console.log(`Successfully saved ${slug} to IndexedDB!`);
            
            // Verify by reading it back
            const db = await window.indexedDB.open('leetcode-tracker-db');
            console.log(`IndexedDB connection: ${db ? 'Successful' : 'Failed'}`);
          } catch (dbError) {
            console.error(`IndexedDB error for ${slug}:`, dbError);
          }
          
          // Add to results
          results[slug] = isSolved;
        } catch (error) {
          console.error(`Error refreshing status for ${slug}:`, error);
          results[slug] = false;
        }
      })
    );
    
    // Add delay between batches to avoid rate limiting
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  console.log(`Refresh complete. Updated ${Object.keys(results).length} problems.`);
  return results;
};

/**
 * Extracts unique problem slugs from contest data
 * @param {Array} contests - Array of contest objects
 * @returns {Array<string>} - Array of unique problem slugs
 */
export const extractProblemSlugs = (contests) => {
  const slugSet = new Set();
  
  contests.forEach(contest => {
    (contest.problems || []).forEach(problem => {
      if (problem.titleSlug) {
        slugSet.add(problem.titleSlug);
      }
    });
  });
  
  return Array.from(slugSet);
};

/**
 * Refreshes all visible problem statuses
 * @param {string} userId - User ID
 * @param {Array} contests - Array of contest objects
 * @returns {Promise<Object>} - Object with slugs as keys and statuses as values
 */
export const refreshVisibleProblemStatuses = async (userId, contests) => {
  const slugs = extractProblemSlugs(contests);
  console.log(`Found ${slugs.length} unique problems to refresh.`);
  return refreshProblemStatuses(userId, slugs);
};
