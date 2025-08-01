import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaLeaf, FaSeedling, FaMosque, FaHeartbeat, FaBreadSlice, FaUtensils, FaCoffee, FaWineGlass } from 'react-icons/fa';
import './OurDining.css';

const OurDining = () => {
  const navigate = useNavigate();
  
  // State for meal options from database
  const [mealOptions, setMealOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping for meal types
  const iconMapping = {
    'Vegetarian': <FaLeaf />,
    'Vegan': <FaSeedling />,
    'Halal': <FaMosque />,
    'Diabetic-Friendly': <FaHeartbeat />,
    'Gluten-Free': <FaBreadSlice />
  };

  // Badge mapping for meal types
  const badgeMapping = {
    'Vegetarian': { label: 'Most Popular', color: 'success' },
    'Vegan': { label: 'Premium', color: 'warning' },
    'Halal': { label: 'Certified', color: 'info' },
    'Diabetic-Friendly': { label: 'Health Focused', color: 'danger' },
    'Gluten-Free': { label: 'Celiac Safe', color: 'primary' }
  };

  // Fetch meal options from backend
  useEffect(() => {
    const fetchMealOptions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost/Project-I/backend/mealOptionsAPI.php');
        const data = await response.json();
        
        if (data.success && data.data) {
          const activeMealOptions = data.data.filter(option => option.status === 'active');
          setMealOptions(activeMealOptions);
        }
      } catch (error) {
        console.error('Error fetching meal options:', error);
        // Keep default empty array if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchMealOptions();
  }, []);

  // Fallback images for meal types
  const fallbackImages = {
    'Vegetarian': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'Vegan': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'Halal': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'Diabetic-Friendly': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'Gluten-Free': 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  };

  const diningTimes = [
    {
      name: 'Breakfast',
      time: '7:00 AM - 10:00 AM',
      icon: <FaCoffee />,
      description: 'Start your day with energizing breakfast options',
      specialties: ['Fresh fruits', 'Artisan breads', 'Local specialties', 'Fresh juices']
    },
    {
      name: 'Lunch',
      time: '12:00 PM - 3:00 PM',
      icon: <FaUtensils />,
      description: 'Satisfy your midday appetite with diverse lunch selections',
      specialties: ['International cuisine', 'Fresh salads', 'Grilled options', 'Light meals']
    },
    {
      name: 'Dinner',
      time: '6:00 PM - 10:00 PM',
      icon: <FaWineGlass />,
      description: 'Experience fine dining with our elegant dinner service',
      specialties: ['Multi-course meals', 'Wine pairings', 'Premium ingredients', 'Chef specials']
    }
  ];

  const teaServices = [
    {
      name: 'Morning Teatime',
      time: '10:30 AM - 11:30 AM',
      description: 'Traditional morning tea service with pastries and light refreshments'
    },
    {
      name: 'Evening Teatime',
      time: '4:00 PM - 5:30 PM',
      description: 'Afternoon tea experience with elegant accompaniments'
    }
  ];

  return (
    <div className="our-dining-page">
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
                <h1 className="hero-title">Exceptional Dining at Sea</h1>
                <p className="hero-subtitle">
                  Discover our world-class culinary offerings tailored to every dietary preference and lifestyle
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Meal Types Section */}
      <section className="meal-types-section">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="section-title">Our Specialty Dining Options</h2>
              <p className="section-subtitle">
                Each meal type is carefully crafted to meet specific dietary needs without compromising on taste or quality
              </p>
            </Col>
          </Row>
          
          <Row className="justify-content-center">
            <Col lg={10}>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading dining options...</p>
                </div>
              ) : mealOptions.length > 0 ? (
                mealOptions.map((mealOption, index) => (
                  <React.Fragment key={mealOption.option_id}>
                    <Card className="meal-type-card mb-5">
                      <Row className="g-0">
                        <Col md={5}>
                          <div className="meal-image-container">
                            <img 
                              src={mealOption.image ? `http://localhost/Project-I/backend/meal_images/${mealOption.image}` : fallbackImages[mealOption.type] || fallbackImages['Vegetarian']} 
                              alt={mealOption.title}
                              className="meal-image"
                              onError={(e) => {
                                // Fallback to online image if backend image fails
                                e.target.src = fallbackImages[mealOption.type] || fallbackImages['Vegetarian'];
                              }}
                            />
                          </div>
                        </Col>
                        <Col md={7}>
                          <Card.Body className="meal-content">
                            <div className="meal-header">
                              <div className="meal-icon">
                                {iconMapping[mealOption.type] || <FaUtensils />}
                              </div>
                              <div>
                                <h3 className="meal-name">{mealOption.title}</h3>
                                <Badge 
                                  bg={badgeMapping[mealOption.type]?.color || 'secondary'}
                                  className="meal-badge"
                                >
                                  {badgeMapping[mealOption.type]?.label || 'Available'}
                                </Badge>
                              </div>
                            </div>
                            <p className="meal-description">
                              {mealOption.description}
                            </p>
                            <div className="meal-features">
                              <h6>Key Features:</h6>
                              <ul>
                                {mealOption.key_features && mealOption.key_features.length > 0 ? (
                                  mealOption.key_features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                  ))
                                ) : (
                                  <li>Premium quality ingredients</li>
                                )}
                              </ul>
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                    
                    {/* Divider (except for last item) */}
                    {index < mealOptions.length - 1 && (
                      <div className="meal-divider">
                        <div className="divider-line"></div>
                      </div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-5">
                  <p>No meal options available at the moment.</p>
                  <p>Please check back later or contact our support team.</p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Dining Times Section */}
      <section className="dining-times-section">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="section-title">Daily Dining Schedule</h2>
              <p className="section-subtitle">
                Flexible dining times to accommodate your cruise schedule and preferences
              </p>
            </Col>
          </Row>
          
          <Row>
            {diningTimes.map((timeSlot) => (
              <Col md={4} key={timeSlot.name} className="mb-4">
                <Card className="dining-time-card h-100">
                  <Card.Body className="text-center">
                    <div className="dining-icon mb-3">
                      {timeSlot.icon}
                    </div>
                    <h4 className="dining-time-name">{timeSlot.name}</h4>
                    <p className="dining-time-hours">{timeSlot.time}</p>
                    <p className="dining-time-description">{timeSlot.description}</p>
                    <div className="dining-specialties">
                      <h6>Today's Specialties:</h6>
                      <div className="specialties-list">
                        {timeSlot.specialties.map((specialty, idx) => (
                          <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Tea Services Section */}
      <section className="tea-services-section">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={8} className="text-center">
              <h2 className="section-title">Traditional Tea Services</h2>
              <p className="section-subtitle">
                Elegant tea experiences that bring relaxation and refinement to your cruise
              </p>
            </Col>
          </Row>
          
          <Row className="justify-content-center">
            {teaServices.map((service) => (
              <Col md={6} key={service.name} className="mb-4">
                <Card className="tea-service-card">
                  <Card.Body className="text-center">
                    <div className="tea-icon mb-3">
                      <FaCoffee />
                    </div>
                    <h4 className="tea-service-name">{service.name}</h4>
                    <p className="tea-service-time">{service.time}</p>
                    <p className="tea-service-description">{service.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
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
                  <h2 className="cta-title">Ready to Experience Our Culinary Excellence?</h2>
                  <p className="cta-text">
                    Book your cruise today and discover why our dining experience is considered among 
                    the finest at sea. Our chefs are ready to create unforgettable culinary memories for you.
                  </p>
                  <div className="cta-buttons">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="cta-button me-3"
                      onClick={() => navigate('/cruise-ships')}
                    >
                      View Our Cruises
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="lg" 
                      className="cta-button"
                      onClick={() => navigate('/destinations')}
                    >
                      Browse Destinations
                    </Button>
                  </div>
                  <div className="mt-4">
                    <small className="text-muted">
                      Custom meal preferences • Special dietary accommodations • World-class chefs
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

export default OurDining;
