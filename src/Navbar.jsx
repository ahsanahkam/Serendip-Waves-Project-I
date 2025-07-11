import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./App";
import BookingModal from "./BookingModal";
import GreeceImg from './assets/Greece.jpg';
import { Modal, Button } from 'react-bootstrap';

const Navbar = ({ isScrolled, onLoginClick, onSignupClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout, setIsBookingModalOpen, isBookingModalOpen } = useContext(AuthContext);
  const [localBookingModalOpen, setLocalBookingModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
      if (window.innerWidth >= 992) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    if (onLoginClick) {
      onLoginClick();
    }
  };

  const handleSignupClick = () => {
    console.log('handleSignupClick called');
    setIsMenuOpen(false);
    if (onSignupClick) {
      console.log('onSignupClick prop exists, calling it');
      onSignupClick();
    } else {
      console.log('onSignupClick prop is missing');
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  return (
    <>
      <style>{`
        .navbar .btn-login {
          transition: all 0.2s;
        }
        .navbar .btn-login:hover {
          background: #ffd600 !important;
          border-color: #ffd600 !important;
          color: #222 !important;
        }
        .navbar .nav-link, .navbar-nav .nav-link {
          transition: background 0.2s, color 0.2s;
          border-radius: 10px;
        }
        .navbar .nav-link:hover, .navbar-nav .nav-link:hover {
          background: #e0e7ff !important;
          color: #1a237e !important;
        }
      `}</style>
      <nav 
        className="navbar navbar-expand-lg position-fixed w-100 top-0 start-0 px-2"
        style={{ 
          zIndex: 9999, 
          background: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          padding: '6px 0',
          minHeight: '60px',
          maxHeight: '80px',
          borderBottom: '1px solid #eee'
        }}
      >
        <div className="container-fluid px-0 d-flex justify-content-between align-items-center">
          {/* Logo and Brand */}
          <div className="d-flex align-items-center">
            <Link
              to="/"
              className="navbar-brand d-flex align-items-center fw-bold fs-5 me-4"
              style={{
                color: '#1a237e',
                fontFamily: 'Montserrat, Arial, sans-serif',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onClick={e => {
                e.preventDefault();
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  navigate('/');
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                }
              }}
            >
              <img src="/logo.png" alt="Serendip Waves Logo" width="120" height="120" className="me-2" style={{ maxHeight: '100px', width: 'auto', objectFit: 'contain', verticalAlign: 'middle' }} />
              <span style={{ fontWeight: 700, fontSize: '2.1rem', letterSpacing: '0.04em', color: '#1a237e', lineHeight: 1.1 }}>serendip<br/>waves</span>
            </Link>
          </div>
          {/* Login/Logout Button and Nav Links */}
          <div className="d-flex align-items-center gap-3">
            {isLargeScreen && (
              <div className="d-flex align-items-center gap-4">
                <a href="#home" className="nav-link fw-semibold" onClick={e => handleNavClick(e, 'home')} style={{ 
                  color: '#222', 
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  padding: '6px 18px',
                  fontWeight: 500
                }}>Home</a>
                <Link to="/destinations" className="nav-link fw-semibold" style={{ 
                  color: '#222', 
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  padding: '6px 18px',
                  fontWeight: 500
                }}>Destination</Link>
                <Link to="/cruise-ships" className="nav-link fw-semibold" style={{ 
                  color: '#222',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  padding: '6px 18px',
                  fontWeight: 500
                }}>Cruises</Link>
                <a href="#about" className="nav-link fw-semibold" onClick={e => handleNavClick(e, 'about')} style={{ 
                  color: '#222',
                  fontSize: '1.05rem',
                  padding: '6px 18px',
                  fontWeight: 500
                }}>About Us</a>
                <a href="#contact" className="nav-link fw-semibold" onClick={e => handleNavClick(e, 'contact')} style={{ 
                  color: '#222',
                  fontSize: '1.05rem',
                  padding: '6px 18px',
                  fontWeight: 500
                }}>Contact</a>
                {isAuthenticated && (!currentUser?.role || currentUser?.role === 'Customer') ? (
                  <div className="position-relative" ref={profileRef}>
                    <button
                      className="btn btn-outline-light"
                      type="button"
                      style={{ color: '#222', fontWeight: 700, borderRadius: '22px', padding: '7px 24px', fontSize: '1.05rem' }}
                      onClick={() => setProfileOpen((open) => !open)}
                    >
                      {currentUser?.full_name || currentUser?.name || currentUser?.email || 'Profile'}
                    </button>
                    {profileOpen && (
                      <div style={{
                        position: 'absolute',
                        right: 0,
                        top: '110%',
                        minWidth: 240,
                        background: '#fff',
                        border: '1px solid #eee',
                        borderRadius: 12,
                        boxShadow: '0 2px 12px #0001',
                        zIndex: 2000,
                        padding: '18px 20px',
                      }}>
                        <div style={{ borderBottom: '1px solid #eee', marginBottom: 10, paddingBottom: 8 }}>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 2 }}>
                            {currentUser?.full_name || currentUser?.name || 'User'}
                          </div>
                          <div style={{ color: '#666', fontSize: '0.97rem' }}>{currentUser?.email}</div>
                        </div>
                        <div style={{ borderTop: '1px solid #eee', marginTop: 10, paddingTop: 8 }}>
                          <Link to="/customer-dashboard" style={{ display: 'block', color: '#1a237e', fontWeight: 500, textDecoration: 'none', marginBottom: 8 }}>
                            Customer Dashboard
                          </Link>
                          <button
                            style={{ display: 'block', color: '#1a237e', fontWeight: 500, textDecoration: 'none', marginBottom: 8, background: 'none', border: 'none', width: '100%', textAlign: 'center', padding: 0, cursor: 'pointer' }}
                            onClick={() => {
                              if (setIsBookingModalOpen) {
                                setIsBookingModalOpen(true);
                              } else {
                                setLocalBookingModalOpen(true);
                              }
                              setProfileOpen(false);
                            }}
                          >
                            New Booking
                          </button>
                          <button className="dropdown-item" onClick={() => setShowLogoutModal(true)} style={{ padding: 0, color: '#e53935', background: 'none', border: 'none', width: '100%', textAlign: 'center', fontWeight: 500 }}>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={handleLoginClick}
                    className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2 ms-2 btn-login"
                    style={{ 
                      borderRadius: '22px',
                      padding: '7px 24px',
                      fontSize: '1.05rem',
                      fontWeight: 500,
                      border: '1.5px solid #222',
                      background: '#fff',
                      color: '#222',
                      boxShadow: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Collapsible Navigation Menu for Small Screens */}
        {!isLargeScreen && isMenuOpen && (
          <div className="collapse navbar-collapse show d-lg-none" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a href="#home" className="nav-link fw-semibold" onClick={e => handleNavClick(e, 'home')} style={{ 
                  color: '#fff', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: '1rem',
                  padding: '10px 15px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  Home
                </a>
              </li>
              <li className="nav-item">
                <Link to="/destinations" className="nav-link fw-semibold" style={{ 
                  color: '#fff', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: '1rem',
                  padding: '10px 15px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  Destination
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/cruise-ships" className="nav-link fw-semibold" onClick={handleNavLinkClick} style={{ 
                  color: '#fff',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: '1rem',
                  padding: '10px 15px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  Cruises
                </Link>
              </li>
              <li className="nav-item">
                <a href="#about" className="nav-link fw-semibold" onClick={e => handleNavClick(e, 'about')} style={{ 
                  color: '#fff',
                  transition: 'color 0.3s ease',
                  fontSize: '1rem',
                  padding: '10px 15px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a href="#contact" className="nav-link fw-semibold" onClick={e => handleNavClick(e, 'contact')} style={{ 
                  color: '#fff',
                  transition: 'color 0.3s ease',
                  fontSize: '1rem',
                  padding: '10px 15px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  Contact
                </a>
              </li>
              <li className="nav-item">
                <Link to="/super-admin" className="nav-link fw-semibold">Super Admin Dashboard</Link>
              </li>
              <li className="nav-item">
                <button 
                  onClick={handleSignupClick}
                  className="nav-link fw-semibold w-100 text-start border-0 bg-transparent" 
                  style={{ 
                    color: '#ffd600',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    fontSize: '1rem',
                    padding: '10px 15px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <i className="bi bi-person-plus me-2"></i>Sign Up
                </button>
              </li>
              <li className="nav-item">
                <button 
                  onClick={handleLoginClick}
                  className="nav-link fw-semibold w-100 text-start border-0 bg-transparent" 
                  style={{ 
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    fontSize: '1rem',
                    padding: '10px 15px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <i className="bi bi-person-circle me-2"></i>Login
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
      {(isBookingModalOpen !== undefined ? isBookingModalOpen : localBookingModalOpen) && (
        <BookingModal
          isOpen={isBookingModalOpen !== undefined ? isBookingModalOpen : localBookingModalOpen}
          onClose={() => {
            if (setIsBookingModalOpen) {
              setIsBookingModalOpen(false);
            } else {
              setLocalBookingModalOpen(false);
            }
          }}
        />
      )}
      {showLogoutModal && (
        <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to logout?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>No</Button>
            <Button variant="danger" onClick={() => {
              logout();
              setShowLogoutModal(false);
              navigate('/');
            }}>Yes, Logout</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
     
export default Navbar;                       