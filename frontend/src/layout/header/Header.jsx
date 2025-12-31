import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import NavLink
import DarkModeToggle from './DarkModeToggle';
import UserMenu from './UserMenu';

const Header = ({ user, onLogout, isDarkMode, toggleDarkMode, onUserUpdate }) => {
  // Define active and inactive styles for NavLink
  const activeClassName = "inline-block p-4 text-indigo-600 border-b-2 border-indigo-600 rounded-t-lg active dark:text-indigo-400 dark:border-indigo-400";
  const inactiveClassName = "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      {/* Top bar: Title, Dark Mode, User Menu */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              LeetCode Tracker
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <UserMenu
              user={user}
              onLogout={onLogout}
              onUserUpdate={onUserUpdate}
            />
          </div>
        </div>
      </nav>

      {/* Navigation Tabs */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li className="mr-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="mr-2">
              <NavLink
                to="/contests" // Assuming this route exists or will be created
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                Upcoming Contests
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/submissions" // Assuming this route exists or will be created
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                Recent Submissions
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
