import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { FaSwimmingPool, FaPlus, FaEye } from 'react-icons/fa';
import BookedFacilities from './BookedFacilities';

const CustomerFacilitiesDashboard = ({ customerId }) => {
  const [customerBookings, setCustomerBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomerBookings = useCallback(async () => {
    try {
      setLoading(true);
      // This would need a new endpoint to get all bookings for a customer
      const response = await fetch(`http://localhost/Project-I/backend/getCustomerBookings.php?customer_id=${customerId}`);
      const data = await response.json();
      
      if (data.success) {
        setCustomerBookings(data.bookings);
      } else {
        setError('No bookings found.');
      }
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomerBookings();
  }, [fetchCustomerBookings]);

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading your facility bookings...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="warning">
            <FaSwimmingPool className="me-2" />
            {error}
          </Alert>
          <Button variant="primary" onClick={() => window.location.href = '/bookings'}>
            <FaPlus className="me-2" />
            Make a New Booking
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <FaSwimmingPool className="me-2" />
              Your Facility Bookings
            </h4>
            <Button variant="light" size="sm" onClick={() => window.location.href = '/bookings'}>
              <FaPlus className="me-2" />
              New Booking
            </Button>
          </div>
        </Card.Header>
      </Card>

      {customerBookings.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <FaSwimmingPool size={48} className="text-muted mb-3" />
            <h5>No Facility Bookings Yet</h5>
            <p className="text-muted">
              Start planning your perfect cruise experience by booking some amazing facilities!
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/bookings'}>
              <FaPlus className="me-2" />
              Explore Facilities
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {customerBookings.map((booking, index) => (
            <Col lg={6} key={booking.booking_id || index} className="mb-4">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Booking ID:</strong> {booking.booking_id}
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => window.location.href = `/facilities/${booking.booking_id}`}
                  >
                    <FaEye className="me-1" />
                    Manage
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <BookedFacilities 
                    bookingId={booking.booking_id} 
                    showTitle={false}
                  />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CustomerFacilitiesDashboard;
