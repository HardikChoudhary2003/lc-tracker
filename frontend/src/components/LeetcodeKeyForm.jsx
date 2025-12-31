import React from 'react';

const LeetcodeKeyForm = ({
  leetcodeKey,
  setLeetcodeKey,
  onSubmit,
  keySubmitting,
  error,
  // Add props for controlled input if needed, or manage state internally
  initialValue = '', // Allow passing an initial value if available
}) => {
  // Internal state for the key if not controlled from parent
  const [internalKey, setInternalKey] = React.useState(initialValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await onSubmit(internalKey);
      if (success) {
        console.log('API key saved successfully');
      } else {
        console.error('Failed to save API key');
      }
    } catch (error) {
      console.error('Error saving key:', error.message);
    }
  };

  return (
    // Removed outer container, title, and description
    // Reduced padding/margins for compactness
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor="leetcode-key-dropdown" className="sr-only">LeetCode Session Key</label>
      <input
        id="leetcode-key-dropdown"
        type="password"
        value={internalKey}
        onChange={(e) => setInternalKey(e.target.value)}
        placeholder="LeetCode Session Key"
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs border-gray-300 rounded-md p-1.5" // Smaller text and padding
        required
      />
      <button
        type="submit"
        disabled={keySubmitting}
        className="w-full inline-flex justify-center items-center px-2.5 py-1.5 text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50" // Smaller text and padding, full width
      >
        {keySubmitting ? 'Saving...' : 'Save Key'}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </form>
  );
};
export default LeetcodeKeyForm;
