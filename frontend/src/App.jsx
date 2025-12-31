import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/dashboard/DashboardPage"; 
import CreditsPage from "./pages/CreditsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import ContestsPage from './features/contest/pages/ContestsPage';
import SubmissionsPage from './features/submissions/pages/SubmissionsPage'; // Import the actual SubmissionsPage
import Layout from "./layout/Layout";
import { AuthContext } from "./context/AuthContext";
import LoginCardSkeleton from "./components/skeletons/LoginCardSkeleton"; 
import ContestGridSkeleton from "./components/skeletons/ContestGridSkeleton";
import LayoutSkeleton from "./components/skeletons/LayoutSkeleton"; // Import the new skeleton
import { checkLeetCodeKeyStatus } from "./utils/userDiagnostic";

// Removed placeholder SubmissionsPage

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Check for cached authentication state on initial load
  const [wasLoggedInBefore, setWasLoggedInBefore] = useState(() => {
    try {
      return localStorage.getItem("wasLoggedIn") === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error("VITE_BACKEND_URL is missing in .env");
      setLoading(false);
      return;
    }
 
    console.log('Checking auth status with backend:', backendUrl); 
 
    fetch(`${backendUrl}/auth/status`, { credentials: "include" })
      .then((res) => {
        console.log('Auth status response status:', res.status); 
        const clonedRes = res.clone();
        clonedRes.json().then(data => console.log('Auth status response data:', data)).catch(e => console.error('Error parsing auth status JSON:', e)); 
        if (!res.ok) {
          console.error('Auth status request failed with status:', res.status);
        }
        return res.json();
      })
      .then(async (data) => {
        if (data.isAuthenticated && data.user) {
          console.log('User is authenticated via backend, performing frontend key check...');
          try {
            const frontendHasKey = await checkLeetCodeKeyStatus();
            console.log(`Frontend key check result: ${frontendHasKey}`);
            setUser({ ...data.user, hasLeetCodeKey: frontendHasKey });
            // Store authentication state in localStorage
            localStorage.setItem("wasLoggedIn", "true");
          } catch (checkError) {
            console.error("Error during frontend key check:", checkError);
            setUser({ ...data.user, hasLeetCodeKey: false });
            localStorage.setItem("wasLoggedIn", "true");
          }
        } else {
          console.log('User is not authenticated according to backend response.');
          setUser(null);
          localStorage.removeItem("wasLoggedIn");
        }
        setLoading(false);
        setInitialLoad(false);
      })
      .catch((error) => {
        console.error("Error fetching auth status:", error.message, error);
        setLoading(false);
        setInitialLoad(false);
      });
  }, []);

  if (loading) {
    // For returning users, show the layout skeleton instead of login
    if (wasLoggedInBefore) {
      return <LayoutSkeleton isDarkMode={isDarkMode} />;
    }
    
    // For new users, show the login skeleton
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <LoginCardSkeleton />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}> 
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <DashboardPage /> 
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          {/* New Routes */}
          <Route
            path="/contests"
            element={
              user ? (
                <ContestsPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/submissions"
            element={
              user ? (
                <SubmissionsPage /> // Use the imported component
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;
