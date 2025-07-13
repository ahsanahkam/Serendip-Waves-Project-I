import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
        
        {/* Responsive Search Bar */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '1rem', 
          marginBottom: '2.5rem', 
          alignItems: 'center',
          width: '100%',
          maxWidth: '500px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '0.5rem',
            width: '100%',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <input
              type="text"
              placeholder="Search by country or ship name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 8,
                border: '1px solid #ccc',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                minWidth: '200px',
                flex: '1',
                maxWidth: '300px',
                background: '#1e3a8a',
                color: '#fff',
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: '0.75rem 1.2rem',
                borderRadius: 8,
                border: 'none',
                background: '#1e3a8a',
                color: '#fff',
                fontWeight: 600,
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
                whiteSpace: 'nowrap'
              }}
            >
              Search
            </button>
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
    </div>
  );
};

export default DestinationsPage; 