import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaBook, FaUtensils, FaBed, FaRoute, FaUsers, FaShip, FaInfoCircle, FaDollarSign, FaSwimmingPool } from "react-icons/fa";
import "./SuperAdminDashboard.css";
import { useContext } from "react";
import { AuthContext } from "./App";
import logo from './assets/logo.png';
import { Modal, Button } from "react-bootstrap";

const iconStyle = {
  fontSize: 28,
  marginRight: 12,
  color: "#4f46e5"
};

const dashboardButtons = [
  {
    label: "Booking Overview",
    icon: <FaBook size={28} />,
    route: "/booking-overview",
    active: true,
  },
  {
    label: "Pantry",
    icon: <FaUtensils size={28} />,
    route: "/food-inventory-management",
    active: true,
  },
  {
    label: "Cruise",
    icon: <FaShip style={iconStyle} />,
    route: "/manage-cruises",
    active: true,
  },
  {
    label: "Cabin Management",
    icon: <FaBed size={28} />,
    route: "/cabin-admin",
    active: true,
  },
  {
    label: "Itinerary Management",
    icon: <FaRoute size={28} />,
    route: "/itinerary-management",
    active: true,
  },
  {
    label: "Itinerary Details",
    icon: <FaInfoCircle size={28} />,
    route: "/itinerary-details",
    active: true,
  },
  {
    label: "Passenger Management",
    icon: <FaUsers size={28} />,
    route: "/passenger-management",
    active: true,
  },
  {
    label: "Dynamic Pricing",
    icon: <FaDollarSign size={28} />,
    route: "/dynamic-pricing",
    active: true,
  },
  {
    label: "Enquiries",
    icon: <FaInfoCircle size={28} />,
    route: "/enquiries",
    active: true,
  },
  {
    label: "Meals Dashboard",
    icon: <FaUtensils size={28} />,
    route: "/meals-dashboard",
    active: true,
  },
  {
    label: "Facilities Dashboard", 
    icon: <FaSwimmingPool size={28} />,
    route: "/facilities-dashboard",
    active: true,
  },
  {
    label: "Facility Management", 
    icon: <FaSwimmingPool size={28} />,
    route: "/facility-management",
    active: true,
  },
];

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate("/");
    setShowLogoutModal(false);
  };

  return (
    <div className="superadmin-dashboard-bg">
      {/* Custom Navbar */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2px 2px',
        background: '#fff',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: '80px', width: 'auto', maxWidth: '100px', cursor: 'pointer', objectFit: 'contain' }}
            onClick={() => navigate('/#top')}
          />
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1a237e', letterSpacing: '1px' }}>
            Serendip Waves
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
      <div className="container py-5">
        <h1 className="text-center mb-5 superadmin-title">Welcome Super Admin...!</h1>
        <div className="row justify-content-center g-4">
          {dashboardButtons.map((btn) => (
            <div
              className="col-12 col-md-6 col-lg-4 d-flex justify-content-center"
              key={btn.label}
            >
              <button
                className={`dashboard-btn${
                  btn.active ? " active" : " disabled"
                }`}
                onClick={() => {
                  if (btn.active) {
                    if (btn.route === "/facility-management") {
                      navigate("/facility-management?from=super-admin");
                    } else if (btn.route === "/facilities-dashboard") {
                      navigate("/facilities-dashboard?from=super-admin");
                    } else {
                      navigate(btn.route);
                    }
                  }
                }}
                disabled={!btn.active}
              >
                <div className="dashboard-btn-icon mb-2">{btn.icon}</div>
                <span className="dashboard-btn-label">{btn.label}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {showLogoutModal && (
        <Modal show={showLogoutModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to logout?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              No
            </Button>
            <Button variant="danger" onClick={handleConfirmLogout}>
              Yes, Logout
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default SuperAdminDashboard;