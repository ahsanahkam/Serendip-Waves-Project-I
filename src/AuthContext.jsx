import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [defaultBookingCountry, setDefaultBookingCountry] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // On mount, check session with backend
  useEffect(() => {
    fetch('http://localhost/Project-I/backend/login.php?action=session_user', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setCurrentUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    // Optionally, call backend to destroy session
    fetch('http://localhost/Project-I/backend/logout.php', { method: 'POST', credentials: 'include' });
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      currentUser, 
      setCurrentUser, 
      login, 
      logout, 
      defaultBookingCountry, 
      setDefaultBookingCountry, 
      isBookingModalOpen, 
      setIsBookingModalOpen, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
