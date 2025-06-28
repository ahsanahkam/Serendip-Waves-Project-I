import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './App';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    passportNumber: '',
    nicNumber: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Load user profile data from currentUser
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        gender: currentUser.gender || '',
        passportNumber: currentUser.passportNumber || '',
        nicNumber: currentUser.nicNumber || ''
      });
    }
  }, [currentUser]);

  // Load user bookings from localStorage
  useEffect(() => {
    const userBookings = JSON.parse(localStorage.getItem(`bookings_${currentUser?.id}`) || '[]');
    setBookings(userBookings);
  }, [currentUser?.id]);

  // Sample bookings data for demo
  useEffect(() => {
    if (bookings.length === 0 && currentUser?.id) {
      const sampleBookings = [
        {
          id: 1,
          cruiseName: "Caribbean Paradise",
          shipName: "Ocean Explorer",
          departureDate: "2024-06-15",
          returnDate: "2024-06-22",
          cabinType: "Ocean View Balcony",
          passengers: 2,
          totalPrice: 2499,
          status: "confirmed",
          bookingDate: "2024-01-15",
          bookingNumber: "SW-2024-001"
        },
        {
          id: 2,
          cruiseName: "Mediterranean Dream",
          shipName: "Mediterranean Star",
          departureDate: "2024-08-10",
          returnDate: "2024-08-20",
          cabinType: "Interior Stateroom",
          passengers: 1,
          totalPrice: 3299,
          status: "confirmed",
          bookingDate: "2024-02-20",
          bookingNumber: "SW-2024-002"
        }
      ];
      localStorage.setItem(`bookings_${currentUser.id}`, JSON.stringify(sampleBookings));
      setBookings(sampleBookings);
    }
  }, [bookings.length, currentUser?.id]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Update user data in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return { ...user, ...profileData };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update current user in localStorage
      const updatedCurrentUser = { ...currentUser, ...profileData };
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      
      // Update the context
      // Note: You might need to add a method to update currentUser in AuthContext
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      );
      setBookings(updatedBookings);
      localStorage.setItem(`bookings_${currentUser.id}`, JSON.stringify(updatedBookings));
      alert('Booking cancelled successfully!');
    }
  };

  const handleDownloadTicket = (booking) => {
    const currentDate = new Date().toLocaleDateString();
    const ticketData = `
╔══════════════════════════════════════════════════════════════╗
║                    SERENDIP WAVES CRUISE                     ║
║                        BOARDING PASS                         ║
╚══════════════════════════════════════════════════════════════╝

PASSENGER INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${currentUser.fullName}
Email: ${currentUser.email}
Phone: ${currentUser.phoneNumber}
Passport: ${currentUser.passportNumber || 'Not provided'}
NIC: ${currentUser.nicNumber || 'Not provided'}

CRUISE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cruise: ${booking.cruiseName}
Ship: ${booking.shipName}
Booking Number: ${booking.bookingNumber}
Booking Date: ${formatDate(booking.bookingDate)}

TRAVEL INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Departure: ${formatDate(booking.departureDate)}
Return: ${formatDate(booking.returnDate)}
Cabin Type: ${booking.cabinType}
Passengers: ${booking.passengers}
Total Price: $${booking.totalPrice}
Status: ${booking.status.toUpperCase()}

IMPORTANT NOTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Please arrive at the port 2 hours before departure
• Bring valid photo ID and travel documents
• Check-in closes 1 hour before departure
• Contact us for any changes or questions

Generated on: ${currentDate}
Thank you for choosing Serendip Waves!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boarding_pass_${booking.bookingNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = (booking) => {
    const currentDate = new Date().toLocaleDateString();
    const invoiceData = `
╔══════════════════════════════════════════════════════════════╗
║                    SERENDIP WAVES                            ║
║                        INVOICE                               ║
╚══════════════════════════════════════════════════════════════╝

INVOICE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice Date: ${currentDate}
Booking Number: ${booking.bookingNumber}
Invoice Number: INV-${booking.bookingNumber}

CUSTOMER INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${currentUser.fullName}
Email: ${currentUser.email}
Phone: ${currentUser.phoneNumber}

SERVICE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Description: ${booking.cruiseName} Cruise
Ship: ${booking.shipName}
Cabin Type: ${booking.cabinType}
Passengers: ${booking.passengers}
Departure: ${formatDate(booking.departureDate)}
Return: ${formatDate(booking.returnDate)}

PAYMENT SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal: $${booking.totalPrice}
Tax: $${(booking.totalPrice * 0.1).toFixed(2)}
Total: $${(booking.totalPrice * 1.1).toFixed(2)}

Payment Status: PAID
Payment Method: Credit Card

Thank you for your business!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
    const blob = new Blob([invoiceData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${booking.bookingNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      navigate('/');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!currentUser) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="text-center text-white">
          <div className="spinner-border mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading your dashboard...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '80px'
    }}>
      <div className="container py-5">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-lg" style={{ 
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff'
            }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <img src="/logo.png" alt="Logo" width="60" height="60" className="me-3" />
                    <div>
                      <h2 className="fw-bold mb-0">Welcome back, {currentUser.fullName}!</h2>
                      <p className="mb-0 text-white-50">Manage your bookings and profile</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="btn btn-outline-light"
                    style={{ borderRadius: '25px' }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-lg" style={{ 
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div className="card-body p-0">
                <ul className="nav nav-tabs nav-fill" style={{ border: 'none' }}>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                      onClick={() => setActiveTab('bookings')}
                      style={{ 
                        border: 'none',
                        borderRadius: '20px 0 0 0',
                        background: activeTab === 'bookings' ? 'rgba(255, 193, 7, 0.9)' : 'transparent',
                        color: activeTab === 'bookings' ? '#000' : '#fff',
                        fontWeight: '600'
                      }}
                    >
                      📅 My Bookings ({bookings.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                      onClick={() => setActiveTab('profile')}
                      style={{ 
                        border: 'none',
                        borderRadius: '0 20px 0 0',
                        background: activeTab === 'profile' ? 'rgba(255, 193, 7, 0.9)' : 'transparent',
                        color: activeTab === 'profile' ? '#000' : '#fff',
                        fontWeight: '600'
                      }}
                    >
                      📋 Profile Management
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-lg" style={{ 
              borderRadius: '0 0 20px 20px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minHeight: '500px'
            }}>
              <div className="card-body p-4">
                {/* My Bookings Tab */}
                {activeTab === 'bookings' && (
                  <div>
                    <h3 className="fw-bold mb-4" style={{ color: '#2c3e50' }}>
                      📅 My Bookings ({bookings.length})
                    </h3>
                    
                    {bookings.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
                        <h5 className="text-muted">No bookings found</h5>
                        <p className="text-muted">Start your journey by booking a cruise!</p>
                        <button 
                          onClick={() => navigate('/')}
                          className="btn btn-primary"
                          style={{ borderRadius: '25px' }}
                        >
                          Browse Cruises
                        </button>
                      </div>
                    ) : (
                      <div className="row g-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="col-lg-6">
                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                              <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <h5 className="card-title fw-bold mb-0" style={{ color: '#2c3e50' }}>
                                    {booking.cruiseName}
                                  </h5>
                                  <span className={`badge ${booking.status === 'confirmed' ? 'bg-success' : booking.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`}>
                                    {booking.status}
                                  </span>
                                </div>
                                
                                <div className="row mb-3">
                                  <div className="col-6">
                                    <small className="text-muted d-block">🚢 Ship</small>
                                    <strong>{booking.shipName}</strong>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">🏠 Cabin</small>
                                    <strong>{booking.cabinType}</strong>
                                  </div>
                                </div>
                                
                                <div className="row mb-3">
                                  <div className="col-6">
                                    <small className="text-muted d-block">📅 Departure</small>
                                    <strong>{formatDate(booking.departureDate)}</strong>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">📅 Return</small>
                                    <strong>{formatDate(booking.returnDate)}</strong>
                                  </div>
                                </div>
                                
                                <div className="row mb-3">
                                  <div className="col-6">
                                    <small className="text-muted d-block">👥 Passengers</small>
                                    <strong>{booking.passengers}</strong>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">💰 Total Price</small>
                                    <strong>${booking.totalPrice}</strong>
                                  </div>
                                </div>

                                <div className="row mb-3">
                                  <div className="col-12">
                                    <small className="text-muted d-block">🔢 Booking Number</small>
                                    <strong>{booking.bookingNumber}</strong>
                                  </div>
                                </div>
                                
                                <div className="d-flex gap-2 flex-wrap">
                                  <button 
                                    onClick={() => handleDownloadTicket(booking)}
                                    className="btn btn-outline-primary btn-sm"
                                    style={{ borderRadius: '20px' }}
                                    disabled={booking.status === 'cancelled'}
                                  >
                                    📄 Boarding Pass
                                  </button>
                                  <button 
                                    onClick={() => handleDownloadInvoice(booking)}
                                    className="btn btn-outline-info btn-sm"
                                    style={{ borderRadius: '20px' }}
                                    disabled={booking.status === 'cancelled'}
                                  >
                                    📋 Invoice
                                  </button>
                                  {booking.status === 'confirmed' && (
                                    <button 
                                      onClick={() => handleCancelBooking(booking.id)}
                                      className="btn btn-outline-danger btn-sm"
                                      style={{ borderRadius: '20px' }}
                                    >
                                      ❌ Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Management Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h3 className="fw-bold mb-4" style={{ color: '#2c3e50' }}>
                      📋 Profile Management
                    </h3>
                    
                    <form onSubmit={handleProfileUpdate}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="fullName" className="form-label fw-semibold">
                            📝 Full Name *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                          <label htmlFor="email" className="form-label fw-semibold">
                            📧 Email Address *
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                          <label htmlFor="phoneNumber" className="form-label fw-semibold">
                            📞 Phone Number *
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phoneNumber"
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                          <label htmlFor="dateOfBirth" className="form-label fw-semibold">
                            🎂 Date of Birth *
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="dateOfBirth"
                            value={profileData.dateOfBirth}
                            onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                          <label htmlFor="gender" className="form-label fw-semibold">
                            👤 Gender *
                          </label>
                          <select
                            className="form-select"
                            id="gender"
                            value={profileData.gender}
                            onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                            required
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div className="col-md-6 mb-3">
                          <label htmlFor="passportNumber" className="form-label fw-semibold">
                            🛂 Passport Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="passportNumber"
                            value={profileData.passportNumber}
                            onChange={(e) => setProfileData({...profileData, passportNumber: e.target.value})}
                            placeholder="Enter passport number (optional)"
                          />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                          <label htmlFor="nicNumber" className="form-label fw-semibold">
                            🆔 NIC Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="nicNumber"
                            value={profileData.nicNumber}
                            onChange={(e) => setProfileData({...profileData, nicNumber: e.target.value})}
                            placeholder="Enter NIC number (optional)"
                          />
                        </div>
                      </div>
                      
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button 
                          type="submit" 
                          className="btn btn-warning btn-lg px-4"
                          style={{ borderRadius: '25px' }}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Updating...
                            </>
                          ) : (
                            '💾 Update Profile'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .nav-link:hover {
          background: rgba(255, 193, 7, 0.7) !important;
          color: #000 !important;
        }
        
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
        
        .btn:hover {
          transform: translateY(-1px);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard; 