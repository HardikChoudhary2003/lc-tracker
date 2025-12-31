import React, { useState } from 'react';
import { UserIcon } from '../../common/components/icons/Icons';
import LeetcodeKeyForm from '../../components/LeetcodeKeyForm';
import useDropdown from '../../hooks/useDropdown';
import useApiKeySubmission from '../../hooks/useApiKeySubmission';

const UserMenu = ({ user, onLogout, onUserUpdate }) => {
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const { isOpen, toggle, close, dropdownRef } = useDropdown();
  
  const handleApiKeySuccess = () => {
    setShowApiKeyForm(false);
  };
  
  const { isSubmitting, error, submitApiKey } = useApiKeySubmission(
    onUserUpdate,
    handleApiKeySuccess
  );

  const toggleApiKeyForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowApiKeyForm(!showApiKeyForm);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    close();
    setShowApiKeyForm(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggle}
        // Softer focus ring
        className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 dark:focus:ring-offset-gray-800"
        aria-label="User menu"
        aria-haspopup="true"
      >
        <UserIcon />
      </button>

      {isOpen && (
        // Use card background, softer ring/shadow
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-md py-1 bg-white dark:bg-gray-800 ring-1 ring-black/5 dark:ring-gray-700 focus:outline-none z-20 top-full">
          {/* Display User Info */}
          {/* Display User Info - Removed LeetCode username */}
          <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
            <div>Signed in as</div>
            <div className="font-medium text-gray-800 dark:text-gray-100 truncate mt-1">{user.displayName}</div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700"></div>

          {/* Softer hover */}
          <a
            href="#"
            onClick={toggleApiKeyForm}
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            {showApiKeyForm ? 'Hide API Key Form' : 'Add/Update API Key'}
          </a>

          {showApiKeyForm && (
            // Use subtle border
            <div className="p-3 border-t border-gray-100 dark:border-gray-700">
              <LeetcodeKeyForm
                onSubmit={submitApiKey}
                keySubmitting={isSubmitting}
                error={error}
              />
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-gray-700"></div>

          {/* Softer hover */}
          <a
            href="#"
            onClick={handleLogoutClick}
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            Logout
          </a>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
