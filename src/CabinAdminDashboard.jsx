import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUserCircle,
  FaSearch,
  FaTimes,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import logo from "./assets/logo.png";

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
    type: "Interior",
    id: "INT-001",
    status: "Booked",
  },
  {
    passenger: "Rajesh Kumar",
    contact: "+91 98765 43210",
    cruise: "Serendip Majesty",
    type: "Ocean View",
    id: "OCV-001",
    status: "Available",
  },
  {
    passenger: "Maria Garcia",
    contact: "+34 612 345 678",
    cruise: "Serendip Explorer",
    type: "Balcony",
    id: "BAL-001",
    status: "Maintenance",
  },
  {
    passenger: "Liam O'Connor",
    contact: "+353 85 123 4567",
    cruise: "Serendip Serenade",
    type: "Suite",
    id: "SUI-001",
    status: "Booked",
  },
  {
    passenger: "Sophie Dubois",
    contact: "+33 6 12 34 56 78",
    cruise: "Serendip Adventurer",
    type: "Interior",
    id: "INT-002",
    status: "Available",
  },
  {
    passenger: "Chen Wei",
    contact: "+86 138 0013 8000",
    cruise: "Serendip Harmony",
    type: "Balcony",
    id: "BAL-002",
    status: "Booked",
  },
];

function CabinAdminDashboard() {
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
      [cabin.passenger, cabin.contact, cabin.id, cabin.cruise]
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

  return (
    <div className="dashboard-bg py-4 px-2 min-vh-100">
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Header Card */}
        <div className="card dashboard-card mb-4 p-3 d-flex flex-row align-items-center justify-content-between flex-wrap">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <img src={logo} alt="Logo" className="dashboard-logo me-3" />
            <span className="dashboard-title">Cabin Management Dashboard</span>
          </div>
          <div className="d-flex align-items-center">
            <span className="admin-label me-2">Admin</span>
            <FaUserCircle size={32} color="#2563eb" />
          </div>
        </div>
        {/* Filter Section Heading */}
        <div className="dashboard-section-heading mb-3 mt-2">
          <span className="dashboard-section-bar me-2"></span>
          Filter Cabins
        </div>
        {/* Filter Card */}
        <div className="card dashboard-card mb-4 p-3">
          <div className="row g-3">
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold">Search</label>
              <div className="input-group">
                <span className="input-group-text search-icon">
                  <FaSearch color="#2563eb" />
                </span>
                <input
                  type="text"
                  className="form-control search-input border-primary rounded-pill"
                  placeholder="Search cabins..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ borderLeft: "none" }}
                />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold">Cruise Name</label>
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
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold">Cabin Type</label>
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
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold">Status</label>
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
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
              onClick={handleClear}
            >
              <FaTimes />
              Clear Filters
            </button>
          </div>
        </div>
        {/* Divider for desktop */}
        <div className="dashboard-divider d-none d-lg-block" />
        {/* Cabins Section Heading */}
        <div className="dashboard-section-heading mb-3 mt-2">
          <span className="dashboard-section-bar me-2"></span>
          Cabins
        </div>
        {/* Table Card */}
        <div className="card dashboard-card mb-4 p-3">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Passenger Name</th>
                  <th>Contact No</th>
                  <th>Cruise Name</th>
                  <th>Cabin Type</th>
                  <th>Cabin ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCabins.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      No cabins found.
                    </td>
                  </tr>
                ) : (
                  filteredCabins.map((cabin, idx) => (
                    <tr key={cabin.id}>
                      <td>{cabin.passenger}</td>
                      <td>{cabin.contact}</td>
                      <td>{cabin.cruise}</td>
                      <td>
                        <span className="badge bg-primary bg-opacity-75 rounded-pill">
                          {cabin.type}
                        </span>
                      </td>
                      <td>{cabin.id}</td>
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
    </div>
  );
}

export default CabinAdminDashboard;
