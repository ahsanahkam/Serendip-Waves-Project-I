import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Button, Form, Modal, Alert, Badge, Image } from 'react-bootstrap';
import { FaSwimmingPool, FaPlus, FaEdit, FaTrash, FaArrowLeft, FaImage } from 'react-icons/fa';

function FacilityManagement() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFacility, setCurrentFacility] = useState({
    facility_id: null,
    facility: '',
    about: '',
    image: '',
    unit_price: '',
    status: 'active'
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [imagePreview, setImagePreview] = useState('');

  // Determine the back navigation based on URL params or localStorage
  const getBackNavigation = () => {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    
    if (from) {
      return `/${from}`;
    }
    
    // Check localStorage as fallback
    const storedFrom = localStorage.getItem('facilityManagementFrom');
    if (storedFrom) {
      localStorage.removeItem('facilityManagementFrom'); // Clean up
      return storedFrom;
    }
    
    // Check referrer as last resort
    const referrer = document.referrer;
    if (referrer.includes('/super-admin')) {
      return '/super-admin';
    } else if (referrer.includes('/facilities-dashboard')) {
      return '/facilities-dashboard';
    }
    
    // Default fallback
    return '/admin-dashboard';
  };

  const fetchFacilities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/Project-I/backend/manageFacilities.php');
      const data = await response.json();
      
      if (data.success) {
        // Process facilities to add full image URLs
        const processedFacilities = data.facilities.map(facility => ({
          ...facility,
          image: facility.image ? `http://localhost/Project-I/backend/${facility.image}` : null
        }));
        setFacilities(processedFacilities);
      } else {
        showAlert('Failed to load facilities', 'danger');
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
      showAlert('Error loading facilities', 'danger');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleAddNew = () => {
    setCurrentFacility({
      facility_id: null,
      facility: '',
      about: '',
      image: '',
      unit_price: '',
      status: 'active'
    });
    setImagePreview('');
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (facility) => {
    // Store the original facility data including the full image URL
    const originalFacility = {
      ...facility,
      about: facility.about || '',
      image: facility.image || ''
    };
    
    // For editing, we need to separate the display URL from the data we send to backend
    setCurrentFacility({
      ...originalFacility,
      // Store the relative path for backend (remove the base URL)
      image: facility.image ? facility.image.replace('http://localhost/Project-I/backend/', '') : ''
    });
    
    // For editing, show the image preview if it exists (use full URL for display)
    if (facility.image) {
      setImagePreview(facility.image);
    } else {
      setImagePreview('');
    }
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeactivate = async (facilityId) => {
    if (window.confirm('Are you sure you want to deactivate this facility? It will no longer be available for booking.')) {
      try {
        const response = await fetch('http://localhost/Project-I/backend/manageFacilities.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            facility_id: facilityId,
            status: 'inactive'
          })
        });
        const data = await response.json();
        
        if (data.success) {
          showAlert('Facility deactivated successfully', 'success');
          fetchFacilities();
        } else {
          showAlert(data.message || 'Failed to deactivate facility', 'danger');
        }
      } catch (error) {
        console.error('Error deactivating facility:', error);
        showAlert('Error deactivating facility', 'danger');
      }
    }
  };

  const handleReactivate = async (facilityId) => {
    if (window.confirm('Are you sure you want to reactivate this facility? It will become available for booking again.')) {
      try {
        const response = await fetch('http://localhost/Project-I/backend/manageFacilities.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            facility_id: facilityId,
            status: 'active'
          })
        });
        const data = await response.json();
        
        if (data.success) {
          showAlert('Facility reactivated successfully', 'success');
          fetchFacilities();
        } else {
          showAlert(data.message || 'Failed to reactivate facility', 'danger');
        }
      } catch (error) {
        console.error('Error reactivating facility:', error);
        showAlert('Error reactivating facility', 'danger');
      }
    }
  };

  const handleSave = async () => {
    if (!currentFacility.facility || !currentFacility.unit_price) {
      showAlert('Please fill in all required fields', 'warning');
      return;
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      
      // Prepare data for backend
      const facilityData = {
        ...currentFacility
      };
      
      // If we're editing and the image hasn't changed (no base64), send the relative path
      if (isEditing && currentFacility.image && !currentFacility.image.startsWith('data:')) {
        // Keep the relative path as is
        facilityData.image = currentFacility.image;
      }
      
      const response = await fetch('http://localhost/Project-I/backend/manageFacilities.php', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showAlert(isEditing ? 'Facility updated successfully' : 'Facility added successfully', 'success');
        setShowModal(false);
        fetchFacilities();
      } else {
        showAlert(data.message || 'Operation failed', 'danger');
      }
    } catch (error) {
      console.error('Error saving facility:', error);
      showAlert('Error saving facility', 'danger');
    }
  };

  const getStatusBadge = (status) => {
    return (
      <Badge bg={status === 'active' ? 'success' : 'danger'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Button 
              variant="light" 
              size="sm" 
              className="me-3"
              onClick={() => navigate(getBackNavigation())}
            >
              <FaArrowLeft className="me-1" />
              Back to Dashboard
            </Button>
            <FaSwimmingPool className="me-2" size={24} />
            <h4 className="mb-0">Facility Management</h4>
          </div>
          <Button variant="light" onClick={handleAddNew}>
            <FaPlus className="me-1" />
            Add New Facility
          </Button>
        </Card.Header>

        <Card.Body>
          {alert.show && (
            <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: '' })}>
              {alert.message}
            </Alert>
          )}

          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Facility Name</th>
                <th>Image</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No facilities found
                  </td>
                </tr>
              ) : (
                facilities.map((facility, index) => (
                  <tr key={facility.facility_id} className={facility.status === 'inactive' ? 'table-secondary text-muted' : ''}>
                    <td>{index + 1}</td>
                    <td>{facility.facility}</td>
                    <td>
                      {facility.image && (
                        <img 
                          src={facility.image} 
                          alt={facility.facility} 
                          style={{ 
                            width: 60, 
                            height: 40, 
                            objectFit: 'cover', 
                            borderRadius: 6 
                          }} 
                        />
                      )}
                    </td>
                    <td>${parseFloat(facility.unit_price).toFixed(2)}</td>
                    <td>{getStatusBadge(facility.status)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(facility)}
                      >
                        <FaEdit />
                      </Button>
                      {facility.status === 'active' ? (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleDeactivate(facility.facility_id)}
                          title="Deactivate facility"
                        >
                          <FaTrash />
                        </Button>
                      ) : (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleReactivate(facility.facility_id)}
                          title="Reactivate facility"
                        >
                          <i className="fas fa-undo"></i>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <div className="mt-3 text-muted">
            Total Facilities: {facilities.length}
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Edit Facility' : 'Add New Facility'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Facility Name *</Form.Label>
              <Form.Control
                type="text"
                value={currentFacility.facility}
                onChange={(e) => setCurrentFacility({
                  ...currentFacility,
                  facility: e.target.value
                })}
                placeholder="Enter facility name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>About</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentFacility.about}
                onChange={(e) => setCurrentFacility({
                  ...currentFacility,
                  about: e.target.value
                })}
                placeholder="Enter facility description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const imageUrl = event.target.result;
                      setCurrentFacility({
                        ...currentFacility,
                        image: imageUrl
                      });
                      setImagePreview(imageUrl);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    // If file input is cleared, keep the original image for editing
                    if (isEditing && currentFacility.image && !currentFacility.image.startsWith('data:')) {
                      // Keep the existing image preview
                      setImagePreview(`http://localhost/Project-I/backend/${currentFacility.image}`);
                    } else {
                      setImagePreview('');
                    }
                  }
                }}
              />
              
              {/* Clear image button */}
              {imagePreview && (
                <div className="mt-2 d-flex justify-content-between align-items-start">
                  <div>
                    <Form.Label className="form-label small">Image Preview:</Form.Label>
                    <div>
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        width="150" 
                        height="150" 
                        rounded 
                        style={{ 
                          objectFit: 'cover',
                          border: '2px solid #dee2e6'
                        }}
                        onError={() => setImagePreview('')}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => {
                      setCurrentFacility({
                        ...currentFacility,
                        image: ''
                      });
                      setImagePreview('');
                      // Clear the file input
                      const fileInput = document.querySelector('input[type="file"]');
                      if (fileInput) fileInput.value = '';
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit Price *</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={currentFacility.unit_price}
                onChange={(e) => setCurrentFacility({
                  ...currentFacility,
                  unit_price: e.target.value
                })}
                placeholder="Enter unit price"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={currentFacility.status}
                onChange={(e) => setCurrentFacility({
                  ...currentFacility,
                  status: e.target.value
                })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditing ? 'Update' : 'Add'} Facility
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FacilityManagement;
