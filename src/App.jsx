import React, { useState, useEffect, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import HomePage from './HomePage';
import DestinationsPage from './DestinationsPage';
import BookingModal from './BookingModal';
import SignupModal from './SignupModal';
import Navbar from './Navbar';
import LoginModal from './LoginModal';
import CruiseShipsPage from './CruiseShipsPage';
import BookingOverviewPage from './BookingOverviewPage';
import SuperAdminDashboard from './SuperAdminDashboard';
import CustomerDashboard from './CustomerDashboard';
import FoodInventoryDashboard from './FoodInventoryDashboard';
import ItineraryDashboard from './ItineraryDashboard';
import CabinAdminDashboard from './CabinAdminDashboard';
import PassengerDashboard from './PassengerDashboard';
import AdminDashboard from './AdminDashboard';

export const AuthContext = React.createContext();

function SignupRouteHandler({ isAuthenticated, setIsSignupModalOpen }) {
  React.useEffect(() => {
    setIsSignupModalOpen(true);
  }, [setIsSignupModalOpen]);
  if (isAuthenticated) return <Navigate to="/" />;
  return null;
}

function LoginRouteHandler({ isAuthenticated, setIsLoginModalOpen }) {
  React.useEffect(() => {
    setIsLoginModalOpen(true);
  }, [setIsLoginModalOpen]);
  if (isAuthenticated) return <Navigate to="/" />;
  return null;
}

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) return <Navigate to="/" />;
  return children;
};

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
          setIsLoginModalOpen(false);
          if (window.location.pathname === "/login") navigate("/");
        }}
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
          if (window.location.pathname === "/login") navigate("/signup");
        }}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => {
          setIsSignupModalOpen(false);
          if (window.location.pathname === "/signup") navigate("/");
        }}
        openLoginModal={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
          if (window.location.pathname === "/signup") navigate("/login");
        }}
      />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
      <Routes>
        <Route path="/" element={<HomePage onBookingClick={() => setIsBookingModalOpen(true)} />} />
        <Route path="/cruise-ships" element={<CruiseShipsPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/booking" element={<Navigate to="/" replace />} />
        <Route path="/booking-overview" element={<BookingOverviewPage />} />
        <Route path="/login" element={<LoginRouteHandler isAuthenticated={isAuthenticated} setIsLoginModalOpen={setIsLoginModalOpen} />} />
        <Route path="/signup" element={<SignupRouteHandler isAuthenticated={isAuthenticated} setIsSignupModalOpen={setIsSignupModalOpen} />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/food-inventory-management" element={<FoodInventoryDashboard />} />
        <Route path="/itinerary-management" element={<ItineraryDashboard />} />
        <Route path="/cabin-admin" element={<CabinAdminDashboard />} />
        <Route path="/passenger-management" element={<PassengerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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
    setIsLoginModalOpen(false);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  };

  const authValue = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isSignupModalOpen,
    setIsSignupModalOpen,
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
