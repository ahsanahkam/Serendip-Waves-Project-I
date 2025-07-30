import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaUsers, FaRoute, FaBed, FaShip, FaInfoCircle, FaSwimmingPool, FaUtensils, FaDollarSign } from "react-icons/fa";
import { AuthContext } from './App';
import logo from './assets/logo.png';
import { Modal, Button } from 'react-bootstrap';

const _cardStyle = {
  background: "#ece9f6",
  borderRadius: "32px",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.13)",
  padding: "2.5rem 3.5rem",
  minWidth: 260,
  minHeight: 140,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  color: "#333",
  fontWeight: 600,
  fontSize: "1.25rem",
  margin: "1.2rem",
  transition: "box-shadow 0.2s, transform 0.2s",
};

const iconStyle = {
  fontSize: "2.2rem",
  color: "#7c5fe6",
  marginBottom: "0.7rem",
};

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = (to) => { window.location.href = to; };
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };
  const handleConfirmLogout = () => {
    logout();
    navigate('/');
    setShowLogoutModal(false);
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 1rem",
      }}
    >
      {/* Custom Navbar */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "2px 2px",
          background: "#fff",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
          minHeight: "90px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          borderBottom: "1px solid #eee"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "80px",
              width: "auto",
              maxWidth: "100px",
              cursor: "pointer",
              objectFit: "contain"
            }}
            onClick={() => navigate('/#top')}
          />
          <div style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#1a237e", letterSpacing: "1px" }}>
            Admin Dashboard
          </div>
        </div>
        <button
          onClick={handleLogoutClick}
          className="superadmin-logout-btn"
        >
          Logout
        </button>
      </div>
      {/* End Custom Navbar */}
      <div style={{ marginTop: "110px" }}>
        <h2 style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: "3rem",
          marginBottom: "2.5rem",
          textAlign: "center",
          letterSpacing: "0.5px",
          textShadow: "0 4px 24px rgba(30,58,138,0.13)"
        }}>
          Admin Dashboard
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2.5rem",
            maxWidth: 1200,
            width: "100%",
          }}
        >
          <Link to="/booking-overview" className="admin-dashboard-btn">
            <FaBook style={iconStyle} />
            Booking Overview
          </Link>
          <Link to="/manage-cruises" className="admin-dashboard-btn">
            <FaShip style={iconStyle} />
            Cruise
          </Link>
          <Link to="/passenger-management" className="admin-dashboard-btn">
            <FaUsers style={iconStyle} />
            Passenger Management
          </Link>
          <Link to="/itinerary-management" className="admin-dashboard-btn">
            <FaRoute style={iconStyle} />
            Itinerary Management
          </Link>
          <Link to="/itinerary-details" className="admin-dashboard-btn">
            <FaInfoCircle style={iconStyle} />
            Itinerary Details
          </Link>
          <Link to="/cabin-admin" className="admin-dashboard-btn">
            <FaBed style={iconStyle} />
            Cabin Management
          </Link>
          <Link to="/facilities-dashboard?from=admin-dashboard" className="admin-dashboard-btn">
            <FaSwimmingPool style={iconStyle} />
            Facilities Dashboard
          </Link>
          <Link to="/facility-management?from=admin-dashboard" className="admin-dashboard-btn">
            <FaSwimmingPool style={iconStyle} />
            Facility Management
          </Link>
          <Link to="/meals-dashboard" className="admin-dashboard-btn">
            <FaUtensils style={iconStyle} />
            Meals Dashboard
          </Link>
          <Link to="/dynamic-pricing" className="admin-dashboard-btn">
            <FaDollarSign style={iconStyle} />
            Dynamic Pricing
          </Link>
          <Link to="/enquiries" className="admin-dashboard-btn">
            <FaInfoCircle style={iconStyle} />
            Enquiries
          </Link>
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
};

export default AdminDashboard; 