import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { FaSwimmingPool, FaDownload, FaFilter, FaArrowLeft } from 'react-icons/fa';
import logo from './assets/logo.png';
import './FacilitiesDashboard.css';

function FacilitiesDashboard() {
  const navigate = useNavigate();
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    passengerName: '',
    bookingId: '',
    facility: '',
    status: ''
  });

  // Determine the back navigation based on URL params or referrer
  const getBackNavigation = () => {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    
    if (from) {
      return `/${from}`;
    }
    
    // Check referrer as fallback
    const referrer = document.referrer;
    if (referrer.includes('/super-admin')) {
      return '/super-admin';
    } else if (referrer.includes('/admin-dashboard')) {
      return '/admin-dashboard';
    }
    
    // Default fallback
    return '/super-admin';
  };

  useEffect(() => {
    fetchFacilitiesData();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = facilitiesData;

    if (filters.passengerName) {
      filtered = filtered.filter(item => 
        item.passengerName.toLowerCase().includes(filters.passengerName.toLowerCase())
      );
    }

    if (filters.bookingId) {
      filtered = filtered.filter(item => 
        item.bookingId.toLowerCase().includes(filters.bookingId.toLowerCase())
      );
    }

    if (filters.facility) {
      filtered = filtered.filter(item => 
        item.facilities.some(facility => 
          facility.toLowerCase().includes(filters.facility.toLowerCase())
        )
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => 
        item.status === filters.status
      );
    }

    setFilteredData(filtered);
  }, [facilitiesData, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchFacilitiesData = async () => {
    try {
      const response = await fetch('http://localhost/Project-I/backend/getAllFacilityPreferences.php');
      const data = await response.json();
      
      if (data.success && data.preferences) {
        // Transform the data to match expected structure
        const transformedData = data.preferences.map((pref, index) => {
          const facilities = [];
          
          // Use facility_details from API response if available
          if (pref.facility_details && Array.isArray(pref.facility_details)) {
            pref.facility_details.forEach(facility => {
              facilities.push({
                name: facility.name,
                quantity: facility.unit_price === 0 ? 'Free Access' : `${facility.quantity} ${facility.unit === 'hour' ? 'hours' : facility.unit === 'event' ? 'events' : 'days'}`,
                cost: facility.total_price || 0
              });
            });
          } else {
            // Fallback to manual mapping if facility_details not available
            const selectedFacilities = pref.selected_facilities || {};
            const quantities = pref.quantities || {};
            
            // Updated facility mapping to match API codes
            const facilityInfo = {
              'spa_and_wellness_center': { name: 'Spa and Wellness Center', price: 50 },
              'water_sports_pass': { name: 'Water Sports Pass', price: 30 },
              'casino_entry_pass': { name: 'Casino Entry Pass', price: 25 },
              'babysitting_services': { name: 'Babysitting Services', price: 20 },
              'private_partyevent_hall': { name: 'Private Party/Event Hall', price: 200 },
              'translator_support': { name: 'Translator Support', price: 50 },
              'fitness_center': { name: 'Fitness Center', price: 0 },
              'cinema_and_openair_movies': { name: 'Cinema & Open-Air Movies', price: 15 },
              'kids_club_and_play_area': { name: "Kids' Club & Play Area", price: 0 }
            };
            
            Object.keys(selectedFacilities).forEach(facilityId => {
              if (selectedFacilities[facilityId] && facilityInfo[facilityId]) {
                const quantity = quantities[facilityId] || 1;
                const unitPrice = facilityInfo[facilityId].price;
                facilities.push({
                  name: facilityInfo[facilityId].name,
                  quantity: facilityInfo[facilityId].price === 0 ? 'Free Access' : `${quantity} ${facilityId.includes('hour') ? 'hours' : facilityId.includes('event') ? 'events' : 'days'}`,
                  cost: unitPrice * quantity
                });
              }
            });
          }
          
          return {
            id: index + 1,
            passengerName: pref.passenger_name || 'Unknown',
            bookingId: pref.booking_id,
            facilities: facilities,
            totalCost: pref.total_cost || 0,
            paymentStatus: pref.payment_status || 'pending',
            status: pref.status || 'pending'
          };
        });
        setFacilitiesData(transformedData);
      } else {
        setFacilitiesData([]);
      }
    } catch (error) {
      console.error('Failed to fetch facilities data:', error);
      setFacilitiesData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { bg: 'warning', text: 'Pending' },
      'paid': { bg: 'success', text: 'Paid' },
      'cancelled': { bg: 'danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: 'Unknown' };
    return (
      <Badge bg={config.bg}>
        {config.text}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = ['Passenger Name', 'Booking ID', 'Facilities', 'Quantities', 'Individual Costs', 'Status', 'Total Cost'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.passengerName,
        item.bookingId,
        item.facilities.map(f => f.name).join('; '),
        item.facilities.map(f => f.quantity).join('; '),
        item.facilities.map(f => `$${f.cost}`).join('; '),
        item.status,
        item.totalCost
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'facility-preferences.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading facilities data...</div>;
  }

  return (
    <div className="facilities-dashboard">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center">
            <img src={logo} alt="Logo" width="40" height="40" className="me-3" />
            <span className="navbar-brand mb-0 h1 fw-bold text-dark">Facilities Dashboard</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={() => navigate(getBackNavigation())}
              className="me-2"
            >
              <FaArrowLeft className="me-1" />
              Back to Dashboard
            </Button>
            <Button 
              variant="info" 
              size="sm"
              onClick={() => navigate('/facility-management?from=facilities-dashboard')}
              className="me-2"
            >
              <FaSwimmingPool className="me-1" />
              Manage Facilities
            </Button>
            <Button 
              variant="success" 
              size="sm"
              onClick={exportToCSV}
            >
              <FaDownload className="me-1" />
              Export CSV
            </Button>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        <Card className="shadow-lg">
          <Card.Header className="bg-info text-white">
            <div className="d-flex justify-content-center align-items-center">
              <h2 className="mb-0">
                <FaSwimmingPool className="me-2" />
                Facilities Dashboard
              </h2>
            </div>
          </Card.Header>
          
          <Card.Body>
            {/* Filters */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <FaFilter className="me-2" />
                  Filters
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Passenger Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Search by name..."
                        value={filters.passengerName}
                        onChange={(e) => handleFilterChange('passengerName', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Booking ID</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Search by booking ID..."
                        value={filters.bookingId}
                        onChange={(e) => handleFilterChange('bookingId', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Facility</Form.Label>
                      <Form.Select
                        value={filters.facility}
                        onChange={(e) => handleFilterChange('facility', e.target.value)}
                      >
                        <option value="">All Facilities</option>
                        <option value="Spa and Wellness Center">Spa and Wellness Center</option>
                        <option value="Private Party/Event Hall">Private Party/Event Hall</option>
                        <option value="Babysitting Services">Babysitting Services</option>
                        <option value="Fitness Center">Fitness Center</option>
                        <option value="Cinema/Open Air">Cinema/Open Air</option>
                        <option value="Game Zone/Arcade">Game Zone/Arcade</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Data Table */}
            <div className="table-responsive">
              <Table striped bordered hover className="facilities-table">
                <thead className="table-info">
                  <tr>
                    <th>Passenger Name</th>
                    <th>Booking ID</th>
                    <th>Facilities</th>
                    <th>Status</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No facility preferences found
                      </td>
                    </tr>
                  ) : (
                    filteredData.map(item => (
                      <tr key={item.id}>
                        <td>{item.passengerName}</td>
                        <td>
                          <Badge bg="secondary">{item.bookingId}</Badge>
                        </td>
                        <td>
                          <div className="facilities-list">
                            {item.facilities.map((facility, index) => (
                              <div key={index} className="facility-item mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <Badge 
                                      bg={facility.cost === 0 ? 'success' : 'primary'}
                                      className="facility-name-badge me-2"
                                    >
                                      {facility.name}
                                    </Badge>
                                    <Badge bg="outline-dark" className="quantity-badge">
                                      {facility.quantity}
                                    </Badge>
                                  </div>
                                  <div className="facility-cost">
                                    {facility.cost === 0 ? (
                                      <Badge bg="success">FREE</Badge>
                                    ) : (
                                      <span className="fw-bold text-primary">${facility.cost}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="text-center">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="text-end fw-bold">
                          <div className="total-cost-cell">
                            <Badge bg="dark" className="total-badge">
                              Total: ${item.totalCost}
                            </Badge>
                            <div className="mt-1">
                              <small className="text-muted">
                                {item.facilities.length} facility{item.facilities.length !== 1 ? 'ies' : ''}
                              </small>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default FacilitiesDashboard;