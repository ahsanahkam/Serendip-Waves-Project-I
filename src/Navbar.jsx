import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isScrolled, onLoginClick, onSignupClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
      if (window.innerWidth >= 992) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark position-fixed w-100 top-0 start-0 px-2" 
      style={{ 
        zIndex: 9999, 
        background: isScrolled ? 'rgba(0,0,0,0.8)' : 'none',
        boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        padding: '6px 0',
        minHeight: '50px'
      }}
    >
      <div className="container-fluid px-0 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center fw-bold fs-5 me-4" style={{ 
            color: '#fff', 
            fontFamily: 'Montserrat, Arial, sans-serif', 
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}>
            <img src="/logo.png" alt="Serendip Waves Logo" width="65" height="65" className="me-2" />
            <span className="d-none d-md-inline">Serendip Waves</span>
          </Link>
          {/* Desktop Navigation Links (large screens only) */}
          {isLargeScreen && (
            <div className="d-flex align-items-center gap-2">
              <a href="#home" className="nav-link fw-semibold" style={{ 
                color: '#fff', 
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                fontSize: '0.9rem',
                padding: '6px 10px'
              }}>
                Home
              </a>
              <a href="#destinations" className="nav-link fw-semibold" style={{ 
                color: '#fff', 
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                fontSize: '0.9rem',
                padding: '6px 10px'
              }}>
                Destination
              </a>
              <a href="#cruises" className="nav-link fw-semibold" style={{ 
                color: '#fff',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                fontSize: '0.9rem',
                padding: '6px 10px'
              }}>
                Cruises
              </a>
              <a href="#about" className="nav-link fw-semibold" style={{ 
                color: '#fff',
                transition: 'color 0.3s ease',
                fontSize: '0.9rem',
                padding: '6px 10px'
              }}>
                About Us
              </a>
              <a href="#contact" className="nav-link fw-semibold" style={{ 
                color: '#fff',
                transition: 'color 0.3s ease',
                fontSize: '0.9rem',
                padding: '6px 10px'
              }}>
                Contact
              </a>
            </div>
          )}
        </div>

        {/* Right Side - Login/Signup Buttons and Hamburger Menu */}
        <div className="d-flex align-items-center gap-3">
          {/* Signup Button */}
          <button 
            onClick={handleSignupClick}
            className="btn btn-warning btn-sm d-flex align-items-center gap-2"
            style={{ 
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              background: '#ffd600',
              color: '#000',
              border: '1px solid #ffd600'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ffd600';
              e.target.style.borderColor = '#ffd600';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ffd600';
              e.target.style.borderColor = '#ffd600';
            }}
          >
            <i className="bi bi-person-plus"></i>
            <span className="d-none d-sm-inline">Sign Up</span>
          </button>

          {/* Login Button */}
          <button 
            onClick={handleLoginClick}
            className="btn btn-warning btn-sm d-flex align-items-center gap-2"
            style={{ 
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              background: '#ffd600',
              color: '#000',
              border: '1px solid #ffd600'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ffd600';
              e.target.style.borderColor = '#ffd600';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ffd600';
              e.target.style.borderColor = '#ffd600';
            }}
          >
            <i className="bi bi-person-circle"></i>
            <span className="d-none d-sm-inline">Login</span>
          </button>

          {/* Hamburger Menu Button for Small Screens */}
          {!isLargeScreen && (
            <button 
              className="navbar-toggler" 
              type="button" 
              onClick={toggleMenu}
              aria-controls="navbarNav" 
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
              style={{ 
                border: '1px solid rgba(255,255,255,0.3)', 
                padding: '4px 8px',
                transition: 'border-color 0.3s ease',
                background: 'transparent'
              }}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          )}
        </div>
      </div>
      {/* Collapsible Navigation Menu for Small Screens */}
      {!isLargeScreen && isMenuOpen && (
        <div className="collapse navbar-collapse show d-lg-none" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="#home" className="nav-link fw-semibold" onClick={handleNavLinkClick} style={{ 
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
              <a href="#destinations" className="nav-link fw-semibold" onClick={handleNavLinkClick} style={{ 
                color: '#fff', 
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                fontSize: '1rem',
                padding: '10px 15px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                Destination
              </a>
            </li>
            <li className="nav-item">
              <a href="#cruises" className="nav-link fw-semibold" onClick={handleNavLinkClick} style={{ 
                color: '#fff',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                fontSize: '1rem',
                padding: '10px 15px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                Cruises
              </a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link fw-semibold" onClick={handleNavLinkClick} style={{ 
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
              <a href="#contact" className="nav-link fw-semibold" onClick={handleNavLinkClick} style={{ 
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
  );
};

export default Navbar;
