import ProblemStatusCache from '../models/ProblemStatusCache.js';

/**
 * Clear problem status cache entries
 * Admin function to help with debugging/testing
 */
export const clearProblemStatusCache = async (req, res) => {
  const { userId } = req.body;
  
  try {
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    
    const result = await ProblemStatusCache.deleteMany(query);
    console.log(`Cleared ${result.deletedCount} problem status cache entries`);
    
    res.json({
      success: true,
      message: `Cleared ${result.deletedCount} cache entries`,
    });
  } catch (error) {
    console.error('Error clearing problem status cache:', error);
    res.status(500).json({ message: 'Error clearing cache' });
  }
};
