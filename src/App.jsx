import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
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
import DestinationDetails from './DestinationDetails';
import ManageCruises from './ManageCruises';
import ItineraryDetails from './ItineraryDetails';
import Enquiries from './Enquiries';
import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [defaultBookingCountry, setDefaultBookingCountry] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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
      });
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
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, login, logout, defaultBookingCountry, setDefaultBookingCountry, isBookingModalOpen, setIsBookingModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
};


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
  const location = useLocation();
  const {
    isAuthenticated,
    setIsLoginModalOpen,
    setIsSignupModalOpen,
    isLoginModalOpen,
    isSignupModalOpen,
    defaultBookingCountry
  } = props;
  const { isBookingModalOpen, setIsBookingModalOpen } = useContext(AuthContext);

  // Hide Navbar on customer dashboard and its subpages
  const hideNavbarRoutes = [
    '/customer-dashboard',
    '/super-admin',
    '/food-inventory-management',
    '/admin-dashboard',
    '/manage-cruises',
    '/booking-overview',
    '/passenger-management',
    '/itinerary-management',
    '/cabin-admin',
    '/enquiries' // Hide navbar for Enquiries page
  ];
  const shouldShowNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  const sectionRef = useRef(null);

  const handleScroll = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {shouldShowNavbar && (
        <Navbar
          onSignupClick={() => setIsSignupModalOpen(true)}
          onLoginClick={() => setIsLoginModalOpen(true)}
        />
      )}
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
        defaultCountry={defaultBookingCountry}
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
        <Route path="/manage-cruises" element={<ManageCruises />} />
        <Route path="/cabin-admin" element={<CabinAdminDashboard />} />
        <Route path="/passenger-management" element={<PassengerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/destination/:country" element={<DestinationDetails />} />
        <Route path="/itinerary-details" element={<ItineraryDetails />} />
        <Route path="/enquiries" element={<Enquiries />} />
      </Routes>
    </>
  );
}

const App = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [defaultBookingCountry, setDefaultBookingCountry] = useState("");

  return (
    <AuthProvider>
      <Router>
        <AppRoutes
          setIsLoginModalOpen={setIsLoginModalOpen}
          setIsSignupModalOpen={setIsSignupModalOpen}
          isLoginModalOpen={isLoginModalOpen}
          isSignupModalOpen={isSignupModalOpen}
          defaultBookingCountry={defaultBookingCountry}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
