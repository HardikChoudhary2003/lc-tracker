import axios from 'axios';
import User from '../models/User.js';
import { decrypt } from '../utils/crypto.js';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

/**
 * Proxy requests to LeetCode GraphQL API
 * This allows us to keep the session cookie secure
 */
export const proxyLeetCodeRequest = async (req, res) => {
  const userId = req.user.id;
  const { query, variables } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'GraphQL query is required' });
  }

  try {
    // Get user's LeetCode session key
    const user = await User.findById(userId).select('+leetcodeSessionKey').lean();
    
    if (!user || !user.leetcodeSessionKey) {
      return res.status(403).json({ 
        message: 'LeetCode session key not found. Please add your API key.'
      });
    }

    // Decrypt the session key
    const sessionKey = decrypt(user.leetcodeSessionKey);
    
    // Forward the request to LeetCode
    const response = await axios.post(LEETCODE_GRAPHQL_URL, 
      { query, variables },
      { 
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `LEETCODE_SESSION=${sessionKey}`,
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://leetcode.com'
        } 
      }
    );

    // Return the data from LeetCode
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request to LeetCode:', error);
    res.status(500).json({ 
      message: 'Failed to proxy request to LeetCode',
      error: error.message
    });
  }
};

/**
 * Fetch recent submissions from LeetCode REST API
 */
export const getRecentSubmissions = async (req, res) => {
  const userId = req.user.id;
  const { offset = 0, limit = 20 } = req.query; // Allow overriding defaults via query params

  const LEETCODE_SUBMISSIONS_URL = `https://leetcode.com/api/submissions/?offset=${offset}&limit=${limit}`;

  try {
    // Get user's LeetCode session key
    const user = await User.findById(userId).select('+leetcodeSessionKey').lean();

    if (!user || !user.leetcodeSessionKey) {
      return res.status(403).json({
        message: 'LeetCode session key not found. Please add your API key.'
      });
    }

    // Decrypt the session key
    const sessionKey = decrypt(user.leetcodeSessionKey);

    // Fetch submissions from LeetCode REST API
    const response = await axios.get(LEETCODE_SUBMISSIONS_URL, {
      headers: {
        'Accept': '*/*',
        'Referer': 'https://leetcode.com/submissions/',
        'User-Agent': 'Mozilla/5.0', // Use a common user agent
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': `LEETCODE_SESSION=${sessionKey}`
      }
    });

    // Return the data from LeetCode
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recent submissions from LeetCode:', error.response ? error.response.data : error.message);
    // Check if the error is due to an invalid session or authentication issue
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
       return res.status(401).json({ message: 'Authentication failed with LeetCode. Your session might be invalid or expired.' });
    }
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch recent submissions from LeetCode',
      error: error.response?.data || error.message
    });
  }
};
