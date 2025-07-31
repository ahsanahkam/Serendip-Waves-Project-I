import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Card, Table, Badge, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaReceipt, FaCalendarAlt, FaShip, FaUser, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaClock, FaDollarSign } from 'react-icons/fa';

const FacilityBookingReceipt = ({ show, onHide, bookingId }) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBookingData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost/Project-I/backend/getCustomerFacilityPreferences.php?booking_id=${bookingId}`);
      const data = await response.json();
      
      if (data.success) {
        setBookingData(data.preference);
      } else {
        setError(data.message || 'Failed to load booking data');
      }
    } catch (error) {
      console.error('Error fetching booking data:', error);
      setError('Failed to load booking data');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (show && bookingId) {
      fetchBookingData();
    }
  }, [show, bookingId, fetchBookingData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge bg="success"><FaCheckCircle className="me-1" />Paid & Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning"><FaClock className="me-1" />Payment Pending</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getTotalAmount = () => {
    if (!bookingData?.facility_details) return 0;
    
    // Always recalculate from facility details instead of using stored total_cost
    // This ensures accuracy even if database has incorrect stored totals
    const calculatedTotal = bookingData.facility_details.reduce((total, facility) => {
      const lineTotal = facility.total_price || 0;
      return total + lineTotal;
    }, 0);
    
    return calculatedTotal;
  };

  const getStoredVsCalculatedTotalMismatch = () => {
    if (!bookingData?.total_cost || !bookingData?.facility_details) return null;
    
    const storedTotal = parseFloat(bookingData.total_cost);
    const calculatedTotal = getTotalAmount();
    
    if (Math.abs(storedTotal - calculatedTotal) > 0.01) {
      return {
        stored: storedTotal,
        calculated: calculatedTotal,
        difference: storedTotal - calculatedTotal
      };
    }
    
    return null;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FaReceipt className="me-2" />
          Facility Booking Receipt
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        {loading && (
          <div className="text-center p-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading booking details...</p>
          </div>
        )}
        
        {error && (
          <Alert variant="danger" className="m-3">
            <strong>Error:</strong> {error}
          </Alert>
        )}
        
        {bookingData && (
          <div>
            {/* Booking Header Information */}
            <Card className="border-0 border-bottom rounded-0">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h5 className="text-primary mb-3">
                      <FaUser className="me-2" />
                      Passenger Information
                    </h5>
                    <p className="mb-2">
                      <strong>Name:</strong> {bookingData.passenger_name || 'N/A'}
                    </p>
                    <p className="mb-2">
                      <FaEnvelope className="me-2" />
                      <strong>Email:</strong> {bookingData.passenger_email || 'N/A'}
                    </p>
                    <p className="mb-0">
                      <strong>Booking ID:</strong> <code>{bookingId}</code>
                    </p>
                  </Col>
                  <Col md={6}>
                    <h5 className="text-primary mb-3">
                      <FaShip className="me-2" />
                      Trip Information
                    </h5>
                    <p className="mb-2">
                      <strong>Ship:</strong> {bookingData.ship_name || 'N/A'}
                    </p>
                    <p className="mb-2">
                      <FaMapMarkerAlt className="me-2" />
                      <strong>Destination:</strong> {bookingData.destination || 'N/A'}
                    </p>
                    <p className="mb-2">
                      <strong>Room Type:</strong> {bookingData.room_type || 'N/A'}
                    </p>
                    <p className="mb-0">
                      <strong>Guests:</strong> {bookingData.adults || 0} Adults, {bookingData.children || 0} Children
                    </p>
                  </Col>
                </Row>
                
                <Row className="mt-3">
                  <Col md={6}>
                    <p className="mb-2">
                      <FaCalendarAlt className="me-2" />
                      <strong>Departure:</strong> {formatDate(bookingData.departure_date)}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-2">
                      <FaCalendarAlt className="me-2" />
                      <strong>Return:</strong> {formatDate(bookingData.return_date)}
                    </p>
                  </Col>
                </Row>
                
                {bookingData.trip_duration && (
                  <Row>
                    <Col>
                      <p className="mb-0">
                        <strong>Trip Duration:</strong> {bookingData.trip_duration} day{bookingData.trip_duration > 1 ? 's' : ''}
                      </p>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>

            {/* Payment Status */}
            <Card className="border-0 border-bottom rounded-0">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <h5 className="text-primary mb-0">Payment Status</h5>
                  </Col>
                  <Col xs="auto">
                    {getPaymentStatusBadge(bookingData.payment_status)}
                  </Col>
                </Row>
                
                {bookingData.journey_completed && (
                  <Alert variant="info" className="mt-3 mb-0">
                    <FaCheckCircle className="me-2" />
                    <strong>Journey Completed:</strong> This trip has been completed. Thank you for choosing our facilities!
                  </Alert>
                )}
              </Card.Body>
            </Card>

            {/* Facility Details */}
            <Card className="border-0 rounded-0">
              <Card.Header className="bg-light">
                <h5 className="mb-0 text-primary">
                  <FaDollarSign className="me-2" />
                  Booked Facilities
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {bookingData.facility_details && bookingData.facility_details.length > 0 ? (
                  <Table responsive className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Facility</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingData.facility_details.map((facility, index) => (
                        <tr key={index}>
                          <td>
                            <strong>{facility.name}</strong>
                            <br />
                            <small className="text-muted">{facility.unit_text}</small>
                          </td>
                          <td>
                            {facility.quantity} {facility.unit}{facility.quantity > 1 ? 's' : ''}
                          </td>
                          <td>
                            {facility.unit_price > 0 ? `$${facility.unit_price.toFixed(2)}` : 'Free'}
                          </td>
                          <td>
                            <strong>
                              {facility.total_price > 0 ? `$${facility.total_price.toFixed(2)}` : 'Free'}
                            </strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="table-primary">
                        <td colSpan="3" className="text-end"><strong>Total Amount:</strong></td>
                        <td><strong>${getTotalAmount().toFixed(2)}</strong></td>
                      </tr>
                    </tfoot>
                  </Table>
                ) : (
                  <div className="p-4 text-center text-muted">
                    <p>No facilities booked yet.</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Show warning if stored total doesn't match calculated total */}
            {getStoredVsCalculatedTotalMismatch() && (
              <Alert variant="warning" className="mt-3">
                <strong>⚠️ Total Recalculated:</strong> The displayed total has been recalculated from facility details to ensure accuracy. 
                <br />
                <small>
                  Database stored: ${getStoredVsCalculatedTotalMismatch().stored.toFixed(2)} → 
                  Corrected: ${getStoredVsCalculatedTotalMismatch().calculated.toFixed(2)}
                </small>
              </Alert>
            )}

            {/* Booking Timestamps */}
            <Card className="border-0 rounded-0">
              <Card.Body className="bg-light">
                <Row>
                  <Col md={6}>
                    <small className="text-muted">
                      <strong>Booking Created:</strong> {formatDate(bookingData.created_at)}
                    </small>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted">
                      <strong>Last Updated:</strong> {formatDate(bookingData.updated_at)}
                    </small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FacilityBookingReceipt;
