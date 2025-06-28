import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import SignupModal from "./SignupModal";

// All destination data in this file
const destinations = [
  {
    country: "Greece",
    shipName: "Mediterranean Dream",
    nights: "7 Nights",
    price: "$2,500",
    flag: "🇬🇷",
    image: "Greece.jpg",
    description: "Explore the stunning Greek islands with crystal clear waters and ancient ruins."
  },
  {
    country: "Norway",
    shipName: "Northern Lights Explorer",
    nights: "10 Nights",
    price: "$3,100",
    flag: "🇳🇴",
    image: "norway.jpg",
    description: "Witness the magical Northern Lights and fjords of Norway."
  },
  {
    country: "Caribbean",
    shipName: "Tropical Paradise",
    nights: "8 Nights",
    price: "$2,800",
    flag: "🇯🇲",
    image: "Careebean.jpg",
    description: "Relax in the warm Caribbean waters with pristine beaches."
  },
  {
    country: "Alaska",
    shipName: "Glacier Adventure",
    nights: "12 Nights",
    price: "$3,600",
    flag: "🇺🇸",
    image: "Alaska.jpg",
    description: "Experience the majestic glaciers and wildlife of Alaska."
  },
  {
    country: "Japan",
    shipName: "Cherry Blossom Voyage",
    nights: "9 Nights",
    price: "$3,200",
    flag: "🇯🇵",
    image: "japan.jpg",
    description: "Discover the beauty of Japanese culture and cherry blossoms."
  },
  {
    country: "Australia",
    shipName: "Great Barrier Reef",
    nights: "11 Nights",
    price: "$3,900",
    flag: "🇦🇺",
    image: "Australia.jpg",
    description: "Explore the world's largest coral reef system."
  }
];

// Login Modal Component
const LoginModal = ({ isOpen, onClose, openSignupModal }) => {
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

const DestinationsPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(destinations.length / 3);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const getCurrentDestinations = () => {
    const startIndex = currentSlide * 3;
    return destinations.slice(startIndex, startIndex + 3);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar isScrolled={isScrolled} onLoginClick={openLoginModal} onSignupClick={openSignupModal} />
      
      <section
        id="destinations"
        style={{
          background: "#fff",
          padding: "3rem 0",
          minHeight: "100vh",
          width: "100vw",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2 className="text-center mb-2 fw-bold" style={{ fontSize: "2.5rem" }}>
          Featured Destinations
        </h2>
        <p className="lead text-muted text-center mb-5" style={{ fontSize: "1.2rem", maxWidth: 600, margin: "0 auto" }}>
          Discover breathtaking destinations around the world with our premium cruise experiences
        </p>
        <div
          className="glass-scroll"
          style={{
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
            background: 'rgba(255,255,255,0.25)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            backdropFilter: 'blur(12px)',
            borderRadius: '32px',
            border: '1px solid rgba(255,255,255,0.18)',
            padding: '2rem 1rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            display: 'flex',
            gap: '2rem',
            justifyContent: 'flex-start',
            msOverflowStyle: 'none', // IE and Edge
            scrollbarWidth: 'none',  // Firefox
          }}
        >
          {destinations.map((destination) => (
            <div
              key={destination.country}
              style={{
                display: "inline-block",
                width: 350,
                minWidth: 300,
                maxWidth: 350,
                background: "rgba(255,255,255,0.7)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                backdropFilter: "blur(8px)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.18)",
                marginRight: "1rem",
                overflow: "hidden",
              }}
            >
              <img
                src={destination.image}
                alt={destination.country}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderTopLeftRadius: "20px",
                  borderTopRightRadius: "20px",
                }}
              />
              <div style={{ padding: "1.5rem", textAlign: "left" }}>
                <h4 style={{ fontWeight: "bold", marginBottom: "0.5rem", textAlign: "left" }}>{destination.country}</h4>
                <div style={{
                  fontSize: "0.98rem",
                  color: "#444",
                  marginBottom: "1rem",
                  textAlign: "left",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}>
                  {destination.description}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <div style={{ fontWeight: "bold", color: "#222", fontSize: "1.1rem", textAlign: "left" }}>
                    {destination.nights}
                  </div>
                  <div style={{ fontWeight: "bold", color: "#007bff", fontSize: "1.05rem", textAlign: "right" }}>
                    {destination.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} openSignupModal={openSignupModal} />
      {/* Signup Modal */}
      <SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} onSignupSuccess={handleSignupSuccess} />
    </div>
  );
};

export default DestinationsPage; 