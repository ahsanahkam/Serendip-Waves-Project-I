import React, { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(destinations.length / 3);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    </div>
  );
};

export default DestinationsPage; 