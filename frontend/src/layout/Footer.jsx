import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto py-4 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <nav className="flex justify-center items-center">
          <ul className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link 
                to="/credits" 
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Credits
              </Link>
            </li>
            <li>
              <Link 
                to="/privacy" // Corrected path to match the route
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            {/* Add Disclaimer Link */}
            <li>
              <Link 
                to="/disclaimer" 
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Disclaimer
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
