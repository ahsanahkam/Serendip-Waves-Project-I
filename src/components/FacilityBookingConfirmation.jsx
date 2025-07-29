import React, { useState } from 'react';
import { Modal, Button, Alert, Table, Badge, Spinner } from 'react-bootstrap';
import { FaCreditCard, FaSave, FaTimes, FaCheckCircle } from 'react-icons/fa';

const FacilityBookingConfirmation = ({ 
  show, 
  onHide, 
  bookingId, 
  passengerEmail, 
  passengerName,
  selectedFacilities, 
  quantities, 
  facilities,
  totalCost,
  onBookingComplete 
}) => {
  console.log('FacilityBookingConfirmation props:', { bookingId, passengerName, passengerEmail });
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState('');

  // Get selected facility details using dynamic facilities data
  const facilityDetails = Object.keys(selectedFacilities)
    .filter(key => selectedFacilities[key])
    .map(facilityCode => {
      const facility = facilities[facilityCode];
      if (!facility) {
        console.error(`Facility not found for code: ${facilityCode}`);
        return null;
      }
      
      const quantity = quantities[facilityCode] || 1;
      
      // Direct calculation - quantity represents days for paid facilities
      let quantityText = '';
      
      if (facility.price === 0) {
        quantityText = 'Free Access';
      } else {
        quantityText = `${quantity} day${quantity > 1 ? 's' : ''}`;
      }
      
      const totalPrice = facility.price * quantity;
      
      return {
        code: facilityCode,
        name: facility.name,
        quantity: quantity,
        quantityText: quantityText,
        unitPrice: facility.price,
        totalPrice,
        unit: facility.unit || 'access',
        unitText: facility.unitText || (facility.price > 0 ? `per ${facility.unit || 'access'}` : 'Free')
      };
    })
    .filter(detail => detail !== null); // Remove null entries

  const handleAction = async (action) => {
    setLoading(true);
    setActionType(action);

    try {
      const response = await fetch('http://localhost/Project-I/backend/processFacilityBooking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId,
          action: action,
          selected_facilities: selectedFacilities,
          quantities: quantities,
          total_cost: totalCost,
          passenger_email: passengerEmail,
          passenger_name: passengerName
        })
      });

      const data = await response.json();

      if (data.success) {
        // Show success message based on action
        let successMessage = '';
        switch (action) {
          case 'confirm':
            successMessage = '✅ Payment confirmed! Email confirmation sent.';
            break;
          case 'save_pending':
            successMessage = '💾 Booking saved as pending! Email notification sent.';
            break;
          case 'cancel':
            successMessage = '❌ Booking cancelled! Email notification sent.';
            break;
        }

        alert(successMessage);
        
        // Call parent callback to refresh data
        if (onBookingComplete) {
          onBookingComplete(action, data);
        }
        
        // Hide modal after a delay to let user see the success message
        setTimeout(() => {
          onHide();
        }, 2000);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to process booking. Please try again.');
    } finally {
      setLoading(false);
      setActionType('');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FaCheckCircle className="me-2" />
          Confirm Facility Booking
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="info">
          <h5>🎢 Do you want to add these facilities to your booking?</h5>
          <p className="mb-0">
            <strong>Booking ID:</strong> {bookingId} | 
            <strong> Passenger:</strong> {passengerName}
          </p>
        </Alert>

        {/* Facility Details Table */}
        <div className="mb-4">
          <h6>📋 Selected Facilities:</h6>
          <Table striped bordered hover size="sm">
            <thead className="table-primary">
              <tr>
                <th>Facility</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {facilityDetails.map((facility, index) => (
                <tr key={index}>
                  <td>{facility.name}</td>
                  <td className="text-center">
                    <Badge bg="secondary">{facility.quantityText}</Badge>
                  </td>
                  <td className="text-end">
                    {facility.unitText}
                  </td>
                  <td className="text-end">
                    <strong>${facility.totalPrice.toFixed(2)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-warning">
              <tr>
                <th colSpan="3">Total Amount:</th>
                <th className="text-end">
                  <h5 className="text-primary mb-0">
                    ${totalCost.toFixed(2)}
                  </h5>
                </th>
              </tr>
            </tfoot>
          </Table>
        </div>

        {/* Email Notification Info */}
        <Alert variant="light">
          <small>
            📧 An email confirmation will be sent to: <strong>{passengerEmail}</strong>
          </small>
        </Alert>

        {/* Action Buttons */}
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <Button
            variant="success"
            size="lg"
            onClick={() => handleAction('confirm')}
            disabled={loading}
            className="me-md-2"
          >
            {loading && actionType === 'confirm' ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              <FaCreditCard className="me-2" />
            )}
            Pay Now ${totalCost.toFixed(2)}
          </Button>

          <Button
            variant="warning"
            size="lg"
            onClick={() => handleAction('save_pending')}
            disabled={loading}
            className="me-md-2"
          >
            {loading && actionType === 'save_pending' ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              <FaSave className="me-2" />
            )}
            Save as Pending
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onHide}
            disabled={loading}
          >
            Close
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-3">
          <small className="text-muted">
            <strong>Note:</strong> 
            <ul className="mt-2">
              <li><strong>Pay Now:</strong> Confirms and processes payment immediately</li>
              <li><strong>Save as Pending:</strong> Saves your selection for later payment</li>
            </ul>
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default FacilityBookingConfirmation;
