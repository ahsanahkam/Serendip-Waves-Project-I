import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "./assets/bg.jpg";
import Navbar from "./Navbar";
import DestinationsPage from "./DestinationsPage";
import SignupModal from "./SignupModal";

// Login Modal Component
const LoginModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '400px',
          animation: 'modalSlideIn 0.3s ease-out'
        }}
      >
        <div className="card border-0 shadow-lg" 
             style={{ 
               borderRadius: '20px',
               background: 'rgba(255, 255, 255, 0.1)',
               backdropFilter: 'blur(20px)',
               border: '1px solid rgba(255, 255, 255, 0.2)',
               color: '#fff'
             }}>
          <div className="card-body p-5">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="btn-close btn-close-white position-absolute"
              style={{
                top: '15px',
                right: '15px',
                zIndex: 1,
                opacity: 0.8
              }}
            ></button>

            {/* Logo */}
            <div className="text-center mb-4">
              <img 
                src="/logo.png" 
                alt="Serendip Waves Logo" 
                width="140" 
                height="140" 
                className="mb-3"
              />
              <h2 className="fw-bold mb-0 text-white">Login to Serendip Waves</h2>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-3">
                <label 
                  htmlFor="email" 
                  className="form-label fw-semibold text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  aria-describedby="emailHelp"
                  style={{ 
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <div id="emailHelp" className="form-text" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  We'll never share your email with anyone else.
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label 
                  htmlFor="password" 
                  className="form-label fw-semibold text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  aria-describedby="passwordHelp"
                  style={{ 
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <div id="passwordHelp" className="form-text" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Your password must be at least 8 characters long.
                </div>
              </div>

              {/* Login Button */}
              <div className="d-grid mb-4">
                <button 
                  type="submit" 
                  className="btn btn-warning btn-lg fw-bold"
                  style={{ 
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    padding: '12px',
                    background: 'rgba(255, 193, 7, 0.9)',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Login
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Don't have an account?{' '}
                  <a 
                    href="#signup" 
                    className="text-decoration-none fw-semibold"
                    style={{ color: '#ffd600' }}
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      openSignupModal();
                    }}
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Styles for Glass Effect */}
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .form-control:focus {
          background: rgba(255,255,255,0.2) !important;
          border-color: #ffd600 !important;
          box-shadow: 0 0 0 0.2rem rgba(255, 214, 0, 0.25) !important;
          color: #fff !important;
          backdrop-filter: blur(15px) !important;
        }
        
        .form-control::placeholder {
          color: rgba(255,255,255,0.6) !important;
        }
        
        .btn-warning:hover {
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
        
        /* Glass morphism effect */
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

// Hero Section
const Hero = () => (
  <section
    id="home"
    className="hero-section"
    style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      background: `url(${bg}) center center / cover no-repeat`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      padding: 0,
      margin: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "-80px",
      paddingTop: "80px",
      minWidth: "100vw",
      minHeight: "100vh",
      width: "100%"
    }}
  >
    <div
      className="hero-overlay"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.18)",
        zIndex: 1
      }}
    />
    <div
      className="hero-content"
      style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        textAlign: "center",
        color: "#fff",
        padding: "0 20px"
      }}
    >
      <h1 className="display-2 fw-bold mb-3" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.25)", lineHeight: 1.1 }}>
        Explore the World with <br /> Serendib Waves
      </h1>
      <p className="lead mb-4 text-uppercase fw-semibold" style={{ letterSpacing: '0.08em', textShadow: "0 1px 6px rgba(0,0,0,0.18)", fontSize: '1.1rem' }}>
        Where luxury meets the sea — every journey, a masterpiece.
      </p>
      <a href="#destinations" className="btn btn-lg px-5 py-3 hero-cta-btn shadow mx-auto" style={{ background: '#ffd600', color: '#222', fontWeight: 600, borderRadius: '2rem', fontSize: '1.25rem', border: 'none' }}>Book now</a>
    </div>
  </section>
);

// About Section
const AboutSection = () => (
  <section id="about" className="py-5" style={{ background: '#f8f9fa' }}>
    <div className="container">
      {/* About Content */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="display-5 fw-bold mb-4">About Serendip Waves</h2>
          <p className="lead mb-4">
            We are passionate about creating unforgettable cruise experiences that combine luxury, adventure, and discovery.
          </p>
          <p className="mb-4">
            With over 20 years of experience in the cruise industry, we've helped thousands of travelers explore the world's most beautiful destinations. Our commitment to excellence and attention to detail ensures every journey is extraordinary.
          </p>
          <div className="row text-center">
            <div className="col-4">
              <h3 className="fw-bold text-primary">500+</h3>
              <p className="text-muted">Happy Cruises</p>
            </div>
            <div className="col-4">
              <h3 className="fw-bold text-primary">50+</h3>
              <p className="text-muted">Destinations</p>
            </div>
            <div className="col-4">
              <h3 className="fw-bold text-primary">10K+</h3>
              <p className="text-muted">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
      {/* About Image */}
      <div className="row mb-5">
        <div className="col-12 d-flex justify-content-center">
          <img 
            src="About us.jpg" 
            alt="About Us" 
            className="img-fluid rounded shadow"
            style={{ borderRadius: '20px', maxWidth: '1000px', width: '100%',height:'500px',objectFit:'cover' }}
          />
        </div>
      </div>
      {/* Mission Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-lg h-100 mb-4" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="card-body p-5 text-white">
              <div className="text-center mb-4">
                <i className="fas fa-bullseye fa-3x mb-3" style={{ color: '#ffd600' }}></i>
                <h3 className="fw-bold mb-3">Our Mission</h3>
              </div>
              <p className="lead mb-0" style={{ lineHeight: '1.8' }}>
                Our mission is to revolutionize cruise ship management by delivering an intelligent, secure, and integrated digital platform. We aim to simplify operations, reduce manual inefficiencies, and enhance coordination between staff and passengers, while ensuring industry compliance and superior service quality for a modern maritime experience.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Vision Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="card-body p-5 text-white">
              <div className="text-center mb-4">
                <i className="fas fa-eye fa-3x mb-3" style={{ color: '#ffd600' }}></i>
                <h3 className="fw-bold mb-3">Our Vision</h3>
              </div>
              <p className="lead mb-0" style={{ lineHeight: '1.8' }}>
                We envision Serendib Waves as a leading digital solution in the cruise industry, empowering operators through technology-driven efficiency. By embracing smart automation and real-time analytics, we strive to support sustainable growth, elevate passenger satisfaction, and become a benchmark for future-ready, scalable cruise management systems worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Contact Section
const ContactSection = () => (
  <section id="contact" className="py-5" style={{ background: '#ffffff' }}>
    <div className="container">
      <div className="text-center mb-5">
        <h2 className="display-4 fw-bold text-dark mb-3">Contact Us</h2>
        <p className="lead text-muted">Get in touch with us for your next adventure</p>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow">
            <div className="card-body p-5">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input type="text" className="form-control" placeholder="Your name" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control" placeholder="Your email" />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Message</label>
                <textarea className="form-control" rows="5" placeholder="Your message"></textarea>
              </div>
              <button className="btn btn-primary btn-lg w-100">Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Footer
const Footer = () => (
  <footer className="bg-dark text-white py-5">
    <div className="container">
      {/* Main Footer Content */}
      <div className="row g-4">
        {/* First Column - Logo and Brand */}
        <div className="col-lg-4 col-md-6 text-center text-md-start">
          <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-3">
            <img 
              src="/logo.png" 
              alt="Serendip Waves Logo" 
              width="70" 
              height="70" 
              className="me-3"
            />
            <h5 className="fw-bold mb-0">Serendip Waves</h5>
          </div>
          <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
            Your journey to paradise starts here. We specialize in creating unforgettable cruise experiences that combine luxury, adventure, and discovery across the world's most beautiful destinations.
          </p>
        </div>

        {/* Second Column - Quick Links */}
        <div className="col-lg-4 col-md-6 text-center text-md-start">
          <h6 className="fw-bold mb-3 text-uppercase" style={{ color: '#ffd600' }}>Quick Links</h6>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a 
                href="#home" 
                className="text-decoration-none text-light"
                style={{ transition: 'color 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#ffd600'}
                onMouseLeave={(e) => e.target.style.color = '#f8f9fa'}
              >
                <i className="bi bi-house me-2 text-white"></i>Home
              </a>
            </li>
            <li className="mb-2">
              <a 
                href="#destinations" 
                className="text-decoration-none text-light"
                style={{ transition: 'color 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#ffd600'}
                onMouseLeave={(e) => e.target.style.color = '#f8f9fa'}
              >
                <i className="bi bi-geo-alt me-2 text-white"></i>Destinations
              </a>
            </li>
            <li className="mb-2">
              <a 
                href="#about" 
                className="text-decoration-none text-light"
                style={{ transition: 'color 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#ffd600'}
                onMouseLeave={(e) => e.target.style.color = '#f8f9fa'}
              >
                <i className="bi bi-info-circle me-2 text-white"></i>About Us
              </a>
            </li>
            <li className="mb-2">
              <a 
                href="#contact" 
                className="text-decoration-none text-light"
                style={{ transition: 'color 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#ffd600'}
                onMouseLeave={(e) => e.target.style.color = '#f8f9fa'}
              >
                <i className="bi bi-envelope me-2 text-white"></i>Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Third Column - Contact Information */}
        <div className="col-lg-4 col-md-6 text-center text-md-start">
          <h6 className="fw-bold mb-3 text-uppercase" style={{ color: '#ffd600' }}>Contact Info</h6>
          <div className="mb-3">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-2">
              <i className="bi bi-envelope me-3 text-white" style={{ width: '20px' }}></i>
              <a 
                href="mailto:info@serendipwaves.com" 
                className="text-decoration-none text-light"
                style={{ transition: 'color 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#ffd600'}
                onMouseLeave={(e) => e.target.style.color = '#f8f9fa'}
              >
                info@serendipwaves.com
              </a>
            </div>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-2">
              <i className="bi bi-telephone me-3 text-white" style={{ width: '20px' }}></i>
              <a 
                href="tel:+94771234567" 
                className="text-decoration-none text-light"
                style={{ transition: 'color 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#ffd600'}
                onMouseLeave={(e) => e.target.style.color = '#f8f9fa'}
              >
                +94 77 123 4567
              </a>
            </div>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <i className="bi bi-geo-alt me-3 text-white" style={{ width: '20px' }}></i>
              <span className="text-light">Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright and Social Media */}
      <div className="border-top border-secondary pt-4 mt-4">
        <div className="row align-items-center">
          {/* Copyright */}
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="text-light mb-0">
              © 2025 Serendip Waves. All rights reserved.
            </p>
          </div>
          
          {/* Social Media Icons */}
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
                style={{ transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <i className="bi bi-facebook fs-5 text-white"></i>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
                style={{ transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <i className="bi bi-instagram fs-5 text-white"></i>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
                style={{ transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <i className="bi bi-youtube fs-5 text-white"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  // When signup is successful, close signup modal and open login modal
  const handleSignupSuccess = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Navbar 
        isScrolled={isScrolled} 
        onLoginClick={openLoginModal} 
        onSignupClick={openSignupModal} 
      />
      <Hero />
      <DestinationsPage />
      <AboutSection />
      <ContactSection />
      <Footer />
      
      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      
      {/* Signup Modal */}
      <SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} onSignupSuccess={handleSignupSuccess} />
      
      <style>{`
        body, html, #root {
          margin: 0 !important;
          padding: 0 !important;
          min-height: 100vh !important;
          min-width: 100vw !important;
          width: 100% !important;
          height: 100% !important;
          overflow-x: hidden !important;
          background: transparent !important;
        }
        * {
          box-sizing: border-box;
        }
        .hero-section {
          min-height: 100vh !important;
          width: 100vw !important;
          min-width: 100vw !important;
          padding: 0 !important;
          margin: 0 !important;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat !important;
          position: relative !important;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -80px !important;
          padding-top: 80px !important;
          height: calc(100vh + 80px) !important;
          min-height: calc(100vh + 80px) !important;
          overflow: hidden !important;
        }
        .hero-content {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
        }
        .hero-cta-btn {
          background: #ffd600;
          color: #222;
          border: none;
          font-weight: 600;
          border-radius: 2rem;
          font-size: 1.25rem;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .hero-cta-btn:hover, .hero-cta-btn:focus {
          background: #ffb300;
          color: #fff;
          box-shadow: 0 4px 24px rgba(13,110,253,0.18);
        }
        .destination-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .destination-card:hover {
          transform: translateY(-10px);
        }
        .destination-card:hover .card {
          box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
        }
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: scale(1.02);
        }
        .flag-icon {
          transition: transform 0.3s ease;
        }
        .destination-card:hover .flag-icon {
          transform: scale(1.1);
        }
        @media (max-width: 767.98px) {
          .hero-content h1 {
            font-size: 2.2rem;
          }
          .hero-content p {
            font-size: 1rem;
          }
        }
        @media (max-width: 575.98px) {
          .hero-content h1 {
            font-size: 1.8rem;
          }
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          scroll-behavior: smooth;
        }
      `}</style>
      {/* Bootstrap Icons CDN for search icon */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    </div>
  );
};

export default HomePage;
