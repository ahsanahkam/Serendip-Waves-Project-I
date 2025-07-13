import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./App";
import { FaBars, FaMinus, FaUser, FaEnvelope, FaPhone, FaCalendar, FaVenusMars, FaPassport } from "react-icons/fa";
import BookingModal from "./BookingModal";
import Navbar from "./Navbar";
import "./CustomerDashboard.css";
import { Modal, Button } from "react-bootstrap";

const CustomerDashboard = () => {
  const { currentUser, logout, setIsBookingModalOpen } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("my-booking");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const user = currentUser || JSON.parse(localStorage.getItem("currentUser"));



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
      {/* Home Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
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
            <li>
              <a 
                href="#my-profile" 
                className={activeSection === "my-profile" ? "active" : ""}
                onClick={() => setActiveSection("my-profile")}
              >
                <i className="fas fa-user"></i>
                My Profile
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

            {activeSection === "my-profile" && (
              <div>
                <div className="profile-section-header">
                  <h2 className="section-title">My Profile</h2>
                  <button 
                    className="edit-profile-btn"
                    onClick={() => setActiveSection("edit-profile")}
                  >
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                </div>
                
                <div className="profile-info-card">
                  <div className="profile-info-item">
                    <div className="info-label">
                      <i className="fas fa-user"></i>
                      Full Name
                    </div>
                    <div className="info-value">
                      {currentUser?.full_name || currentUser?.name || "Not provided"}
                    </div>
                  </div>
                  
                  <div className="profile-info-item">
                    <div className="info-label">
                      <i className="fas fa-envelope"></i>
                      Email
                    </div>
                    <div className="info-value">
                      {currentUser?.email || "Not provided"}
                    </div>
                  </div>
                  
                  <div className="profile-info-item">
                    <div className="info-label">
                      <i className="fas fa-calendar"></i>
                      Date of Birth
                    </div>
                    <div className="info-value">
                      {currentUser?.date_of_birth || currentUser?.dob ? 
                        new Date(currentUser.date_of_birth || currentUser.dob).toLocaleDateString() : 
                        "Not provided"}
                    </div>
                  </div>
                  
                  <div className="profile-info-item">
                    <div className="info-label">
                      <i className="fas fa-venus-mars"></i>
                      Gender
                    </div>
                    <div className="info-value">
                      {currentUser?.gender || "Not provided"}
                    </div>
                  </div>
                  
                  {currentUser?.phone_number || currentUser?.phone ? (
                    <div className="profile-info-item">
                      <div className="info-label">
                        <i className="fas fa-phone"></i>
                        Phone Number
                      </div>
                      <div className="info-value">
                        {currentUser?.phone_number || currentUser?.phone}
                      </div>
                    </div>
                  ) : null}
                  
                  {currentUser?.passport_number || currentUser?.passport ? (
                    <div className="profile-info-item">
                      <div className="info-label">
                        <i className="fas fa-passport"></i>
                        Passport Number
                      </div>
                      <div className="info-value">
                        {currentUser?.passport_number || currentUser?.passport}
                      </div>
                    </div>
                  ) : null}
                  
                  {currentUser?.created_at && (
                    <div className="profile-info-item">
                      <div className="info-label">
                        <i className="fas fa-calendar-alt"></i>
                        Member Since
                      </div>
                      <div className="info-value">
                        {new Date(currentUser.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

    </div>
  );
};

export default CustomerDashboard; 