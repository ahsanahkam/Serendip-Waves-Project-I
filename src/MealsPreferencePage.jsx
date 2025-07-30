import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Row, Col, Table, Card, Alert } from 'react-bootstrap';
import { FaUtensils, FaArrowRight, FaSave } from 'react-icons/fa';
import './MealsPreferencePage.css';

const MEAL_TYPES = {
  'basic': { name: 'Basic/Vegetarian' },
  'vegan': { name: 'Vegan' },
  'halal': { name: 'Halal Gourmet' },
  'diabetic': { name: 'Diabetic-Friendly' },
  'gluten_free': { name: 'Gluten-Free' }
};

const MAIN_MEAL_TIMES = [
  { id: 'breakfast', name: 'Breakfast' },
  { id: 'lunch', name: 'Lunch' },
  { id: 'dinner', name: 'Dinner' }
];

const TEA_TIMES = [
  { id: 'morning_tea', name: 'Morning Teatime' },
  { id: 'evening_tea', name: 'Evening Teatime' }
];

function MealsPreferencePage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  console.log('MealsPreferencePage rendered, bookingId:', bookingId);
  
  const [passenger, setPassenger] = useState(null);
  const [mealType, setMealType] = useState('basic');
  const [selectedMainMeals, setSelectedMainMeals] = useState([]);
  const [selectedTeaTimes, setSelectedTeaTimes] = useState([]);
  const [days, setDays] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch passenger data based on booking ID
    const fetchPassengerData = async () => {
      try {
        console.log('Fetching passenger data for bookingId:', bookingId);
        
        // Replace with actual API endpoint for real bookings
        const apiUrl = `http://localhost/Project-I/backend/getPassengerByBooking.php?booking_id=${bookingId}`;
        console.log('Making API call to:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('API response:', data);
        
        if (data.success && data.passenger) {
          console.log('Setting passenger data:', data.passenger);
          setPassenger(data.passenger);
        } else {
          console.log('No passenger found for booking ID:', bookingId);
          setError(`Booking ID ${bookingId} not found in the system.`);
        }
      } catch (error) {
        console.error('Error fetching passenger data:', error);
        
        // Provide error messaging based on the type of error
        let errorMessage = 'Unable to load passenger data. Please check your booking ID and try again.';
        if (error.message.includes('401')) {
          errorMessage = 'Authentication required. Please login and try again.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Booking not found. Please verify your booking ID.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        setError(errorMessage);
      }
    };
    
    fetchPassengerData();
  }, [bookingId]);

  const handleMainMealChange = (mealTimeId) => {
    setSelectedMainMeals(prev => 
      prev.includes(mealTimeId) 
        ? prev.filter(id => id !== mealTimeId)
        : [...prev, mealTimeId]
    );
  };

  const handleTeaTimeChange = (teaTimeId) => {
    setSelectedTeaTimes(prev => 
      prev.includes(teaTimeId) 
        ? prev.filter(id => id !== teaTimeId)
        : [...prev, teaTimeId]
    );
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Replace with actual API endpoint
      const response = await fetch('http://localhost/Project-I/backend/saveMealPreferences.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          meal_type: mealType,
          main_meals: selectedMainMeals,
          tea_times: selectedTeaTimes,
          days: days,
          notes: notes
        })
      });
      
      if (response.ok) {
        setSuccess('Meal preferences saved successfully!');
        setTimeout(() => navigate(`/customer-dashboard`), 2000);
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving meal preferences:', error);
      
      // In demo mode, simulate successful save
      if (passenger && passenger.name.includes('Demo')) {
        setSuccess('✅ Demo: Meal preferences saved successfully! (This is a demo - no real data was saved)');
        setTimeout(() => navigate(`/customer-dashboard`), 3000);
      } else {
        setError('Failed to save meal preferences');
      }
    } finally {
      setLoading(false);
    }
  };

  const goToFacilities = () => {
    navigate(`/facilities/${bookingId}`);
  };

  if (!passenger) {
    console.log('Passenger data not loaded yet, showing loading...');
    return (
      <div className="meals-preference-page">
        <div className="container py-4">
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading passenger data for booking {bookingId}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="meals-preference-page">
      <div className="container py-4">
        <Card className="shadow-lg">
          <Card.Header className="bg-primary text-white">
            <h2 className="mb-0">
              <FaUtensils className="me-2" />
              Meal Preferences for {passenger.name}
            </h2>
            <small>Booking ID: {bookingId}</small>
          </Card.Header>
          
          <Card.Body>
            {error && (
              <Alert variant="warning" className="d-flex align-items-center">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <div>
                  <strong>Demo Mode:</strong> {error}
                  <br />
                  <small>This is a fully functional demo. You can test all features!</small>
                </div>
              </Alert>
            )}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Meal Type</strong></Form.Label>
                    <Form.Select 
                      value={mealType} 
                      onChange={(e) => setMealType(e.target.value)}
                    >
                      {Object.entries(MEAL_TYPES).map(([key, meal]) => (
                        <option key={key} value={key}>
                          {meal.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Number of Days</strong></Form.Label>
                    <Form.Control 
                      type="number" 
                      min="1" 
                      max="14" 
                      value={days}
                      onChange={(e) => setDays(parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label><strong>Main Meals (Breakfast, Lunch, Dinner)</strong></Form.Label>
                <div className="meal-times-grid">
                  {MAIN_MEAL_TIMES.map(mealTime => (
                    <Form.Check 
                      key={mealTime.id}
                      type="checkbox"
                      id={mealTime.id}
                      label={mealTime.name}
                      checked={selectedMainMeals.includes(mealTime.id)}
                      onChange={() => handleMainMealChange(mealTime.id)}
                      className="mb-2"
                    />
                  ))}
                </div>
                <small className="text-muted">
                  Select main meals based on the meal type above
                </small>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label><strong>Tea Times (Additional Services)</strong></Form.Label>
                <div className="meal-times-grid">
                  {TEA_TIMES.map(teaTime => (
                    <Form.Check 
                      key={teaTime.id}
                      type="checkbox"
                      id={teaTime.id}
                      label={teaTime.name}
                      checked={selectedTeaTimes.includes(teaTime.id)}
                      onChange={() => handleTeaTimeChange(teaTime.id)}
                      className="mb-2"
                    />
                  ))}
                </div>
                <small className="text-muted">
                  Select additional tea time services as needed
                </small>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label><strong>Notes/Allergies</strong></Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any dietary restrictions, allergies, or special requests..."
                />
              </Form.Group>
            </Form>
            
            <div className="action-buttons d-flex gap-2 flex-wrap">
              <Button 
                variant="primary" 
                onClick={handleSavePreferences}
                disabled={loading || (selectedMainMeals.length === 0 && selectedTeaTimes.length === 0)}
              >
                <FaSave className="me-2" />
                Save Meal Preferences
              </Button>
              
              <Button 
                variant="info" 
                onClick={goToFacilities}
              >
                Go to Facility Preferences
                <FaArrowRight className="ms-2" />
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={() => navigate('/customer-dashboard')}
              >
                Back to Booking History
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default MealsPreferencePage;