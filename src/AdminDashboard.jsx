import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaUsers, FaRoute, FaBed, FaShip } from "react-icons/fa";
import { AuthContext } from './App';
import logo from './assets/logo.png';

const cardStyle = {
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
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #b8c6ff 0%, #6f86d6 100%)",
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
              height: "90px",
              width: "auto",
              maxWidth: "90px",
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
          onClick={handleLogout}
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
          <Link to="/booking-overview" style={cardStyle}>
            <FaBook style={iconStyle} />
            Booking Overview
          </Link>
          <Link to="/cruise-ships" style={cardStyle}>
            <FaShip style={iconStyle} />
            Cruise
          </Link>
          <Link to="/passenger-management" style={cardStyle}>
            <FaUsers style={iconStyle} />
            Passenger Management
          </Link>
          <Link to="/itinerary-management" style={cardStyle}>
            <FaRoute style={iconStyle} />
            Itinerary Management
          </Link>
          <Link to="/cabin-admin" style={cardStyle}>
            <FaBed style={iconStyle} />
            Cabin Management
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 