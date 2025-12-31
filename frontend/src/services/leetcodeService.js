import axios from 'axios';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

/**
 * Check if a problem is solved using LeetCode GraphQL API
 * @param {string} titleSlug - Problem's titleSlug
 * @returns {Promise<boolean>} Whether the problem is solved
 */
export async function checkProblemSolved(titleSlug) {
  try {
    const response = await axios.post('/api/leetcode-proxy', {
      query: `
        query isProblemSolved($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            status
          }
        }
      `,
      variables: { titleSlug }
    });

    // LeetCode returns 'ac' when a problem is accepted/solved
    return response.data?.data?.question?.status === 'ac';
  } catch (error) {
    console.error(`Error checking problem status for ${titleSlug}:`, error);
    throw error;
  }
}

/**
 * Fetch recent submissions from the backend API
 * @param {number} [offset=0] - The starting offset for submissions
 * @param {number} [limit=20] - The maximum number of submissions to fetch
 * @returns {Promise<object>} The submissions data from the API
 */
export async function fetchRecentSubmissions(offset = 0, limit = 20) {
  try {
    const response = await axios.get('/api/leetcode/submissions', {
      params: { offset, limit } // Pass offset and limit as query parameters
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent submissions:', error.response ? error.response.data : error);
    // Rethrow the error but include more context if available from the server response
    const errorMessage = error.response?.data?.message || 'Failed to fetch recent submissions';
    const status = error.response?.status;
    const enhancedError = new Error(errorMessage);
    enhancedError.status = status; // Add status code to the error object
    throw enhancedError;
  }
}
