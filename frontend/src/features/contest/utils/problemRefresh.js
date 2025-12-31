import axios from 'axios';
import { saveProblemStatus } from '../../../utils/indexedDbStorage';

/**
 * Refresh problem statuses in batches
 * @param {string} userId - User ID
 * @param {Array<string>} slugs - Array of problem slugs 
 * @returns {Promise<Object>} - Object with slugs as keys and solved status as values
 */
export async function refreshProblemStatuses(userId, slugs) {
  if (!userId || !slugs || slugs.length === 0) return {};
  
  const results = {};
  const BATCH_SIZE = 5;
  
  // Process in batches
  for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
    const batch = slugs.slice(i, i + BATCH_SIZE);
    
    // Process each slug in batch concurrently
    await Promise.all(batch.map(async (slug) => {
      try {
        const response = await axios.get(`/api/problem-status/${slug}`);
        const isSolved = response.data.isSolved;
        
        // Store in IndexedDB
        await saveProblemStatus(userId, slug, isSolved);
        
        // Add to results
        results[slug] = isSolved;
      } catch (error) {
        console.error(`Error refreshing status for ${slug}:`, error);
        results[slug] = false;
      }
    }));
    
    // Add delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < slugs.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  return results;
}

/**
 * Extract problem slugs from contests
 * @param {Array} contests - Contest data
 * @returns {Array<string>} - Unique problem slugs
 */
export function extractProblemSlugs(contests) {
  const slugs = new Set();
  
  contests.forEach(contest => {
    (contest.problems || []).forEach(problem => {
      if (problem.titleSlug) {
        slugs.add(problem.titleSlug);
      }
    });
  });
  
  return [...slugs];
}

/**
 * Refresh all visible problem statuses
 * @param {string} userId - User ID
 * @param {Array} contests - Array of visible contests
 * @returns {Promise<Object>} - Updated status map
 */
export async function refreshVisibleProblemStatuses(userId, contests) {
  const slugs = extractProblemSlugs(contests);
  return refreshProblemStatuses(userId, slugs);
}
