import Contest from '../models/Contest.js';

/**
 * Get dashboard data including contests (without MongoDB problem status caching)
 */
export const getDashboardData = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const type = req.query.type || 'all';

  try {
    // 1. Build contest query based on type
    const contestQuery = {};
    if (type === 'weekly') contestQuery.title = { $regex: /^Weekly Contest/i };
    else if (type === 'biweekly') contestQuery.title = { $regex: /^Biweekly Contest/i };

    // 2. Get contests with pagination
    const contests = await Contest.find(contestQuery)
      .sort({ startTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // 3. Return contests without problem statuses (will be fetched client-side)
    res.json({ 
      contests, 
      userStatuses: {} // Empty object since we'll use IndexedDB on client
    });
  } catch (error) {
    console.error(`Error fetching dashboard data:`, error);
    res.status(500).json({ message: 'Failed to load dashboard.' });
  }
};
