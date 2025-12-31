import axios from 'axios';

/**
 * Utility for tracking API health and problematic endpoints
 */

// Load previously identified problematic slugs from localStorage
const loadProblematicSlugs = () => {
  try {
    const stored = localStorage.getItem('problematic-slugs');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch (error) {
    console.error('Error loading problematic slugs from localStorage:', error);
    return new Set();
  }
};

// Set of problem slugs known to cause 500 errors
const problematicSlugs = loadProblematicSlugs();

// Debounce timer to avoid too many warnings
let warningDebounceTimer = null;

/**
 * Save problematic slugs to localStorage
 */
const saveProblematicSlugs = () => {
  try {
    localStorage.setItem('problematic-slugs', JSON.stringify([...problematicSlugs]));
  } catch (error) {
    console.error('Error saving problematic slugs to localStorage:', error);
  }
};

/**
 * Add a problematic slug to the set
 * @param {string} slug - Problem slug that caused a 500 error
 */
export const addProblematicSlug = (slug) => {
  if (!problematicSlugs.has(slug)) {
    problematicSlugs.add(slug);
    console.warn(`Added ${slug} to problematic slugs list. Total: ${problematicSlugs.size}`);
    
    // Save to localStorage whenever a new slug is added
    saveProblematicSlugs();
    
    // Show aggregated warning with debounce to avoid spamming
    if (problematicSlugs.size >= 3) {
      clearTimeout(warningDebounceTimer);
      warningDebounceTimer = setTimeout(() => {
        console.warn(
          'Multiple problem slugs are causing 500 errors:', 
          [...problematicSlugs],
          '\nThis could indicate an issue with the backend LeetCode API integration.'
        );
      }, 2000);
    }
  }
};

/**
 * Check if a slug is known to cause 500 errors
 * @param {string} slug - Problem slug to check
 * @returns {boolean} - Whether the slug is known to be problematic
 */
export const isProblematicSlug = (slug) => {
  return problematicSlugs.has(slug);
};

/**
 * Reset the list of problematic slugs (for testing)
 */
export const resetProblematicSlugs = () => {
  problematicSlugs.clear();
  localStorage.removeItem('problematic-slugs');
  console.log('Problematic slugs list has been reset');
};

/**
 * Get the list of all problematic slugs
 * @returns {string[]} - Array of problematic slugs
 */
export const getProblematicSlugs = () => {
  return [...problematicSlugs];
};

/**
 * Check backend API health
 * @returns {Promise<boolean>} - Whether the API is healthy
 */
export const checkApiHealth = async () => {
  try {
    const response = await axios.get('/api/health-check');
    return response.data?.status === 'healthy';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

/**
 * Get problematic slugs count
 * @returns {number} - Number of problematic slugs
 */
export const getProblematicSlugsCount = () => {
  return problematicSlugs.size;
};
