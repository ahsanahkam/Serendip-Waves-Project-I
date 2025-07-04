import React from "react";
import { Link } from "react-router-dom";

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

const DestinationsPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <section
        id="destinations"
        style={{
          background: "#fff",
          padding: "3rem 0 3rem 0",
          minHeight: "100vh",
          width: "100vw",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '110px',
        }}
      >
        <h2 className="text-center mb-2 fw-bold" style={{ fontSize: "2.5rem" }}>
          Featured Destinations
        </h2>
        <p className="lead text-muted text-center mb-5" style={{ fontSize: "1.2rem", maxWidth: 600, margin: "0 auto" }}>
          Discover breathtaking destinations around the world with our premium cruise experiences
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {destinations.map((dest, idx) => (
            <div key={idx} style={{
              background: '#f8f9fa',
              borderRadius: 18,
              boxShadow: '0 4px 24px 0 rgba(30,58,138,0.08)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: 420,
            }}>
              <img
                src={`/assets/${dest.image}`}
                alt={dest.country}
                style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 12, marginBottom: 18 }}
              />
              <h3 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 6 }}>
                {dest.flag} {dest.country}
              </h3>
              <div style={{ color: '#667eea', fontWeight: 600, marginBottom: 8 }}>{dest.shipName}</div>
              <div style={{ fontSize: '1.08rem', marginBottom: 8 }}>{dest.nights} &bull; <span style={{ color: '#1e3a8a', fontWeight: 700 }}>{dest.price}</span></div>
              <div style={{ color: '#444', marginBottom: 12, textAlign: 'center' }}>{dest.description}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DestinationsPage; 