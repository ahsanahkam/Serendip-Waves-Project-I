import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupModal = ({ isOpen, onClose, openLoginModal }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    dob: "",
    gender: "",
    email: "",
    passport: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Simple validation
    if (!form.fullName || !form.phone || !form.dob || !form.gender || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSuccess("Account created successfully! (Simulation)");
    setForm({
      fullName: "",
      phone: "",
      dob: "",
      gender: "",
      email: "",
      passport: "",
      password: "",
      confirmPassword: ""
    });

    const signupData = {
      fullName: form.fullName,
      phoneNumber: form.phone,
      dateOfBirth: form.dob,
      gender: form.gender,
      email: form.email,
      password: form.password,
      passportNumber: form.passport
    };
  };

  return (
    <div style={overlayStyle}>
      <div className="card border-0 shadow-lg position-relative" style={cardStyle}>
        <button style={closeBtnStyle} onClick={onClose}>&times;</button>
        <div className="card-body p-3">
          <div className="text-center mb-3">
            <img src="/logo.png" alt="Serendip Waves Logo" width="80" height="80" className="mb-2" />
            <h2 className="fw-bold mb-0 text-white">Sign Up for Serendip Waves</h2>
            <p className="text-white-50 mb-0">Create your account and start your cruise adventure</p>
          </div>
          {error && <div className="alert alert-danger text-center py-2">{error}</div>}
          {success && <div className="alert alert-success text-center py-2">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold text-white mb-1">Full Name *</label>
                <input type="text" className="form-control form-control-lg" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your full name" style={inputStyle} />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold text-white mb-1">Phone Number *</label>
                <input type="text" className="form-control form-control-lg" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" style={inputStyle} />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold text-white mb-1">Date of Birth *</label>
                <input type="date" className="form-control form-control-lg" name="dob" value={form.dob} onChange={handleChange} style={inputStyle} />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold text-white mb-1">Gender *</label>
                <select className="form-select form-select-lg" name="gender" value={form.gender} onChange={handleChange} style={{...inputStyle, minWidth: '100%', width: '100%'}} required>
                  <option value="" disabled>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold text-white mb-1">Email Address *</label>
                <input type="email" className="form-control form-control-lg" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" style={inputStyle} />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold text-white mb-1">Passport Number (optional)</label>
                <input type="text" className="form-control form-control-lg" name="passport" value={form.passport} onChange={handleChange} placeholder="Enter your passport number" style={inputStyle} />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold text-white mb-1">Password *</label>
                <input type="password" className="form-control form-control-lg" name="password" value={form.password} onChange={handleChange} placeholder="Create a password" style={inputStyle} />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold text-white mb-1">Confirm Password *</label>
                <input type="password" className="form-control form-control-lg" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password" style={inputStyle} />
              </div>
            </div>
            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-warning btn-lg fw-bold" style={buttonStyle}>
                Create Account
              </button>
            </div>
            <div className="text-center">
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Already have an account?{' '}
                <span
                  className="fw-semibold"
                  style={{ color: '#ffd600', cursor: 'pointer' }}
                  onClick={() => {
                    onClose();
                    if (openLoginModal) openLoginModal();
                  }}
                >
                  Sign in here
                </span>
              </span>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        .form-control:focus, .form-select:focus {
          background: rgba(255,255,255,0.2) !important;
          border-color: #ffd600 !important;
          box-shadow: 0 0 0 0.2rem rgba(255, 214, 0, 0.25) !important;
          color: #fff !important;
          backdrop-filter: blur(15px) !important;
        }
        .form-control::placeholder { color: rgba(255,255,255,0.6) !important; }
        .form-select option {
          color: #000 !important;
          background: #fff !important;
        }
        .btn-warning:hover:not(:disabled) {
          background: rgba(255, 193, 7, 1) !important;
          border-color: rgba(255, 193, 7, 1) !important;
          transform: translateY(-2px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
        }
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.45)",
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cardStyle = {
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.13)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  backdropFilter: "blur(20px)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  color: "#fff",
  maxWidth: '800px',
  minWidth: '500px',
  width: '100%',
  position: 'relative',
  padding: '20px 32px',
  boxSizing: 'border-box',
  margin: 'auto',
  display: 'block'
};

const closeBtnStyle = {
  position: "absolute",
  top: 18,
  right: 22,
  background: "none",
  border: "none",
  fontSize: 32,
  color: "#fff",
  cursor: "pointer",
  zIndex: 2
};

const inputStyle = {
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.3)',
  background: 'rgba(255,255,255,0.1)',
  color: '#fff',
  backdropFilter: 'blur(10px)'
};

const buttonStyle = {
  borderRadius: '10px',
  fontSize: '1.1rem',
  padding: '12px',
  background: 'rgba(255, 193, 7, 0.9)',
  border: '1px solid rgba(255, 193, 7, 0.3)',
  backdropFilter: 'blur(10px)',
  color: '#000',
  fontWeight: 700
};

export default SignupModal; 