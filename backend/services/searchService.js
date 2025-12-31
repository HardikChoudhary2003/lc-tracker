import Contest from '../models/Contest.js';
import ProblemStatusCache from '../models/ProblemStatusCache.js';

/**
 * Search for contests matching the query
 * @param {string} queryString - Search query
 * @returns {Array} - Array of matching contests
 */
export const searchContests = async (queryString) => {
  // Create search regex pattern
  const searchPattern = new RegExp(queryString, 'i');

  // Search in contest titles and problem titles
  const contests = await Contest.find({
    $or: [
      { title: searchPattern },
      { 'problems.title': searchPattern }
    ]
  })
  .sort({ startTime: -1 })
  .limit(20) // Limit results for performance
  .lean();

  // Process results to mark matching fields
  const processedResults = contests.map(contest => {
    // Check if contest title matches
    const titleMatch = searchPattern.test(contest.title);
    
    // Check and mark matching problems
    const problems = contest.problems.map(problem => ({
      ...problem,
      isMatch: searchPattern.test(problem.title)
    }));
    
    // Add flags to indicate matches
    return {
      ...contest,
      isContestMatch: titleMatch,
      problems,
      hasMatches: titleMatch || problems.some(p => p.isMatch)
    };
  });

  // Only return contests that have matches
  return processedResults.filter(contest => contest.hasMatches);
};

/**
 * Get problem solving statuses for a user
 * @param {string} userId - User ID
 * @param {Array} problemSlugs - Array of problem slugs
 * @returns {Object} - Map of problem slugs to solved status
 */
export const getUserProblemStatuses = async (userId, problemSlugs) => {
  const userCacheEntries = await ProblemStatusCache.find({
    userId,
    problemSlug: { $in: problemSlugs }
  }).lean();

  return userCacheEntries.reduce((acc, entry) => {
    acc[entry.problemSlug] = entry.isSolved;
    return acc;
  }, {});
};
