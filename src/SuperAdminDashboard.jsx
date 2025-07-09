import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaUtensils, FaBed, FaRoute, FaUsers, FaShip } from "react-icons/fa";
import "./SuperAdminDashboard.css";
import { useContext } from "react";
import { AuthContext } from "./App";
import logo from './assets/logo.png';

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
    icon: <FaShip size={28} />,
    route: "/cruise-ships",
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
    label: "Passenger Management",
    icon: <FaUsers size={28} />,
    route: "/passenger-management",
    active: true,
  },
];

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
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
            style={{ height: '90px', width: 'auto', maxWidth: '90px', cursor: 'pointer', objectFit: 'contain' }}
            onClick={() => navigate('/#top')}
          />
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1a237e', letterSpacing: '1px' }}>
            Serendip Waves
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
      <div className="container py-5">
        <h1 className="text-center mb-5 superadmin-title">Welcome Super Admin...!</h1>
        <div className="row justify-content-center g-4">
          {dashboardButtons.map((btn, idx) => (
            <div
              className="col-12 col-md-6 col-lg-4 d-flex justify-content-center"
              key={btn.label}
            >
              <button
                className={`dashboard-btn${
                  btn.active ? " active" : " disabled"
                }`}
                onClick={() => btn.active && navigate(btn.route)}
                disabled={!btn.active}
              >
                <div className="dashboard-btn-icon mb-2">{btn.icon}</div>
                <span className="dashboard-btn-label">{btn.label}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
