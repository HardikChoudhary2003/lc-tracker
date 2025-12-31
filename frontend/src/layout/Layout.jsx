import React from 'react';
import Header from './header/Header'; // Import Header
import Footer from './Footer';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get user

// Layout now needs props for Header: isDarkMode, toggleDarkMode
const Layout = ({ children, isDarkMode, toggleDarkMode }) => {
  const { user, setUser } = useAuth(); // Get user state from context

  // Define handlers needed by Header/UserMenu (can be simplified if not needed directly here)
  const handleLogout = () => {
    // Redirect or call API endpoint for logout
    window.location.href = import.meta.env.VITE_BACKEND_URL + '/auth/logout';
  };

  const handleUserUpdate = (updatedUser) => {
    // This might be better handled within DashboardPage or context if complex
    setUser(updatedUser); 
    // Maybe show a status message?
  };

  return (
    // Add background color classes here for consistent theme application
    // Add transition-colors and duration-300 for smooth theme changes
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300"> 
      {/* Render Header only if user is logged in (or adjust logic if needed) */}
      {user && (
        <Header
          user={user}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onUserUpdate={handleUserUpdate} // Pass the handler down
        />
      )}
      {/* Add padding top if header is fixed/sticky, otherwise remove */}
      <main className="flex-grow container mx-auto px-4 py-6"> 
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
