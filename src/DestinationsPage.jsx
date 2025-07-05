import React, { useState } from "react";
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
  },
  {
    country: "Italy",
    shipName: "Roman Holiday",
    nights: "8 Nights",
    price: "$2,900",
    flag: "🇮🇹",
    image: "italy.jpg",
    description: "Sail the Mediterranean and explore the historic cities of Italy, from Rome to Venice."
  },
  {
    country: "Spain",
    shipName: "Iberian Explorer",
    nights: "7 Nights",
    price: "$2,700",
    flag: "🇪🇸",
    image: "spain.jpg",
    description: "Experience the vibrant culture, cuisine, and beaches of Spain on this unforgettable cruise."
  },
  {
    country: "Egypt",
    shipName: "Nile Majesty",
    nights: "6 Nights",
    price: "$2,400",
    flag: "🇪🇬",
    image: "egypt.jpg",
    description: "Cruise the Nile and discover the ancient wonders of Egypt, including the pyramids and temples."
  },
  {
    country: "France",
    shipName: "Parisian Dream",
    nights: "9 Nights",
    price: "$3,300",
    flag: "🇫🇷",
    image: "france.jpg",
    description: "Enjoy the romance of France, from the Riviera to Paris, with gourmet dining and fine wine."
  },
  {
    country: "Brazil",
    shipName: "Amazon Adventure",
    nights: "10 Nights",
    price: "$3,500",
    flag: "🇧🇷",
    image: "brazil.jpg",
    description: "Journey through the heart of the Amazon rainforest and experience Brazil's natural beauty."
  },
];

const DestinationsPage = () => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(destinations);

  const handleSearch = () => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setFiltered(destinations);
      return;
    }
    setFiltered(destinations.filter(dest =>
      dest.country.toLowerCase().includes(term) ||
      dest.shipName.toLowerCase().includes(term)
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
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by country or ship name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: '1px solid #ccc',
              fontSize: '1rem',
              minWidth: 220,
              background: '#1e3a8a',
              color: '#fff',
            }}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: 8,
              border: 'none',
              background: '#1e3a8a',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(30,58,138,0.08)'
            }}
          >
            Search
          </button>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {filtered.map((dest, idx) => (
            <Link
              key={idx}
              to={`/destination/${dest.country.toLowerCase()}`}
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
                    src={`/assets/${dest.image}`}
                    alt={dest.country}
                    style={{ width: 320, height: 220, objectFit: 'cover', borderRadius: 18, boxShadow: '0 2px 12px rgba(30,58,138,0.10)' }}
                  />
                </div>
                {/* Details on the right */}
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
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DestinationsPage; 