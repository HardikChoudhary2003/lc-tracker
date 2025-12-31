import Contest from '../models/Contest.js';
import ProblemStatusCache from '../models/ProblemStatusCache.js';

/**
 * Get contests based on type filter with pagination
 * @param {string} type - Contest type filter (all, weekly, biweekly)
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @returns {Array} - Array of contests
 */
export const getContestsWithFilter = async (type, page, limit) => {
  const skip = (page - 1) * limit;
  
  const contestQuery = {};
  if (type === 'weekly') contestQuery.title = { $regex: /^Weekly Contest/i };
  else if (type === 'biweekly') contestQuery.title = { $regex: /^Biweekly Contest/i };

  return Contest.find(contestQuery)
    .sort({ startTime: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

/**
 * Get problem statuses for a user
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
