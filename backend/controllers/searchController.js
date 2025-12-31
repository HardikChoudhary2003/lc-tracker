import { searchContests, getUserProblemStatuses } from '../services/searchService.js';

/**
 * Handle search requests for contests and problems
 */
export const searchContestsAndProblems = async (req, res) => {
  const { query } = req.query;
  const userId = req.user.id;

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    // Get search results
    const searchResults = await searchContests(query.trim());
    
    // Get problem statuses for the user
    const problemSlugs = new Set();
    searchResults.forEach(contest => {
      contest.problems.forEach(p => problemSlugs.add(p.titleSlug));
    });

    const userStatuses = await getUserProblemStatuses(userId, Array.from(problemSlugs));

    res.json({ 
      contests: searchResults,
      userStatuses,
      totalFound: searchResults.length
    });
  } catch (error) {
    console.error(`Error searching contests:`, error);
    res.status(500).json({ message: 'Search failed. Please try again.' });
  }
};
