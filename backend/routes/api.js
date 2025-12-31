import express from 'express';
import { ensureAuth } from '../middleware/auth.js';
import { getDashboardData } from '../controllers/dashboardController.js';
import { checkProblemStatus } from '../controllers/problemController.js';
import { getContestVideos } from '../controllers/videoController.js';
import { searchContestsAndProblems } from '../controllers/searchController.js';
import { proxyLeetCodeRequest, getRecentSubmissions } from '../controllers/leetcodeController.js'; // Import getRecentSubmissions
import { clearProblemStatusCache } from '../controllers/adminController.js';
import User from '../models/User.js';

const router = express.Router();

// Add a middleware to log all API requests
router.use((req, res, next) => {
  console.log(`API Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Add a test route to check if the API is accessible
router.get('/test', (req, res) => {
  res.json({ message: 'API is working correctly' });
});

// Add diagnostic route to check user's LeetCode key status
router.get('/diagnostic/key-status', ensureAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('+leetcodeSessionKey').lean();
    
    res.json({ 
      hasLeetcodeKey: !!user?.leetcodeSessionKey,
      userId
    });
  } catch (error) {
    console.error('Diagnostic error:', error);
    res.status(500).json({ error: 'Diagnostic failed' });
  }
});

// =============================================================================
// == DASHBOARD ROUTES                                                        ==
// =============================================================================

// GET /api/dashboard-data - Fetch contest data and user problem statuses
router.get('/dashboard-data', ensureAuth, getDashboardData);

// =============================================================================
// == PROBLEM STATUS ROUTES                                                   ==
// =============================================================================

// GET /api/problem-status/:slug - Check if a specific problem is solved
router.get('/problem-status/:slug', ensureAuth, checkProblemStatus);

// =============================================================================
// == LEETCODE PROXY ROUTE                                                    ==
// =============================================================================

// POST /api/leetcode-proxy - Proxy requests to LeetCode GraphQL API
router.post('/leetcode-proxy', ensureAuth, proxyLeetCodeRequest);

// GET /api/leetcode/submissions - Fetch recent submissions from LeetCode REST API
router.get('/leetcode/submissions', ensureAuth, getRecentSubmissions);

// =============================================================================
// == YOUTUBE VIDEO ROUTES                                                    ==
// =============================================================================

// GET /api/contest-videos/:slug - Find YouTube video link for a specific contest
router.get('/contest-videos/:slug', ensureAuth, getContestVideos);

// =============================================================================
// == SEARCH ROUTES                                                           ==
// =============================================================================

// GET /api/search - Search contests and problems
router.get('/search', ensureAuth, searchContestsAndProblems);

// =============================================================================
// == ADMIN ROUTES                                                            ==
// =============================================================================

// POST /api/admin/clear-problem-cache - Clear problem status cache
router.post('/admin/clear-problem-cache', ensureAuth, clearProblemStatusCache);

export default router;
