import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaSpa, FaDumbbell, FaSwimmer, FaFilm, FaDice, FaChild, FaBaby, FaGlassCheers, FaLanguage } from 'react-icons/fa';
import './ThingsToDo.css';

// Import images
import spaWellnessImg from './assets/spa-wellness.jpg';
import fitnessCenterImg from './assets/fitness-center.jpg';
import waterSportsImg from './assets/water-sports.jpg';
import cinemaMoviesImg from './assets/cinema-movies.jpg';
import casinoGamingImg from './assets/casino-gaming.jpg';
import kidsClubImg from './assets/kids-club.jpg';
import babysittingServicesImg from './assets/babysitting-services.jpg';
import eventHallsImg from './assets/event-halls.jpg';
import multilingualSupportImg from './assets/multilingual-support.jpg';

const ThingsToDo = () => {
  const navigate = useNavigate();

  const facilities = [
    {
      id: 1,
      name: "Spa and Wellness Center",
      icon: <FaSpa />,
      image: spaWellnessImg,
      description: "Rejuvenate your body and mind with our premium spa treatments, massage therapy, and wellness programs designed for ultimate relaxation at sea.",
      pricing: "Extra Charge",
      isPremium: true
    },
    {
      id: 2,
      name: "Fitness Center",
      icon: <FaDumbbell />,
      image: fitnessCenterImg,
      description: "Stay active with state-of-the-art equipment, personal trainers, and fitness classes including yoga, pilates, and aerobics with ocean views.",
      pricing: "Free",
      isPremium: false
    },
    {
      id: 3,
      name: "Water Sports Adventure",
      icon: <FaSwimmer />,
      image: waterSportsImg,
      description: "Dive into adventure with snorkeling, kayaking, paddleboarding, and other exciting water activities guided by certified instructors.",
      pricing: "Extra Charge",
      isPremium: true
    },
    {
      id: 4,
      name: "Cinema & Open-Air Movie Nights",
      icon: <FaFilm />,
      image: cinemaMoviesImg,
      description: "Enjoy latest blockbusters in our premium cinema or under the stars at our open-air movie nights with comfortable seating and gourmet snacks.",
      pricing: "Free",
      isPremium: false
    },
    {
      id: 5,
      name: "Casino & Gaming",
      icon: <FaDice />,
      image: casinoGamingImg,
      description: "Try your luck at our sophisticated casino featuring poker, blackjack, roulette, and slot machines in an elegant gaming atmosphere.",
      pricing: "Extra Charge",
      isPremium: true
    },
    {
      id: 6,
      name: "Kids' Club & Play Area",
      icon: <FaChild />,
      image: kidsClubImg,
      description: "Safe and fun supervised activities for children including games, crafts, educational programs, and entertainment designed for different age groups.",
      pricing: "Free",
      isPremium: false
    },
    {
      id: 7,
      name: "Professional Babysitting Services",
      icon: <FaBaby />,
      image: babysittingServicesImg,
      description: "Certified and experienced babysitters provide personalized care for your little ones, allowing parents to enjoy adult-only activities and relaxation time.",
      pricing: "Extra Charge",
      isPremium: true
    },
    {
      id: 8,
      name: "Private Party & Event Halls",
      icon: <FaGlassCheers />,
      image: eventHallsImg,
      description: "Celebrate special occasions in our elegant event spaces with professional planning services, catering options, and customizable decorations.",
      pricing: "Extra Charge",
      isPremium: true
    },
    {
      id: 9,
      name: "Multilingual Support & Translation",
      icon: <FaLanguage />,
      image: multilingualSupportImg,
      description: "Professional translation services and multilingual staff support to ensure seamless communication and enhance your cruise experience.",
      pricing: "Extra Charge",
      isPremium: true
    }
  ];

  const handleAddPreferences = () => {
    // Navigate to facilities preference page
    navigate('/facilities/TEST-BOOKING-001');
  };

  return (
    <div className="things-to-do-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <Button 
                  variant="outline-light" 
                  className="back-btn mb-4"
                  onClick={() => navigate(-1)}
                >
                  <FaArrowLeft className="me-2" />
                  Back
                </Button>
                <h1 className="hero-title">Luxury Onboard Facilities</h1>
                <p className="hero-subtitle">
                  Explore the world of comfort, adventure, and care at sea
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              {facilities.map((facility, index) => (
                <React.Fragment key={facility.id}>
                  <Card className="facility-card mb-5">
                    <Row className="g-0">
                      <Col md={5}>
                        <div className="facility-image-container">
                          <img 
                            src={facility.image} 
                            alt={facility.name}
                            className="facility-image"
                          />
                        </div>
                      </Col>
                      <Col md={7}>
                        <Card.Body className="facility-content">
                          <div className="facility-header">
                            <div className="facility-icon">
                              {facility.icon}
                            </div>
                            <div>
                              <h3 className="facility-name">{facility.name}</h3>
                              <Badge 
                                bg={facility.isPremium ? "warning" : "success"}
                                className="pricing-badge"
                              >
                                {facility.pricing}
                              </Badge>
                            </div>
                          </div>
                          <p className="facility-description">
                            {facility.description}
                          </p>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                  
                  {/* Divider (except for last item) */}
                  {index < facilities.length - 1 && (
                    <div className="facility-divider">
                      <div className="divider-line"></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <Card className="cta-card">
                <Card.Body className="p-5">
                  <h2 className="cta-title">Ready to Enhance Your Cruise Experience?</h2>
                  <p className="cta-text">
                    Already booked your cruise? Add your facility preferences now and customize 
                    your perfect vacation experience at sea!
                  </p>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="cta-button"
                    onClick={handleAddPreferences}
                  >
                    Add My Preferences
                  </Button>
                  <div className="mt-3">
                    <small className="text-muted">
                      Customize your onboard experience • Book additional services • Save preferences
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ThingsToDo;
