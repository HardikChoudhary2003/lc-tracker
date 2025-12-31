import User from '../models/User.js';
import { decrypt } from '../utils/crypto.js';
import axios from 'axios';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

/**
 * Check if a problem is solved by the user - Direct LeetCode API implementation (no MongoDB)
 */
export const checkProblemStatus = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user.id;
  const forceRefresh = req.query.forceRefresh === 'true';

  console.log(`Problem status check: ${slug} (Force refresh: ${forceRefresh})`);

  try {
    // ALWAYS bypass MongoDB cache and go straight to LeetCode API
    console.log(`Checking problem ${slug} directly from LeetCode API for user ${userId}`);
    
    // Step 1: Get the user's LeetCode session key
    const user = await User.findById(userId).select('+leetcodeSessionKey').lean();
    
    if (!user || !user.leetcodeSessionKey) {
      return res.status(403).json({ 
        message: 'LeetCode session key not found. Please add your API key.'
      });
    }

    // Step 2: Decrypt the session key
    const sessionKey = decrypt(user.leetcodeSessionKey);
    
    // Print full decrypted session key for testing purposes
    console.log('==============================================================');
    console.log('!!! TESTING MODE - FULL SESSION KEY EXPOSED - NOT FOR PRODUCTION !!!');
    console.log(`User ID: ${userId}`);
    console.log(`Complete unmasked session key: ${sessionKey}`);
    console.log(`Key length: ${sessionKey.length} characters`);
    console.log('==============================================================');
    
    
    
    // Step 3: Query LeetCode GraphQL API
    const graphqlQuery = {
      query: `
        query isProblemSolved($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            status
          }
        }
      `,
      variables: { titleSlug: slug }
    };
    
    // Special logging for problematic slugs
    const knownProblematicSlugs = [
      'find-the-encrypted-string',
      'alternating-groups-ii',
      'minimum-number-of-valid-strings-to-form-target-i',
      'maximum-number-of-moves-to-kill-all-pawns',
      'clear-digits'
    ];
    
    if (knownProblematicSlugs.includes(slug)) {
      console.log(`\n!!! DETAILED DEBUGGING FOR PROBLEMATIC SLUG: ${slug} !!!`);
      console.log('GraphQL Query:', JSON.stringify(graphqlQuery, null, 2));
      console.log('Headers:', JSON.stringify({
        'Content-Type': 'application/json',
        'Cookie': `LEETCODE_SESSION=${sessionKey.substring(0, 5)}...${sessionKey.substring(sessionKey.length-5)}`,
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://leetcode.com'
      }, null, 2));
      
      // Check if session key is valid
      if (sessionKey.length < 20) {
        console.log('WARNING: Session key appears too short - likely invalid');
      }
      
      // Let's try checking if the session key works for basic LeetCode API
      try {
        const testResponse = await axios.post(
          LEETCODE_GRAPHQL_URL,
          {
            query: `query { userStatus { username } }`
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Cookie': `LEETCODE_SESSION=${sessionKey}`,
              'User-Agent': 'Mozilla/5.0',
              'Referer': 'https://leetcode.com'
            }
          }
        );
        console.log('User status API test response:', testResponse.data);
      } catch (testError) {
        console.log('User status API test FAILED:', testError.message);
        if (testError.response) {
          console.log('Response status:', testError.response.status);
          console.log('Response data:', testError.response.data);
        }
      }
      console.log('!!! END DETAILED DEBUGGING !!!\n');
    }
    
    console.log(`Sending LeetCode API request for ${slug}`);
    const response = await axios.post(
      LEETCODE_GRAPHQL_URL,
      graphqlQuery,
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `LEETCODE_SESSION=${sessionKey}`,
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://leetcode.com'
        }
      }
    );
    
    // Step 4: Extract solved status
    const isSolved = response.data?.data?.question?.status === 'ac';
    console.log(`LeetCode API result for ${slug}: ${isSolved ? 'Solved' : 'Not Solved'}`);
    
    // Step 5: Return the result (no MongoDB caching)
    console.log(`Returning direct API result for ${slug}: ${isSolved}`);
    res.json({ 
      slug, 
      isSolved, 
      source: 'leetcode-api',  // Add source for debugging
      timestamp: Date.now()    // Add timestamp for cache validation
    });
  } catch (error) {
    console.error(`Error checking problem status for ${slug}:`, error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
