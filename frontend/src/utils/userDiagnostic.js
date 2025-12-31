import axios from 'axios';

/**
 * Check if the user has a valid LeetCode session key
 * @returns {Promise<boolean>} - Whether the user has a valid key
 */
export const checkLeetCodeKeyStatus = async () => {
  try {
    const response = await axios.get('/api/diagnostic/key-status');
    return !!response.data.hasLeetcodeKey;
  } catch (error) {
    console.error('Failed to check LeetCode key status:', error);
    return false;
  }
};

/**
 * Run diagnostics on API errors
 * @param {string} slug - Problem slug that's having issues
 * @returns {Promise<Object>} - Diagnostic information
 */
export const runApiDiagnostics = async (slug) => {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      slug,
      hasKey: false,
      testApiCall: false,
      errors: []
    };
    
    // Check key status
    try {
      const keyResponse = await axios.get('/api/diagnostic/key-status');
      diagnostics.hasKey = keyResponse.data.hasLeetcodeKey;
    } catch (error) {
      diagnostics.errors.push(`Key check failed: ${error.message}`);
    }
    
    // Try general API test
    try {
      const testResponse = await axios.get('/api/test');
      diagnostics.testApiCall = testResponse.data?.message === 'API is working correctly';
    } catch (error) {
      diagnostics.errors.push(`API test failed: ${error.message}`);
    }
    
    // console.log('API diagnostics:', diagnostics); // Commented out non-essential detailed log
    return diagnostics;
  } catch (error) {
    console.error('Diagnostics failed:', error);
    return { error: error.message };
  }
};
