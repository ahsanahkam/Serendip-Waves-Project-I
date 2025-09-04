import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form, Row, Col } from 'react-bootstrap';
import { FaTrash, FaShip, FaUser, FaBed, FaCalendarAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingOverviewPage.css';
import logo from './assets/logo.png';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';

// Mock cabin types data (keeping this as it's not requested to be dynamic)
const cabinTypes = ['Interior', 'Ocean View', 'Balcony', 'Suite'];

function BookingOverviewPage() {
  const { logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = (to) => { window.location.href = to; };
  const [bookings, setBookings] = useState([]);
  const [cruiseTitles, setCruiseTitles] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    cruise: '',
    cabinType: '',
    dateFrom: '',
    dateTo: '',
  });

  // Fetch bookings and cruise titles from backend on mount
  useEffect(() => {
    // Fetch bookings
    fetch('http://localhost/Project-I/backend/getAllBookings.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.bookings) {
          setBookings(data.bookings);
        }
      });

    // Fetch cruise titles from ship_details table
    fetch('http://localhost/Project-I/backend/getCruises.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.cruises) {
          setCruiseTitles(data.cruises);
        }
      })
      .catch(error => {
        console.error('Error fetching cruise titles:', error);
        // Fallback to empty array if API fails
        setCruiseTitles([]);
      });
  }, []);

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      (b.full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      String(b.booking_id).toLowerCase().includes(filters.search.toLowerCase()));
    const matchesCruise = !filters.cruise || b.ship_name === filters.cruise;
    const matchesCabinType = !filters.cabinType || b.room_type === filters.cabinType;
    const matchesDateFrom = !filters.dateFrom || (b.booking_date && b.booking_date >= filters.dateFrom);
    const matchesDateTo = !filters.dateTo || (b.booking_date && b.booking_date <= filters.dateTo);
    return matchesSearch && matchesCruise && matchesCabinType && matchesDateFrom && matchesDateTo;
  });

  // Handle filter changes
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  const clearFilters = () => {
    setFilters({ search: '', cruise: '', cabinType: '', dateFrom: '', dateTo: '' });
  };

  // Delete booking
  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost/Project-I/backend/deleteBooking.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ booking_id: bookingId })
        });

        const data = await response.json();
        
        if (data.success) {
          // Remove the booking from the local state
          setBookings(prev => prev.filter(b => b.booking_id !== bookingId));
          // Show success message (optional)
          alert('Booking deleted successfully!');
        } else {
          alert('Failed to delete booking: ' + (data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Network error occurred while deleting booking. Please try again.');
      }
    }
  };

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);
  const handleConfirmLogout = () => {
    logout();
    navigate('/');
    setShowLogoutModal(false);
  };

  // Custom Navbar (Admin Dashboard style)
  const navbar = (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2px 2px',
        background: '#fff',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        minHeight: '90px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        borderBottom: '1px solid #eee'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <img
          src={logo}
          alt="Logo"
          style={{ height: '80px', width: 'auto', maxWidth: '100px', cursor: 'pointer', objectFit: 'contain' }}
          onClick={() => navigate('/#top')}
        />
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1a237e', letterSpacing: '1px' }}>
          Booking Overview
        </div>
      </div>
      <button
        onClick={handleLogoutClick}
        className="superadmin-logout-btn"
      >
        Logout
      </button>
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 1rem',
      }}
    >
      {navbar}
      <div style={{ marginTop: '110px', width: '100%' }}>
        {/* Gradient Header */}
        <section className="booking-hero-section mb-4" style={{ minHeight: '220px', padding: '40px 0' }}>
          <div className="booking-hero-background"></div>
          <div className="booking-hero-content container text-center text-white">
            <h2 className="booking-hero-title mb-2" style={{ fontSize: '2.8rem' }}>
              <FaShip className="me-2 mb-1" /> Booking Overview
            </h2>
            <p className="booking-hero-subtitle mb-0">
              Monitor and manage all cruise bookings with powerful filters and quick actions.
            </p>
          </div>
        </section>
        {/* Filters Section with Add Booking button on the right */}
        <div className="card booking-glass-effect mb-4 p-3 shadow-lg border-0" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-3">
            <div style={{ flex: 1 }}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <Form.Label><FaUser className="me-1" /> Search</Form.Label>
                  <Form.Control
                    type="text"
                    name="search"
                    placeholder="Passenger Name or Booking ID"
                    value={filters.search}
                    onChange={handleFilterChange}
                  />
                </Col>
                <Col md={2}>
                  <Form.Label><FaShip className="me-1" /> Cruise Title</Form.Label>
                  <Form.Select name="cruise" value={filters.cruise} onChange={handleFilterChange}>
                    <option value="">All Cruises</option>
                    {cruiseTitles.map(title => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Label><FaBed className="me-1" /> Cabin Type</Form.Label>
                  <Form.Select name="cabinType" value={filters.cabinType} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    {cabinTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Label><FaCalendarAlt className="me-1" /> Date From</Form.Label>
                  <Form.Control type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} />
                </Col>
                <Col md={2}>
                  <Form.Label><FaCalendarAlt className="me-1" /> Date To</Form.Label>
                  <Form.Control type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} />
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  <Button variant="secondary" onClick={clearFilters} className="w-100 d-flex justify-content-center align-items-center text-center">Clear</Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        {/* Booking Table */}
        <div className="table-responsive" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Table striped hover bordered className="align-middle shadow-sm" style={{ background: '#fff', borderRadius: 15 }}>
            <thead className="table-dark">
              <tr>
                <th>Booking ID</th>
                <th>Passenger Name</th>
                <th>Cruise Title</th>
                <th>Cabin Number</th>
                <th>Cabin Type</th>
                <th>Guests</th>
                <th>Booking Date</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr><td colSpan={9} className="text-center">No bookings found.</td></tr>
              ) : (
                filteredBookings.map(b => (
                  <tr key={b.booking_id}>
                    <td>{b.booking_id}</td>
                    <td>{b.full_name}</td>
                    <td>{b.ship_name}</td>
                    <td>{b.cabin_number}</td>
                    <td>{b.room_type}</td>
                    <td>{b.number_of_guests}</td>
                    <td>{b.booking_date ? new Date(b.booking_date).toLocaleDateString() : ''}</td>
                    <td>${parseFloat(b.total_price || 0).toLocaleString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(b.booking_id)}
                          title="Delete Booking"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={handleCloseLogoutModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to logout?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogoutModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Yes, Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BookingOverviewPage;