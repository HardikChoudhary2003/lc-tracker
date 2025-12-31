import axios from 'axios';
import { storeProblemStatus } from '../../../utils/problemStatusStorage';
import { checkProblemSolved } from '../../../services/leetcodeService';

/**
 * Refreshes the status of multiple problems at once
 * @param {string} userId - The user ID
 * @param {Array} problemSlugs - Array of problem slugs to refresh
 * @returns {Promise<Object>} - Object with problem slugs as keys and status as values
 */
export async function refreshProblemStatuses(userId, problemSlugs) {
  if (!userId || !problemSlugs || !problemSlugs.length) {
    return {};
  }

  const batchSize = 5; // Process 5 problems at a time to avoid rate limiting
  const results = {};
  const chunks = [];

  // Split the problem slugs into chunks
  for (let i = 0; i < problemSlugs.length; i += batchSize) {
    chunks.push(problemSlugs.slice(i, i + batchSize));
  }

  // Process each chunk sequentially
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (slug) => {
        try {
          // CHANGED: Use our direct LeetCode service
          const isSolved = await checkProblemSolved(slug);
          
          // Update IndexedDB storage
          await storeProblemStatus(userId, slug, isSolved);
          
          // Add to results
          results[slug] = isSolved;
        } catch (error) {
          console.error(`Error refreshing status for ${slug}:`, error);
          results[slug] = false;
        }
      })
    );
    
    // Add a small delay between chunks to avoid overloading the server
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return results;
}

/**
 * Refreshes all problem statuses visible in the current page
 * @param {string} userId - The user ID
 * @param {Array} contests - Array of contest objects containing problems
 * @returns {Promise<Object>} - Updated user statuses object
 */
export async function refreshVisibleProblemStatuses(userId, contests) {
  if (!userId || !contests || !contests.length) {
    return {};
  }
  
  // Collect all problem slugs from visible contests
  const problemSlugs = [];
  contests.forEach(contest => {
    contest.problems.forEach(problem => {
      if (problem.titleSlug) {
        problemSlugs.push(problem.titleSlug);
      }
    });
  });
  
  // Remove duplicates
  const uniqueSlugs = [...new Set(problemSlugs)];
  
  // Refresh statuses
  return await refreshProblemStatuses(userId, uniqueSlugs);
}
