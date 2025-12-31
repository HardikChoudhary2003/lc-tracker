import express from 'express';
import axios from 'axios'; // Import axios
import { ensureAuth } from '../middleware/auth.js'; // Middleware to protect routes
import User from '../models/User.js';
import { encrypt, decrypt } from '../utils/crypto.js'; // Encryption utilities

const router = express.Router();

// =============================================================================
// == PROFILE ROUTES                                                          ==
// =============================================================================

// GET /profile - Get current logged-in user's profile info
// Note: This route will be mounted under /api/profile in server.js
router.get('/', ensureAuth, (req, res) => {
  res.json({
    id: req.user.id,
    googleId: req.user.googleId,
    displayName: req.user.displayName,
    email: req.user.email,
    // Check if the user object (populated by ensureAuth) has the key,
    // not directly checking the potentially unselected field from DB
    hasLeetCodeKey: !!req.user.leetcodeSessionKey
  });
});

// POST /profile/leetcode-key - Save encrypted session key and fetch username
router.post('/leetcode-key', ensureAuth, async (req, res) => {
  const { leetcodeSessionKey } = req.body;
  const trimmedKey = leetcodeSessionKey?.trim(); // Use optional chaining and trim

  if (!trimmedKey) {
    return res.status(400).json({ message: 'LeetCode session key is required.' });
  }

  let leetcodeUsername = null;
  let leetcodeRealName = null;
  let leetcodeAvatar = null;

  // 1. Attempt to fetch LeetCode username using the provided key
  try {
    const graphqlQuery = {
      query: `query userStatus { 
                userStatus { 
                  username 
                  isSignedIn 
                  realName 
                  avatar 
                  isPremium 
                } 
              }`
    };
    const response = await axios.post(
      'https://leetcode.com/graphql/',
      graphqlQuery,
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com/',
          'Origin': 'https://leetcode.com',
          'Cookie': `LEETCODE_SESSION=${trimmedKey}` // Use the provided key
        }
      }
    );

    const userData = response.data?.data?.userStatus;

    if (userData && userData.isSignedIn) {
      leetcodeUsername = userData.username;
      leetcodeRealName = userData.realName; // Optionally store real name
      leetcodeAvatar = userData.avatar;     // Optionally store avatar
      console.log(`Successfully fetched LeetCode username: ${leetcodeUsername} for user: ${req.user.displayName}`);
    } else {
      // Key might be invalid or expired if not signed in
      console.warn(`LeetCode session key for user ${req.user.displayName} did not result in a signed-in status.`);
      // Decide if this should be an error or just proceed without username
      // For now, let's treat it as potentially invalid key
      return res.status(401).json({ message: 'Invalid or expired LeetCode session key.' });
    }

  } catch (error) {
    console.error(`Error fetching LeetCode username for user ${req.user.displayName}:`, error.response?.data || error.message);
    // Handle potential errors like network issues or LeetCode API changes
    return res.status(502).json({ message: 'Failed to verify LeetCode session key. Please check the key and try again.' });
  }

  // 2. If username fetch was successful, encrypt key and update user in DB
  try {
    const encryptedKey = encrypt(trimmedKey);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        leetcodeSessionKey: encryptedKey,
        leetcodeUsername: leetcodeUsername, // Save the fetched username
        // Optionally save realName and avatar if needed
        // leetcodeRealName: leetcodeRealName, 
        // leetcodeAvatar: leetcodeAvatar,
      },
      { 
        new: true, 
        // Use a single projection that includes only what we need
        // Rather than mixing inclusion and exclusion
        select: '+leetcodeSessionKey +leetcodeUsername displayName googleId email id' 
      }
    );

    if (!updatedUser) {
      // This case should be rare if ensureAuth works correctly
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log(`LeetCode key and username updated successfully for user: ${req.user.displayName}`);
    
    // Return the relevant parts of the updated user profile
    res.json({
      message: 'LeetCode session key and username updated successfully.',
      user: { // Send back updated user info for frontend context update
        id: updatedUser.id,
        googleId: updatedUser.googleId,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        hasLeetCodeKey: !!updatedUser.leetcodeSessionKey,
        leetcodeUsername: updatedUser.leetcodeUsername // Include username
      }
    });

  } catch (error) {
    console.error(`Error updating user record for ${req.user.displayName}:`, error);
    res.status(500).json({ message: 'Failed to save LeetCode details to profile.' });
  }
});

export default router;
