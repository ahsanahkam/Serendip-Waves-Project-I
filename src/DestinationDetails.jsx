import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const DestinationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { country } = useParams();
  const dest = location.state?.destination;

  // If no state, show a fallback or redirect
  if (!dest) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Destination not found</h2>
        <button onClick={() => navigate(-1)} style={{ marginTop: 24, padding: '0.7rem 2rem', borderRadius: 8, border: 'none', background: '#1e3a8a', color: '#fff', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'row', background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px 0 rgba(30,58,138,0.08)', padding: '2.5rem 2rem', gap: '2.5rem', maxWidth: 1000, width: '100%' }}>
        <div style={{ flex: '0 0 340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={`/assets/${dest.image}`}
            alt={dest.country}
            style={{ width: 320, height: 220, objectFit: 'cover', borderRadius: 18, boxShadow: '0 2px 12px rgba(30,58,138,0.10)' }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.2rem' }}>
          <div style={{ fontSize: '1.1rem', color: '#222', fontWeight: 500, marginBottom: 2 }}>
            <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#1e3a8a', marginRight: 8 }}>{dest.flag}</span>
            {dest.country} <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '2rem', marginLeft: 8 }}>{dest.shipName}</span>
          </div>
          <div style={{ color: '#666', fontSize: '1.08rem', marginBottom: 8 }}>{dest.description}</div>
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: 8 }}>
            <div style={{ background: '#f5f7ff', borderRadius: 16, padding: '1rem 2rem', minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px rgba(30,58,138,0.04)' }}>
              <div style={{ color: '#4f46e5', fontWeight: 700, fontSize: '1.3rem' }}>{dest.nights}</div>
              <div style={{ color: '#888', fontSize: '1rem', marginTop: 2 }}>Nights</div>
            </div>
            <div style={{ background: '#f5f7ff', borderRadius: 16, padding: '1rem 2rem', minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px rgba(30,58,138,0.04)' }}>
              <div style={{ color: '#4f46e5', fontWeight: 700, fontSize: '1.3rem' }}>{dest.price}</div>
              <div style={{ color: '#888', fontSize: '1rem', marginTop: 2 }}>Price</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails; 