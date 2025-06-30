import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import DestinationsPage from './DestinationsPage';
import BookingModal from './BookingModal';
import SignupModal from './SignupModal';
import Navbar from './Navbar';
import LoginModal from './LoginModal';
import CruiseShipsPage from './CruiseShipsPage';

// Authentication Context
const AuthContext = React.createContext();

function SignupRouteHandler({ isAuthenticated, setIsSignupModalOpen }) {
  const location = useLocation();
  React.useEffect(() => {
    setIsSignupModalOpen(true);
  }, [setIsSignupModalOpen]);
  if (isAuthenticated) return <Navigate to="/" />;
  return null;
}

function LoginRouteHandler({ isAuthenticated, setIsLoginModalOpen }) {
  const location = useLocation();
  React.useEffect(() => {
    setIsLoginModalOpen(true);
  }, [setIsLoginModalOpen]);
  if (isAuthenticated) return <Navigate to="/" />;
  return null;
}

function AppRoutes(props) {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    setIsLoginModalOpen,
    setIsSignupModalOpen,
    isLoginModalOpen,
    isSignupModalOpen,
    isBookingModalOpen,
    setIsBookingModalOpen
  } = props;
  return (
    <>
      <Navbar
        onSignupClick={() => setIsSignupModalOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          console.log("LoginModal close button clicked");
          setIsLoginModalOpen(false);
          if (window.location.pathname === "/login") {
            navigate("/");
          }
        }}
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
          if (window.location.pathname === "/login") {
            navigate("/signup");
          }
        }}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => {
          setIsSignupModalOpen(false);
          if (window.location.pathname === "/signup") {
            navigate("/");
          }
        }}
        openLoginModal={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
          if (window.location.pathname === "/signup") {
            navigate("/login");
          }
        }}
      />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
      <Routes>
        <Route path="/" element={<HomePage onBookingClick={() => setIsBookingModalOpen(true)} />} />
        <Route path="/cruise-ships" element={<CruiseShipsPage />} />
        <Route path="/booking" element={<Navigate to="/" replace />} />
        <Route path="/login" element={
          <LoginRouteHandler isAuthenticated={isAuthenticated} setIsLoginModalOpen={setIsLoginModalOpen} />
        } />
        <Route path="/signup" element={
          <SignupRouteHandler isAuthenticated={isAuthenticated} setIsSignupModalOpen={setIsSignupModalOpen} />
        } />
      </Routes>
    </>
  );
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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

  const handleSignup = async (formData) => {
    const response = await fetch("http://localhost/Serendip_Waves-Backend/signup.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    // handle response (success/error)
  };

  const handleLogin = async (formData) => {
    const response = await fetch("http://localhost/Serendip_Waves-Backend/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    // handle response (success/error)
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
    setShowSignupModal,
    isBookingModalOpen,
    setIsBookingModalOpen
  };

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <AppRoutes
          isAuthenticated={isAuthenticated}
          setIsLoginModalOpen={setIsLoginModalOpen}
          setIsSignupModalOpen={setIsSignupModalOpen}
          isLoginModalOpen={isLoginModalOpen}
          isSignupModalOpen={isSignupModalOpen}
          isBookingModalOpen={isBookingModalOpen}
          setIsBookingModalOpen={setIsBookingModalOpen}
        />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
export { AuthContext };
