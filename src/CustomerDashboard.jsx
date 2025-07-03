import React, { useEffect, useState, useContext } from 'react';
import './CustomerDashboard.css';
import { AuthContext } from './App';
import avatarPlaceholder from './assets/logo2.png'; // Use logo2.png as a placeholder avatar
import { FaCrown, FaShip } from 'react-icons/fa'; // For luxury icons (if react-icons is installed)

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const { setIsBookingModalOpen } = useContext(AuthContext);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="customer-dashboard-bg luxury-bg">
      <div className="customer-dashboard-container luxury-glass">
        {/* Profile Section */}
        <div className="customer-dashboard-profile luxury-profile">
          <img
            src={user?.profileImage || avatarPlaceholder}
            alt="Profile"
            className="customer-dashboard-avatar luxury-avatar"
          />
          <div className="luxury-profile-info">
            <h1 className="customer-dashboard-welcome-title luxury-title">
              <FaCrown className="luxury-crown" />
              Welcome <span className="customer-dashboard-fullname luxury-highlight">{user?.fullName || user?.name}</span>
            </h1>
            <p className="customer-dashboard-welcome-sub luxury-sub">We're glad to have you onboard. Start your journey with us!</p>
          </div>
        </div>
        {/* Booking Section */}
        <div className="customer-dashboard-booking-card luxury-card">
          <h2 className="customer-dashboard-section-title luxury-section-title">
            <FaShip className="luxury-ship" /> My Booking
          </h2>
          <div className="customer-dashboard-booking-placeholder luxury-booking-placeholder">
            You have no bookings yet.<br />
            <button className="customer-dashboard-book-btn luxury-btn" onClick={() => setIsBookingModalOpen(true)}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard; 