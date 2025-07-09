import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./App";
import { FaBars, FaMinus, FaUser, FaEnvelope, FaPhone, FaCalendar, FaVenusMars, FaPassport } from "react-icons/fa";
import BookingModal from "./BookingModal";
import "./CustomerDashboard.css";
import { Modal, Button } from "react-bootstrap";

const CustomerDashboard = () => {
  const { currentUser, logout, setIsBookingModalOpen } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("my-booking");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Handle logout with navigation
  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/');
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  const handleConfirmLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    setShowLogoutModal(false);
    navigate("/");
  };
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Debug: Log user data to see what's available
  console.log('Current User Data:', currentUser);
  console.log('User Full Name:', currentUser?.full_name);
  console.log('User Email:', currentUser?.email);
  console.log('All User Fields:', Object.keys(currentUser || {}));

  // Fetch user bookings from database
  const fetchBookings = async () => {
    if (!currentUser?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost/Project-I/backend/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_bookings',
          user_id: currentUser.id
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
      } else {
        console.error('Failed to fetch bookings:', data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser?.id]);

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <nav className="top-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <button 
              className="navbar-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars />
            </button>
            <div className="navbar-brand">
              <img src="/logo.png" alt="Serendip Waves" className="navbar-logo" />
              <h2 className="navbar-title">Serendip Waves</h2>
            </div>
          </div>
          
          <div className="navbar-actions">
            <button 
              onClick={() => setShowBookingModal(true)}
              className="navbar-booking-btn"
            >
              <i className="fas fa-plus"></i>
              New Booking
            </button>
            
            <div className="profile-dropdown">
              <button 
                className="profile-button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <FaUser />
                {currentUser?.full_name || currentUser?.fullName || currentUser?.name || "User"}
              </button>
              
              {profileDropdownOpen && (
                <div className="profile-dropdown-content">
                  <div className="profile-header">
                    <h3>
                      {currentUser?.full_name || currentUser?.fullName || currentUser?.name || "User"}
                    </h3>
                  </div>
                  
                  <div className="profile-info">
                    <div className="profile-info-item">
                      <FaUser />
                      <span className="label">Full Name:</span>
                      <span className="value">
                        {currentUser?.full_name || currentUser?.fullName || currentUser?.name || "Not provided"}
                      </span>
                    </div>
                    
                    <div className="profile-info-item">
                      <FaEnvelope />
                      <span className="label">Email:</span>
                      <span className="value">
                        {currentUser?.email || "Not provided"}
                      </span>
                    </div>
                    
                    <div className="profile-info-item">
                      <FaCalendar />
                      <span className="label">Date of Birth:</span>
                      <span className="value">
                        {currentUser?.date_of_birth || currentUser?.dob || currentUser?.dateOfBirth ? 
                          new Date(currentUser.date_of_birth || currentUser.dob || currentUser.dateOfBirth).toLocaleDateString() : 
                          "Not provided"}
                      </span>
                    </div>
                    
                    <div className="profile-info-item">
                      <FaVenusMars />
                      <span className="label">Gender:</span>
                      <span className="value">
                        {currentUser?.gender || "Not provided"}
                      </span>
                    </div>
                    
                    {currentUser?.passport_number || currentUser?.passport || currentUser?.passportNumber && (
                      <div className="profile-info-item">
                        <FaPassport />
                        <span className="label">Passport:</span>
                        <span className="value">
                          {currentUser?.passport_number || currentUser?.passport || currentUser?.passportNumber || "Not provided"}
                        </span>
                      </div>
                    )}
                    
                    {currentUser?.created_at && (
                      <div className="profile-info-item">
                        <FaCalendar />
                        <span className="label">Member Since:</span>
                        <span className="value">
                          {new Date(currentUser.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {currentUser?.phone_number || currentUser?.phone || currentUser?.phoneNumber ? (
                      <div className="profile-info-item">
                        <FaPhone />
                        <span className="label">Phone:</span>
                        <span className="value">
                          {currentUser?.phone_number || currentUser?.phone || currentUser?.phoneNumber}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  
                  <div className="profile-actions">
                    <button
                      onClick={handleLogoutClick}
                      className="logout-button"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Sidebar */}
        <div className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
          <ul className="sidebar-nav">
            <li>
              <a 
                href="#dashboard" 
                className={activeSection === "dashboard" ? "active" : ""}
                onClick={() => setActiveSection("dashboard")}
              >
                <i className="fas fa-tachometer-alt"></i>
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="#my-booking" 
                className={activeSection === "my-booking" ? "active" : ""}
                onClick={() => setActiveSection("my-booking")}
              >
                <i className="fas fa-calendar-check"></i>
                My Bookings
              </a>
            </li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Header */}
          <header className="dashboard-header">
            <div className="header-left">
              <h1>Welcome back, {currentUser?.full_name || 'Customer'}!</h1>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <main>
            {/* Welcome Message */}
            <div className="welcome-section">
              <p style={{ fontWeight: 500, fontSize: '1.3rem', marginBottom: 0 }}>
                "The sea, once it casts its spell, holds one in its net of wonder forever."
              </p>
              <span className="quote-author">— Jacques Cousteau</span>
              <p className="description">
                Ready to embark on your next adventure? Explore our amazing cruise destinations and create unforgettable memories.
              </p>
            </div>

            {activeSection === "my-booking" && (
              <div>
                <h2 className="section-title">My Booking History</h2>
                {loading ? (
                  <p>Loading bookings...</p>
                ) : bookings.length === 0 ? (
                  <p>No bookings found. Start your journey by making a booking!</p>
                ) : (
                  <table className="booking-table">
                    <thead>
                      <tr>
                        <th>Cruise</th>
                        <th>Departure Date</th>
                        <th>Cabin Type</th>
                        <th>Guests</th>
                        <th>Total Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id}>
                          <td>{b.cruise_title}</td>
                          <td>{new Date(b.departure_date).toLocaleDateString()}</td>
                          <td>{b.cabin_type}</td>
                          <td>{b.total_guests}</td>
                          <td>${parseFloat(b.total_price).toLocaleString()}</td>
                          <td>
                            <span className={`booking-status status-${b.booking_status}`}>
                              {b.booking_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
      {showBookingModal && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          currentUser={currentUser}
          onBookingCreated={fetchBookings}
        />
      )}
      <Modal show={showLogoutModal} onHide={handleCancelLogout} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to logout?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelLogout}>
            No
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Yes, Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerDashboard; 