import express from 'express';
import passport from 'passport';
import axios from 'axios'; // Import axios
import User from '../models/User.js'; // Import User model
import { decrypt } from '../utils/crypto.js'; // Import decrypt
import { ensureAuth, ensureGuest } from '../middleware/auth.js';

const router = express.Router();

import dotenv from 'dotenv';

dotenv.config();

// Get frontend URL from environment variables with fallback to localhost
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to frontend dashboard after successful login
    res.redirect(`${FRONTEND_URL}/dashboard`); // Updated from '/dashboard.html' to '/dashboard'
  }
);

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    // Redirect to frontend home page after logout
    res.redirect(FRONTEND_URL);
  });
});

// @desc    Get current user and potentially backfill LeetCode username
// @route   GET /auth/status
router.get('/status', async (req, res) => { // Make handler async
  if (req.isAuthenticated()) {
    const user = req.user; // Get user from request

    // Check if key exists but username doesn't - attempt to backfill
    // Need to fetch the full user document including the key first
    try {
      const fullUser = await User.findById(user.id).select('+leetcodeSessionKey +leetcodeUsername');

      if (fullUser && fullUser.leetcodeSessionKey && !fullUser.leetcodeUsername) {
        console.log(`User ${user.displayName} has key but no username. Attempting backfill.`);
        
        // Decrypt the key
        let decryptedKey;
        try {
          decryptedKey = decrypt(fullUser.leetcodeSessionKey);
        } catch (decryptError) {
          console.error(`Failed to decrypt key for user ${user.displayName}:`, decryptError);
          // Proceed without backfill if decryption fails
          decryptedKey = null; 
        }

        if (decryptedKey) {
          // Asynchronously attempt to fetch and update username - don't block response
          (async () => {
            try {
              const graphqlQuery = { query: `query userStatus { userStatus { username isSignedIn } }` };
              const response = await axios.post(
                'https://leetcode.com/graphql/',
                graphqlQuery,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://leetcode.com/',
                    'Origin': 'https://leetcode.com',
                    'Cookie': `LEETCODE_SESSION=${decryptedKey}`
                  },
                  timeout: 5000 // Add a timeout to prevent hanging
                }
              );

              const userData = response.data?.data?.userStatus;
              if (userData && userData.isSignedIn && userData.username) {
                await User.findByIdAndUpdate(user.id, { leetcodeUsername: userData.username });
                console.log(`Successfully backfilled LeetCode username '${userData.username}' for user ${user.displayName}`);
              } else {
                 console.warn(`Backfill failed for user ${user.displayName}: LeetCode API did not return signed-in status or username.`);
                 // Optionally: Consider clearing the invalid key here if desired
                 // await User.findByIdAndUpdate(user.id, { $unset: { leetcodeSessionKey: "" } });
              }
            } catch (fetchError) {
              console.error(`Error during username backfill fetch for user ${user.displayName}:`, fetchError.response?.data || fetchError.message);
              // Optionally: Consider clearing the invalid key here if desired
              // await User.findByIdAndUpdate(user.id, { $unset: { leetcodeSessionKey: "" } });
            }
          })(); // Immediately invoke the async function
        }
      }
      
      // Respond immediately with current user data (username might be null initially)
      res.json({
        isAuthenticated: true,
        user: {
          id: user.id,
          googleId: user.googleId,
          displayName: user.displayName,
          email: user.email,
          hasLeetCodeKey: !!fullUser?.leetcodeSessionKey, // Use fetched user data
          leetcodeUsername: fullUser?.leetcodeUsername || null // Use fetched user data
        }
      });

    } catch (dbError) {
        console.error("Error fetching full user data in /auth/status:", dbError);
        // Fallback: Respond with basic info if DB fetch fails
         res.json({
            isAuthenticated: true,
            user: {
              id: user.id,
              googleId: user.googleId,
              displayName: user.displayName,
              email: user.email,
              hasLeetCodeKey: false, // Assume false if we can't check
              leetcodeUsername: null
            }
         });
    }
  } else {
    res.json({ isAuthenticated: false });
  }
});

export default router;
