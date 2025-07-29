import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import BookedFacilities from './components/BookedFacilities';

const ViewBookedFacilities = ({ bookingId = 'BK001' }) => {
  return (
    <Container className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          {/* Header */}
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Facility Booking Details</h3>
                <Button 
                  variant="light" 
                  size="sm"
                  onClick={() => window.history.back()}
                >
                  <FaArrowLeft className="me-2" />
                  Back
                </Button>
              </div>
            </Card.Header>
          </Card>

          {/* Booked Facilities Display */}
          <BookedFacilities bookingId={bookingId} />

          {/* Additional Actions */}
          <Card>
            <Card.Body className="text-center">
              <h5>Need to make changes?</h5>
              <p className="text-muted mb-3">
                You can modify your facility bookings anytime before your cruise departure.
              </p>
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Button 
                  variant="primary" 
                  onClick={() => window.location.href = `/facilities/${bookingId}`}
                >
                  Modify Booking
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={() => window.location.href = '/customer-dashboard'}
                >
                  View All Bookings
                </Button>
                <Button 
                  variant="outline-info"
                  onClick={() => window.location.href = '/contact-support'}
                >
                  Contact Support
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewBookedFacilities;
