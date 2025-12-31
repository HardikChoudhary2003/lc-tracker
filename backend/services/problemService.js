import ProblemStatusCache from '../models/ProblemStatusCache.js';
import User from '../models/User.js';
import { decrypt } from '../utils/crypto.js';
import fetch from 'node-fetch';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql/';
const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0',
  'Referer': 'https://leetcode.com'
};

/**
 * Check problem solved status in cache
 * @param {string} userId - User ID
 * @param {string} slug - Problem slug
 * @returns {Object|null} - Cached status or null if not found
 */
export const checkProblemStatusCache = async (userId, slug) => {
  return ProblemStatusCache.findOne({ userId, problemSlug: slug });
};

/**
 * Check problem status via LeetCode API
 * @param {string} userId - User ID
 * @param {string} slug - Problem slug
 * @returns {Object} - Result object with isSolved or error
 */
export const checkProblemStatusAPI = async (userId, slug) => {
  // Get user's session key
  const user = await User.findById(userId).select('+leetcodeSessionKey').lean();
  if (!user || !user.leetcodeSessionKey) {
    return { 
      error: 'LeetCode session key not set. Please update your profile.',
      statusCode: 403
    };
  }

  // Decrypt the key
  const sessionKey = decrypt(user.leetcodeSessionKey);
  if (!sessionKey) {
    console.error(`Failed to decrypt session key for user ID: ${userId}`);
    return { 
      error: 'Error processing session key.',
      statusCode: 500
    };
  }

  // Query LeetCode API
  const query = {
    query: `
      query isProblemSolved($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          status
        }
      }
    `,
    variables: { titleSlug: slug }
  };

  try {
    const apiRes = await fetch(LEETCODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        ...BASE_HEADERS,
        'Cookie': `LEETCODE_SESSION=${sessionKey}`
      },
      body: JSON.stringify(query)
    });

    if (!apiRes.ok) {
      return { 
        error: 'Failed to verify problem with LeetCode.',
        statusCode: apiRes.status
      };
    }

    const json = await apiRes.json();
    const isSolved = json?.data?.question?.status === 'ac';
    return { isSolved };
  } catch (error) {
    return { 
      error: 'Error connecting to LeetCode API',
      statusCode: 500
    };
  }
};

/**
 * Update problem status in cache
 * @param {string} userId - User ID
 * @param {string} slug - Problem slug
 * @param {boolean} isSolved - Solved status
 */
export const updateProblemStatusCache = async (userId, slug, isSolved) => {
  return ProblemStatusCache.updateOne(
    { userId, problemSlug: slug },
    { $set: { isSolved, lastChecked: new Date() } },
    { upsert: true }
  );
};
