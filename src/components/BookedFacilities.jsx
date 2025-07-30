import React, { useState, useEffect, useCallback } from 'react';
import { Card, Badge, Table, Alert, Spinner, Button, Modal } from 'react-bootstrap';
import { FaSwimmingPool, FaCheckCircle, FaClock, FaTimes, FaEye, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const BookedFacilities = ({ bookingId, showTitle = true, onBookingUpdate }) => {
  const [bookedFacilities, setBookedFacilities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchBookedFacilities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/Project-I/backend/getCustomerFacilityPreferences.php?booking_id=${bookingId}`);
      const data = await response.json();
      
      console.log('BookedFacilities API response:', data);
      
      if (data.success) {
        console.log('Booked facilities data:', data.preference);
        console.log('Passenger name in booked facilities:', data.preference?.passenger_name);
        setBookedFacilities(data.preference);
      } else {
        setError('No facility bookings found for this booking ID.');
      }
    } catch (error) {
      console.error('Error fetching booked facilities:', error);
      setError('Failed to load booked facilities.');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) {
      fetchBookedFacilities();
    }
  }, [bookingId, fetchBookedFacilities]);

  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      const response = await fetch('http://localhost/Project-I/backend/processFacilityBooking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId,
          action: 'cancel',
          selected_facilities: bookedFacilities.selected_facilities,
          quantities: bookedFacilities.quantities,
          total_cost: bookedFacilities.total_cost,
          passenger_email: bookedFacilities.passenger_email,
          passenger_name: bookedFacilities.passenger_name
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Booking cancelled successfully! Email confirmation sent.');
        // Refresh the data
        fetchBookedFacilities();
        setShowCancelModal(false);
        
        // Notify parent component if callback provided
        if (onBookingUpdate) {
          onBookingUpdate('cancelled', data);
        }
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <FaCheckCircle className="me-1" />;
      case 'pending': return <FaClock className="me-1" />;
      case 'cancelled': return <FaTimes className="me-1" />;
      default: return <FaEye className="me-1" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Confirmed & Paid';
      case 'pending': return 'Pending Payment';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 mb-0">Loading booked facilities...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4">
        <Card.Body>
          <Alert variant="info" className="mb-0">
            <FaSwimmingPool className="me-2" />
            {error}
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  if (!bookedFacilities || !bookedFacilities.facility_details || bookedFacilities.facility_details.length === 0) {
    return (
      <Card className="mb-4">
        <Card.Body>
          <Alert variant="info" className="mb-0">
            <FaSwimmingPool className="me-2" />
            No facilities booked yet. Add some exciting facilities to your cruise experience!
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4 shadow-sm">
      {showTitle && (
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <FaSwimmingPool className="me-2" />
            Your Booked Facilities
          </h5>
        </Card.Header>
      )}
      
      <Card.Body>
        {/* Booking Status */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <strong>Booking ID:</strong> {bookedFacilities.booking_id}
            <span className="ms-3">
              <strong>Primary Guest:</strong> {bookedFacilities.passenger_name || 'Guest'}
            </span>
          </div>
          <Badge 
            bg={getStatusColor(bookedFacilities.payment_status)} 
            className="fs-6 px-3 py-2"
          >
            {getStatusIcon(bookedFacilities.payment_status)}
            {getStatusText(bookedFacilities.payment_status)}
          </Badge>
        </div>

        {/* Trip Information */}
        {bookedFacilities.departure_date && (
          <div className="mb-3 p-2 bg-light rounded">
            <strong>Trip Details:</strong>
            <div className="row">
              <div className="col-md-4">
                <small className="text-muted">Departure:</small><br />
                <strong>{new Date(bookedFacilities.departure_date).toLocaleDateString()}</strong>
              </div>
              <div className="col-md-4">
                <small className="text-muted">Return:</small><br />
                <strong>{new Date(bookedFacilities.return_date).toLocaleDateString()}</strong>
              </div>
              <div className="col-md-4">
                <small className="text-muted">Duration:</small><br />
                <strong>{bookedFacilities.trip_duration} days</strong>
              </div>
            </div>
          </div>
        )}

        {/* Facilities Table */}
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-primary">
              <tr>
                <th>Facility</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {bookedFacilities.facility_details.map((facility, index) => (
                <tr key={index}>
                  <td>
                    <strong>{facility.name}</strong>
                  </td>
                  <td className="text-center">
                    <Badge bg="secondary">{facility.quantity}</Badge>
                  </td>
                  <td className="text-end">
                    ${facility.unit_price.toFixed(2)} {facility.unit_text}
                  </td>
                  <td className="text-end">
                    <strong>${facility.total_price.toFixed(2)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-warning">
              <tr>
                <th colSpan="3" className="text-end">Total Amount:</th>
                <th className="text-end">
                  <h5 className="text-primary mb-0">
                    ${parseFloat(bookedFacilities.total_cost).toFixed(2)}
                  </h5>
                </th>
              </tr>
            </tfoot>
          </Table>
        </div>

        {/* Action Buttons for Pending Bookings */}
        {bookedFacilities.payment_status === 'pending' && !bookedFacilities.journey_completed && (
          <div className="mt-3">
            <Alert variant="warning">
              <strong>Payment Required:</strong> Complete your payment to confirm these facilities.
            </Alert>
            <div className="d-flex gap-2 flex-wrap">
              <Button 
                variant="success" 
                size="sm"
                onClick={() => window.location.href = `/facilities/${bookingId}`}
              >
                Complete Payment
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => window.location.href = `/facilities/${bookingId}`}
              >
                Modify Booking
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => setShowCancelModal(true)}
                disabled={cancelLoading}
              >
                <FaTrash className="me-1" />
                Cancel Booking
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons for Confirmed Bookings */}
        {bookedFacilities.payment_status === 'paid' && !bookedFacilities.journey_completed && (
          <div className="mt-3">
            <Alert variant="success">
              <strong>Booking Confirmed:</strong> Your facilities are confirmed and paid for.
            </Alert>
            <div className="d-flex gap-2 flex-wrap">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => window.location.href = `/facilities/${bookingId}`}
              >
                <FaEye className="me-1" />
                View Details
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => setShowCancelModal(true)}
                disabled={cancelLoading}
              >
                <FaTrash className="me-1" />
                Cancel & Refund
              </Button>
            </div>
          </div>
        )}

        {/* Journey Completed Notice */}
        {bookedFacilities.journey_completed && (
          <Alert variant="info" className="mt-3 mb-0">
            <FaCheckCircle className="me-2" />
            <strong>Journey Completed:</strong> Thank you for choosing our facilities! We hope you had a wonderful experience.
          </Alert>
        )}

        {/* Booking Details */}
        <div className="mt-3">
          <small className="text-muted">
            <strong>Booked on:</strong> {new Date(bookedFacilities.created_at).toLocaleString()}
            {bookedFacilities.updated_at !== bookedFacilities.created_at && (
              <>
                <br />
                <strong>Last updated:</strong> {new Date(bookedFacilities.updated_at).toLocaleString()}
              </>
            )}
          </small>
        </div>
      </Card.Body>

      {/* Cancel Booking Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <FaExclamationTriangle className="me-2" />
            Cancel Facility Booking
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <strong>⚠️ Are you sure you want to cancel this booking?</strong>
          </Alert>
          
          <p>This action will:</p>
          <ul>
            <li>❌ Cancel all selected facilities for booking <strong>{bookingId}</strong></li>
            <li>📧 Send a cancellation email confirmation</li>
            {bookedFacilities?.payment_status === 'paid' && (
              <li>💰 Process a refund within 5-7 business days</li>
            )}
            <li>🔄 Allow you to make new facility bookings if needed</li>
          </ul>

          {bookedFacilities?.facility_details && bookedFacilities.facility_details.length > 0 && (
            <div className="mt-3">
              <strong>Facilities to be cancelled:</strong>
              <ul className="mt-2">
                {bookedFacilities.facility_details.map((facility, index) => (
                  <li key={index}>
                    {facility.name} (Quantity: {facility.quantity}) - ${facility.total_price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <div className="text-end">
                <strong>Total Amount: ${parseFloat(bookedFacilities.total_cost).toFixed(2)}</strong>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowCancelModal(false)}
            disabled={cancelLoading}
          >
            Keep Booking
          </Button>
          <Button 
            variant="danger" 
            onClick={handleCancelBooking}
            disabled={cancelLoading}
          >
            {cancelLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Cancelling...
              </>
            ) : (
              <>
                <FaTrash className="me-2" />
                Yes, Cancel Booking
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default BookedFacilities;
