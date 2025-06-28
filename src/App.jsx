import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import DestinationsPage from './DestinationsPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import UserDashboard from './UserDashboard';

// Authentication Context
const AuthContext = React.createContext();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedAuth = localStorage.getItem('isAuthenticated');
    
    if (savedUser && savedAuth === 'true') {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setShowLoginModal(false);
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  };

  const signup = (userData) => {
    // Store user data in localStorage (simulating database)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = { ...userData, id: Date.now() };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    // Auto-login after signup
    const { password, confirmPassword, ...userWithoutPassword } = newUser;
    login(userWithoutPassword);
    setShowSignupModal(false);
  };

  const authValue = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    signup,
    showLoginModal,
    setShowLoginModal,
    showSignupModal,
    setShowSignupModal
  };

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/login" element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <LoginPage />
          } />
          <Route path="/signup" element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <SignupPage />
          } />
          <Route path="/dashboard" element={
            isAuthenticated ? 
              <UserDashboard /> : 
              <Navigate to="/" />
          } />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
export { AuthContext };
