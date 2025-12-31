/**
 * Calculates a relevance score for a contest based on how well it matches the search query
 * 
 * @param {Object} contest - The contest object to score
 * @param {string} query - The search query
 * @returns {Object} - The contest with an added relevanceScore property
 */
export const calculateRelevanceScore = (contest, query) => {
  let score = 0;
  const title = contest.title || '';
  const description = contest.description || '';
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  // Exact title match gets highest score
  if (titleLower === queryLower) {
    score += 100;
  }
  
  // Title contains full query
  if (titleLower.includes(queryLower)) {
    score += 50;
  }
  
  // Each word match in title
  queryWords.forEach(word => {
    if (titleLower.includes(word)) {
      score += 10;
    }
  });
  
  // Description contains query
  if (descLower.includes(queryLower)) {
    score += 5;
  }
  
  // Each word match in description
  queryWords.forEach(word => {
    if (descLower.includes(word)) {
      score += 2;
    }
  });
  
  return {
    ...contest,
    relevanceScore: score
  };
};

/**
 * Sorts search results by relevance score (highest first)
 * 
 * @param {Array} results - Array of contest objects with relevanceScore property
 * @returns {Array} - Sorted array
 */
export const sortByRelevance = (results) => {
  return [...results].sort((a, b) => {
    const scoreA = a.relevanceScore || 0;
    const scoreB = b.relevanceScore || 0;
    return scoreB - scoreA;
  });
};
