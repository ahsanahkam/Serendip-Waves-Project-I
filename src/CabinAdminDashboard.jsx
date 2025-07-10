import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUser,
  FaSearch,
  FaTimes,
  FaEdit,
  FaTrash,
  FaBed,
  FaHashtag,
  FaShip,
  FaDoorOpen,
  FaCheckCircle,
  FaPlus,
  FaUsers,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import logo from './assets/logo.png';
import { AuthContext } from './App';
import { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';

const cruiseNames = [
  "Serendip Dream",
  "Serendip Majesty",
  "Serendip Explorer",
  "Serendip Serenade",
  "Serendip Adventurer",
  "Serendip Harmony",
];
const cabinTypes = ["Interior", "Ocean View", "Balcony", "Suite"];
const statusOptions = ["Available", "Booked", "Maintenance"];

const initialCabins = [
  {
    passenger: "Alice Johnson",
    contact: "+1 202-555-0173",
    cruise: "Serendip Dream",
    type: "Suite",
    id: "SUI-101",
    number: "101",
    guests: 2,
    date: "2024-07-01",
    price: 2500,
    status: "Booked",
  },
  {
    passenger: "Rajesh Kumar",
    contact: "+91 98765 43210",
    cruise: "Serendip Majesty",
    type: "Ocean View",
    id: "OCV-102",
    number: "102",
    guests: 3,
    date: "2024-07-02",
    price: 1800,
    status: "Available",
  },
  {
    passenger: "Maria Garcia",
    contact: "+34 612 345 678",
    cruise: "Serendip Explorer",
    type: "Balcony",
    id: "BAL-103",
    number: "103",
    guests: 4,
    date: "2024-07-03",
    price: 3200,
    status: "Maintenance",
  },
  {
    passenger: "Liam O'Connor",
    contact: "+353 85 123 4567",
    cruise: "Serendip Serenade",
    type: "Suite",
    id: "SUI-104",
    number: "104",
    guests: 2,
    date: "2024-07-04",
    price: 2700,
    status: "Booked",
  },
  {
    passenger: "Sophie Dubois",
    contact: "+33 6 12 34 56 78",
    cruise: "Serendip Adventurer",
    type: "Interior",
    id: "INT-105",
    number: "105",
    guests: 1,
    date: "2024-07-05",
    price: 1200,
    status: "Available",
  },
  {
    passenger: "Chen Wei",
    contact: "+86 138 0013 8000",
    cruise: "Serendip Harmony",
    type: "Balcony",
    id: "BAL-106",
    number: "106",
    guests: 2,
    date: "2024-07-06",
    price: 2100,
    status: "Booked",
  },
];

function CabinAdminDashboard() {
  const { logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = (to) => { window.location.href = to; };
  const [cabins, setCabins] = useState(initialCabins);
  const [search, setSearch] = useState("");
  const [cruise, setCruise] = useState("All Cruises");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [editIdx, setEditIdx] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  const handleClear = () => {
    setSearch("");
    setCruise("All Cruises");
    setType("All Types");
    setStatus("All Status");
  };

  const filteredCabins = cabins.filter((cabin) => {
    const matchesSearch =
      search === "" ||
      [cabin.passenger, cabin.contact, cabin.id, cabin.cruise, cabin.number]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesCruise = cruise === "All Cruises" || cabin.cruise === cruise;
    const matchesType = type === "All Types" || cabin.type === type;
    const matchesStatus = status === "All Status" || cabin.status === status;
    return matchesSearch && matchesCruise && matchesType && matchesStatus;
  });

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditStatus(filteredCabins[idx].status);
  };
  const handleDelete = (idx) => {
    const toDelete = filteredCabins[idx].id;
    setCabins(cabins.filter((c) => c.id !== toDelete));
  };
  const handleSave = () => {
    const id = filteredCabins[editIdx].id;
    setCabins(
      cabins.map((c) => (c.id === id ? { ...c, status: editStatus } : c))
    );
    setEditIdx(null);
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
          style={{ height: '90px', width: 'auto', maxWidth: '90px', cursor: 'pointer', objectFit: 'contain' }}
          onClick={() => navigate('/#top')}
        />
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1a237e', letterSpacing: '1px' }}>
          Cabin Management
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
        {/* Filter Card */}
        <div className="cabin-card mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold">
                <FaSearch className="me-2 text-primary" />
                Search
              </label>
              <input
                type="text"
                className="form-control search-input border-primary rounded-pill"
                placeholder="Passenger Name, Cabin No, Cruise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold">
                <FaShip className="me-2 text-primary" />
                Cruise Name
              </label>
              <select
                className="form-select rounded-pill border-primary"
                value={cruise}
                onChange={(e) => setCruise(e.target.value)}
              >
                <option>All Cruises</option>
                {cruiseNames.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label fw-semibold">
                <FaDoorOpen className="me-2 text-primary" />
                Cabin Type
              </label>
              <select
                className="form-select rounded-pill border-primary"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>All Types</option>
                {cabinTypes.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label fw-semibold">
                <FaCheckCircle className="me-2 text-primary" />
                Status
              </label>
              <select
                className="form-select rounded-pill border-primary"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>All Status</option>
                {statusOptions.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-2 d-flex align-items-end gap-2">
              <button
                className="btn btn-secondary rounded-pill px-3 d-flex align-items-center gap-2 w-100"
                onClick={handleClear}
              >
                <FaTimes />
                Clear
              </button>
              <button
                className="btn btn-primary rounded-pill px-4 py-2 d-flex flex-column align-items-center justify-content-center w-100"
                style={{ fontSize: "1rem", lineHeight: 1.1 }}
              >
                <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>
                  <FaPlus />
                </span>
                <span style={{ fontWeight: 600 }}>Add</span>
                <span style={{ fontWeight: 600 }}>Cabin</span>
              </button>
            </div>
          </div>
        </div>
        <div className="cabin-card">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>
                    <FaHashtag className="me-2 text-primary" />
                    Cabin ID
                  </th>
                  <th>
                    <FaUser className="me-2 text-primary" />
                    Passenger Name
                  </th>
                  <th>
                    <FaShip className="me-2 text-primary" />
                    Cruise Name
                  </th>
                  <th>
                    <FaBed className="me-2 text-primary" />
                    Cabin Type
                  </th>
                  <th>
                    <FaDoorOpen className="me-2 text-primary" />
                    Cabin No
                  </th>
                  <th>
                    <FaUsers className="me-2 text-primary" />
                    Guests
                  </th>
                  <th>
                    <FaCalendarAlt className="me-2 text-primary" />
                    Booking Date
                  </th>
                  <th>
                    <FaDollarSign className="me-2 text-primary" />
                    Total Price
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCabins.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center text-muted">
                      No cabins found.
                    </td>
                  </tr>
                ) : (
                  filteredCabins.map((cabin, idx) => (
                    <tr key={cabin.id}>
                      <td>{cabin.id}</td>
                      <td>{cabin.passenger}</td>
                      <td>{cabin.cruise}</td>
                      <td>
                        <span className="badge bg-primary bg-opacity-75 rounded-pill">
                          {cabin.type}
                        </span>
                      </td>
                      <td>{cabin.number}</td>
                      <td>{cabin.guests}</td>
                      <td>{cabin.date}</td>
                      <td>${cabin.price.toLocaleString()}</td>
                      <td>
                        <span
                          className={
                            "badge rounded-pill " +
                            (cabin.status === "Booked"
                              ? "bg-success"
                              : cabin.status === "Available"
                              ? "bg-primary"
                              : "bg-warning text-dark")
                          }
                        >
                          {cabin.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-link text-primary p-1 me-2"
                          onClick={() => handleEdit(idx)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-link text-danger p-1"
                          onClick={() => handleDelete(idx)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Edit Modal */}
        {editIdx !== null && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 p-2">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">Edit Cabin Status</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditIdx(null)}
                  ></button>
                </div>
                <div className="modal-body pt-2">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select rounded-pill border-primary"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    {statusOptions.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    className="btn btn-secondary rounded-pill px-4"
                    onClick={() => setEditIdx(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary rounded-pill px-4"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default CabinAdminDashboard;
