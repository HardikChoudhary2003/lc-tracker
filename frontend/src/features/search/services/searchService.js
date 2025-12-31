import axios from 'axios';
import { calculateRelevanceScore, sortByRelevance } from '../utils/searchUtils';

/**
 * Fetches search results from the API
 * 
 * @param {string} query - The search query
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<{contests: Array, userStatuses: Object}>} - Search results
 */
export const fetchSearchResults = async (query, limit) => {
  if (!query.trim() || query.trim().length < 3) {
    return { contests: [], userStatuses: {} };
  }
  
  const response = await axios.get(
    `/api/search?query=${encodeURIComponent(query)}&limit=${limit}`
  );
  
  let results = response.data.contests || [];
  
  // Calculate relevance scores if not already provided by API
  if (results.length > 0 && !results[0].hasOwnProperty('relevanceScore')) {
    results = results.map(contest => calculateRelevanceScore(contest, query));
    results = sortByRelevance(results);
  }
  
  return {
    contests: results,
    userStatuses: response.data.userStatuses || {}
  };
};
