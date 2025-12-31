import { useState } from 'react';
import axios from 'axios';

/**
 * Custom hook to handle API key submission logic
 * @param {Function} onUpdateUser - Callback function to update user data
 * @param {Function} onSuccess - Optional callback on successful submission
 * @returns {Object} submission state and handler function
 */
const useApiKeySubmission = (onUpdateUser, onSuccess) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitApiKey = async (key) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Use axios instead of fetch to ensure baseURL and credentials are used
      const response = await axios.post('/api/profile/leetcode-key', {
        leetcodeSessionKey: key
      });
      
      // Use the user data directly from the POST response
      const updatedUserData = response.data?.user; 
      
      if (updatedUserData && typeof onUpdateUser === 'function') {
        // Notify parent component about the updated user data
        onUpdateUser(updatedUserData); 
      } else if (typeof onUpdateUser === 'function') {
        // Fallback or error handling if user data isn't in response
        console.warn("POST response did not contain updated user data. Refetching might be needed.");
        // Optionally, could still make the GET request here as a fallback
      }
      
      // Call success callback if provided
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save API key. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false); // Fix: Was setIsLoading, should be setIsSubmitting
    }
  };

  return {
    isSubmitting,
    error,
    submitApiKey,
    setError
  };
};

export default useApiKeySubmission;
