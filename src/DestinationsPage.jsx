import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import destiImg from './assets/desti.webp';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await axios.get("http://localhost/Project-I/backend/getItineraries.php");
        setDestinations(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error("Failed to fetch itineraries:", error);
      }
    };
    fetchItineraries();
  }, []);

  const calculateNights = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleSearch = () => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setFiltered(destinations);
      return;
    }
    setFiltered(destinations.filter(dest =>
      (dest.route && dest.route.toLowerCase().includes(term)) ||
      (dest.ship_name && dest.ship_name.toLowerCase().includes(term))
    ));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <section
        id="destinations"
        style={{
          background: "#fff",
          padding: "3rem 0 3rem 0",
          minHeight: "100vh",
          width: "100%",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '110px',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
      >
        
        <h2 className="text-center mb-2 fw-bold" style={{ 
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          marginBottom: '1rem'
        }}>
          Featured Destinations
        </h2>
        <p className="lead text-muted text-center mb-5" style={{ 
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)", 
          maxWidth: 600, 
          margin: "0 auto 2rem auto",
          padding: '0 1rem'
        }}>
          Discover breathtaking destinations around the world with our premium cruise experiences
        </p>
        <div>
          <div className="featured-search-card">
            <div className="featured-search-bar">
              <span className="featured-search-icon">🚢</span>
              <input
                type="text"
                placeholder="Search by country or ship name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="featured-search-input"
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              />
              <button
                onClick={handleSearch}
                className="featured-search-btn"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        
        {/* Responsive Destinations Grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {filtered.map((dest, idx) => {
            const calculatedNights = calculateNights(dest.start_date, dest.end_date);
            return (
              <Link
                key={idx}
                to={`/destination/${dest.route ? dest.route.toLowerCase() : ''}`}
                state={{ destination: dest }}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  background: '#fff',
                  borderRadius: 24,
                  boxShadow: '0 4px 24px 0 rgba(30,58,138,0.08)',
                  padding: '2.5rem 2rem',
                  minHeight: 340,
                  gap: '2.5rem',
                  marginBottom: '1.5rem',
                  transition: 'box-shadow 0.2s',
                  cursor: 'pointer',
                }}>
                  {/* Image on the left */}
                  <div style={{ flex: '0 0 340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={dest.country_image ? `http://localhost/Project-I/backend/${dest.country_image}` : '/assets/default.jpg'}
                      alt={dest.route}
                      style={{ width: 320, height: 220, objectFit: 'cover', borderRadius: 18, boxShadow: '0 2px 12px rgba(30,58,138,0.10)' }}
                    />
                  </div>
                  {/* Details on the right */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.2rem' }}>
                    <div style={{ fontSize: '1.1rem', color: '#222', fontWeight: 500, marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#1e3a8a', marginRight: 8 }}>{dest.flag || ''}</span>
                      {dest.route} <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '2rem', marginLeft: 8 }}>{dest.ship_name}</span>
                    </div>
                    <div style={{ color: '#666', fontSize: '1.08rem', marginBottom: 8 }}>{dest.description || ''}</div>
                    
                    {/* Notes */}
                    {dest.notes && (
                      <div style={{ 
                        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
                        borderRadius: 16, 
                        padding: '1.2rem 1.5rem',
                        border: '1px solid rgba(252, 182, 159, 0.3)',
                        marginBottom: '0.5rem',
                        boxShadow: '0 4px 15px rgba(252, 182, 159, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          right: 0, 
                          height: '3px',
                          background: 'linear-gradient(90deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
                        }}></div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '0.8rem'
                        }}>
                          <div style={{ 
                            fontSize: '1.2rem', 
                            marginTop: '0.1rem',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                          }}>
                            💡
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              color: '#8B4513', 
                              fontSize: '0.95rem', 
                              lineHeight: '1.5',
                              fontWeight: 500,
                              textShadow: '0 1px 2px rgba(255,255,255,0.5)'
                            }}>
                              {dest.notes}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dates and Nights Combined */}
                    {(dest.start_date || dest.end_date || calculatedNights || dest.nights) && (
                      <div style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        borderRadius: 16, 
                        padding: '1.2rem 1.5rem',
                        marginBottom: '0.5rem',
                        color: '#fff',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.4rem', opacity: 0.9 }}>
                              📅 Cruise Duration
                            </div>
                            <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                              {dest.start_date && dest.end_date ? (
                                `${formatDate(dest.start_date)} - ${formatDate(dest.end_date)}`
                              ) : (
                                dest.start_date ? `From ${formatDate(dest.start_date)}` : 
                                dest.end_date ? `Until ${formatDate(dest.end_date)}` : 'Dates TBD'
                              )}
                            </div>
                          </div>
                          <div style={{ 
                            background: 'rgba(255, 255, 255, 0.2)', 
                            borderRadius: 12, 
                            padding: '0.8rem 1.2rem',
                            textAlign: 'center',
                            minWidth: 80,
                            backdropFilter: 'blur(10px)'
                          }}>
                            <div style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.2rem' }}>
                              {calculatedNights || dest.nights || 'N/A'}
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                              Nights
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      {/* SVG Wave for Nautical Theme */}
      <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0, marginTop: '-2.5rem' }}>
        <svg viewBox="0 0 1440 120" width="100%" height="80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,32 C360,120 1080,0 1440,96 L1440,120 L0,120 Z" fill="#185a9d" fillOpacity="0.18" />
          <path d="M0,64 C480,0 960,160 1440,64 L1440,120 L0,120 Z" fill="#43cea2" fillOpacity="0.22" />
        </svg>
      </div>
      <style>{`
        #destinations {
          position: relative;
          min-height: 60vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 110px;
          padding-bottom: 3rem;
          background: #fff !important;
        }
        @media (min-width: 900px) {
          #destinations {
            min-height: 70vh;
          }
        }
        .featured-search-card {
          /* background image now set inline in JSX */
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.13);
          border-radius: 24px;
          padding: 32px 24px;
          max-width: 600px;
          margin: 0 auto 2.5rem auto;
          backdrop-filter: blur(6px);
          overflow: hidden;
        }
        /* overlay and z-index now set inline in JSX */
        .featured-search-bar {
          position: relative;
          z-index: 1;
        }
        .featured-search-icon {
          font-size: 1.7rem;
          color: #185a9d;
          margin-right: 0.5rem;
        }
        .featured-search-input {
          flex: 1;
          padding: 14px 16px;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          background: #e3f6fd;
          color: #0f2027;
          box-shadow: 0 2px 8px rgba(58,90,152,0.07);
          outline: none;
          transition: box-shadow 0.2s;
        }
        .featured-search-input:focus {
          box-shadow: 0 4px 16px rgba(58,90,152,0.13);
        }
        .featured-search-btn {
          background: linear-gradient(90deg, #185a9d 0%, #43cea2 100%);
          color: #fff;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          padding: 14px 32px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(58,90,152,0.07);
        }
        .featured-search-btn:hover {
          background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
          color: #ffd600;
        }
        @media (max-width: 700px) {
          .featured-search-card {
            padding: 18px 6px;
            max-width: 98vw;
          }
          .featured-search-btn {
            padding: 12px 18px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DestinationsPage; 