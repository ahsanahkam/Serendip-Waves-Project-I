import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CruiseShipsPage = () => {
  const [cruiseShips, setCruiseShips] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const location = useLocation();

  // Responsive: update windowWidth on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch cruise ships from backend
  useEffect(() => {
    axios.get("http://localhost/Project-I/backend/getShipDetails.php")
      .then(res => setCruiseShips(res.data))
      .catch(() => setCruiseShips([]));
  }, []);

  // Add CSS for smooth scrolling and full-screen sections
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      .cruise-ship-section {
        scroll-snap-align: start;
      }
      body {
        overflow-x: hidden;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      const sections = document.querySelectorAll('.cruise-ship-section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionHeight = window.innerHeight;
        const sectionMiddle = rect.top + rect.height / 2;
        const viewportMiddle = window.innerHeight / 2;
        if (Math.abs(sectionMiddle - viewportMiddle) < sectionHeight / 2) {
          setActiveSection(index);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const scrollToSection = (index) => {
    const sections = document.querySelectorAll('.cruise-ship-section');
    sections[index].scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewDestinations = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("destinations");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      const el = document.getElementById("destinations");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Responsive helper for section style
  const getSectionStyle = (index) => {
    if (windowWidth > 991) {
      // Desktop
      if (window.innerHeight < 650) {
        // Short, wide screens: don't vertically center, use minHeight
        return {
          minHeight: '100vh',
          padding: 0,
          background: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
          display: 'block',
          position: 'relative',
        };
      }
      return {
        height: '100vh',
        padding: 0,
        background: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      };
    } else if (windowWidth > 575) {
      // Tablet
      return {
        minHeight: 'auto',
        padding: '48px 0 32px 0',
        background: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      };
    } else {
      // Mobile
      return {
        minHeight: 'auto',
        padding: '32px 0 24px 0',
        background: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
        display: 'block',
        position: 'relative',
      };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', paddingTop: '80px' }}>
      {/* Hero Section */}
      <section
        style={
          windowWidth > 991
            ? window.innerHeight < 650
              ? {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  minHeight: '100vh',
                  display: 'block',
                  position: 'relative',
                  overflow: 'hidden',
                }
              : {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
                  overflow: 'hidden',
                }
            : windowWidth > 575
            ? {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: 'auto',
                padding: '48px 0 32px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
              }
            : {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: 'auto',
                padding: '40px 0 24px 0',
                position: 'relative',
                overflow: 'hidden',
              }
        }
      >
        <div className="container text-center text-white">
          <h1
            className="display-3 fw-bold mb-4"
            style={windowWidth <= 575 ? { fontSize: '2rem' } : windowWidth <= 991 ? { fontSize: '2.5rem' } : {}}
          >
            Our Fleet
          </h1>
          <p
            className="lead mb-5"
            style={windowWidth <= 575 ? { fontSize: '1rem' } : windowWidth <= 991 ? { fontSize: '1.1rem' } : {}}
          >
            Discover our magnificent fleet of luxury cruise ships, each designed to provide 
            unforgettable experiences across the world's most beautiful waters.
          </p>
          <div
            className="mt-5"
            style={{
              display: 'flex',
              flexDirection: windowWidth <= 575 ? 'column' : 'row',
              gap: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Link to="/" style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              textDecoration: 'none',
              padding: '0.7rem 2rem',
              borderRadius: '10px',
              background: 'transparent',
              border: '2px solid #fff',
              marginRight: windowWidth <= 575 ? 0 : 8,
              marginBottom: windowWidth <= 575 ? 10 : 0,
              display: 'inline-block',
              transition: 'background 0.2s, color 0.2s',
              width: windowWidth <= 575 ? '100%' : windowWidth <= 991 ? 'auto' : 'auto',
            }}>
              ← Back to Home
            </Link>
            <Link to="/destinations" style={{
              background: '#ffc107',
              color: '#111',
              fontWeight: 700,
              fontSize: '1.1rem',
              borderRadius: '10px',
              padding: 0,
              minWidth: windowWidth <= 575 ? '100%' : windowWidth <= 991 ? '180px' : '180px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(255,193,7,0.10)',
              border: 'none',
              margin: 0,
              transition: 'background 0.2s, color 0.2s',
              width: windowWidth <= 575 ? '100%' : windowWidth <= 991 ? 'auto' : 'auto',
            }}>
              View Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Dots */}
      <div style={{
        position: 'fixed',
        right: '30px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {cruiseShips.map((ship, index) => (
          <button
            key={ship.ship_name || ship.id || index}
            onClick={() => scrollToSection(index)}
            className={`btn btn-sm rounded-circle ${
              activeSection === index ? 'btn-warning' : 'btn-outline-light'
            }`}
            style={{
              width: '12px',
              height: '12px',
              padding: 0,
              border: '2px solid',
              transition: 'all 0.3s ease',
              boxShadow: activeSection === index ? '0 0 10px rgba(255, 193, 7, 0.5)' : 'none'
            }}
            title={ship.ship_name || ship.name}
          />
        ))}
      </div>

      {/* Cruise Ships Sections */}
      {cruiseShips.map((ship, index) => (
        <section
          key={ship.ship_name || ship.id || index}
          className="cruise-ship-section"
          style={getSectionStyle(index)}
        >
          <div className="container h-100">
            <div className="row align-items-center h-100">
              {/* Image Section */}
              <div className="col-lg-6 mb-5 mb-lg-0">
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  height: '500px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img
                    src={ship.ship_image ? `http://localhost/Project-I/backend/${ship.ship_image}` : 'https://via.placeholder.com/500x500'}
                    alt={ship.ship_name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '15px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="col-lg-6">
                <div style={{ padding: '40px 20px' }}>
                  {/* Ship Header */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      {/* No flag field in DB, so skip or add a placeholder */}
                      <span style={{ fontSize: '2rem', marginRight: '15px' }}>🚢</span>
                      <div>
                        <h2 className="fw-bold mb-1" style={{ 
                          fontSize: '2.5rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {ship.ship_name}
                        </h2>
                      </div>
                    </div>
                    <p className="lead text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                      {ship.about_ship}
                    </p>
                  </div>

                  {/* Ship Stats */}
                  <div className="row mb-4">
                    <div className="col-6 mb-3">
                      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-body text-center p-3">
                          <div className="fw-bold" style={{ fontSize: '1.2rem', color: '#000' }}>
                            {ship.passenger_count} passengers
                          </div>
                          <div className="text-muted small">Capacity</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 mb-3">
                      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-body text-center p-3">
                          <div className="fw-bold" style={{ fontSize: '1.2rem', color: '#000' }}>
                            {ship.pool_count} pools
                          </div>
                          <div className="text-muted small">Pools</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 mb-3">
                      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-body text-center p-3">
                          <div className="fw-bold" style={{ fontSize: '1.2rem', color: '#000' }}>
                            {ship.restaurant_count} restaurants
                          </div>
                          <div className="text-muted small">Restaurants</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 mb-3">
                      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-body text-center p-3">
                          <div className="fw-bold" style={{ fontSize: '1.2rem', color: '#000' }}>
                            {ship.deck_count} decks
                          </div>
                          <div className="text-muted small">Decks</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="text-center">
                    <Link to="/destinations" className="btn btn-warning btn-lg fw-bold" style={{
                      borderRadius: '18px',
                      padding: '1.2rem 3.5rem',
                      fontWeight: 800,
                      fontSize: '1.35rem',
                      display: 'inline-block',
                      minWidth: 0,
                      width: 'auto',
                      boxShadow: '0 4px 16px rgba(255,193,7,0.18)',
                      letterSpacing: '0.02em',
                    }}>
                      View Destinations
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Footer Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px 0',
        color: 'white'
      }}>
        <div className="container text-center">
          <h3 className="fw-bold mb-4">Ready to Set Sail?</h3>
          <p className="lead mb-4">
            Choose your perfect ship and embark on an unforgettable journey with Serendip Waves.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-outline-light btn-lg">
              Back to Home
            </Link>
            <Link to="/destinations" className="btn btn-warning btn-lg">
              View Destinations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CruiseShipsPage;
