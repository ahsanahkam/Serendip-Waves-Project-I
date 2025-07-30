import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import logo from './assets/logo.png';

const DynamicPricing = () => {
  const [pricing, setPricing] = useState([]);
  const [filteredPricing, setFilteredPricing] = useState([]);
  const [_itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filters, setFilters] = useState({
    shipName: '',
    passengerCount: '',
    poolCount: '',
    deckCount: '',
    restaurantCount: ''
  });
  const [availableShips, setAvailableShips] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [form, setForm] = useState({
    ship_name: '',
    route: '',
    interior_price: '',
    ocean_view_price: '',
    balcony_price: '',
    suite_price: ''
  });

  useEffect(() => {
    fetchPricing();
    fetchItineraries();
  }, []);

  // Filter functionality
  useEffect(() => {
    let filtered = pricing;

    if (filters.shipName) {
      filtered = filtered.filter(item => 
        item.ship_name.toLowerCase().includes(filters.shipName.toLowerCase())
      );
    }

    // Note: The following filters would need corresponding data fields in the backend
    // For now, we'll keep the ship name filter as the primary functional filter
    // Additional filters can be implemented when the backend data structure supports them
    
    setFilteredPricing(filtered);
  }, [filters, pricing]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      shipName: '',
      route: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const fetchItineraries = async () => {
    try {
      const res = await fetch('http://localhost/Project-I/backend/getItineraries.php');
      const data = await res.json();
      setItineraries(data);
    } catch {
      setItineraries([]);
    }
  };

  const fetchPricing = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost/Project-I/backend/getCabinTypePricing.php');
      const data = await res.json();
      if (data.success) {
        setPricing(data.pricing);
        setFilteredPricing(data.pricing);
        // Extract unique ships and routes for filter dropdowns
        const ships = [...new Set(data.pricing.map(item => item.ship_name))];
        const routes = [...new Set(data.pricing.map(item => item.route))];
        setAvailableShips(ships);
        setAvailableRoutes(routes);
      } else {
        setError(data.message || 'Failed to fetch pricing');
      }
    } catch {
      setError('Error fetching pricing');
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost/Project-I/backend/updateCabinTypePricing.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        fetchPricing();
        setShowModal(false);
      } else {
        setError(data.message || 'Failed to update pricing');
      }
    } catch {
      setError('Error updating pricing');
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this pricing item?')) {
      try {
        const res = await fetch('http://localhost/Project-I/backend/deleteCabinTypePricing.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id })
        });
        const data = await res.json();
        if (data.success) {
          fetchPricing();
        } else {
          setError(data.message || 'Failed to delete pricing');
        }
      } catch {
        setError('Error deleting pricing');
      }
    }
  };

  const navigate = (to) => { window.location.href = to; };
  const handleLogoutClick = () => {
    // You can add logout logic here if needed
    navigate('/');
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      {/* Custom Navbar */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2px 2px',
        background: '#fff',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        minHeight: '90px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: '80px', width: 'auto', maxWidth: '100px', cursor: 'pointer', objectFit: 'contain' }}
            onClick={() => navigate('/#top')}
          />
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1a237e', letterSpacing: '1px' }}>
            Dynamic Pricing Management
          </div>
        </div>
        <button
          onClick={handleLogoutClick}
          className="superadmin-logout-btn"
        >
          Logout
        </button>
      </div>
      {/* End Custom Navbar */}
      <div style={{ marginTop: '110px', padding: '2rem' }}>
        {/* Filter Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '20px'
          }}>Filter Pricing</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            alignItems: 'end'
          }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{
                fontWeight: '600',
                color: '#555',
                marginBottom: '8px',
                display: 'block'
              }}>Ship Name</label>
              <select
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s'
                }}
                value={filters.shipName}
                onChange={(e) => handleFilterChange('shipName', e.target.value)}
              >
                <option value="">All Ships</option>
                {availableShips.map(ship => (
                  <option key={ship} value={ship}>{ship}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{
                fontWeight: '600',
                color: '#555',
                marginBottom: '8px',
                display: 'block'
              }}>Route</label>
              <select
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s'
                }}
                value={filters.route}
                onChange={(e) => handleFilterChange('route', e.target.value)}
              >
                <option value="">All Routes</option>
                {availableRoutes.map(route => (
                  <option key={route} value={route}>{route}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{
                fontWeight: '600',
                color: '#555',
                marginBottom: '8px',
                display: 'block'
              }}>Min Price</label>
              <input
                type="number"
                placeholder="Min Price"
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s'
                }}
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{
                fontWeight: '600',
                color: '#555',
                marginBottom: '8px',
                display: 'block'
              }}>Max Price</label>
              <input
                type="number"
                placeholder="Max Price"
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s'
                }}
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'end' }}>
              <Button 
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: '600',
                  color: 'white'
                }}
                onClick={() => {}}
              >
                Filter
              </Button>
              <Button 
                style={{
                  background: '#6c757d',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: '600',
                  color: 'white'
                }}
                onClick={clearFilters}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
        
        <h2>Dynamic Cabin Type Pricing</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button variant="success" className="mb-3" onClick={() => {
          setEditItem(null);
          setForm({ ship_name: '', route: '', interior_price: '', ocean_view_price: '', balcony_price: '', suite_price: '' });
          setShowModal(true);
        }}>
          Add Pricing
        </Button>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Ship Name</th>
                <th>Route</th>
                <th>Interior</th>
                <th>Ocean View</th>
                <th>Balcony</th>
                <th>Suite</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPricing.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.ship_name}</td>
                  <td>{item.route}</td>
                  <td>{item.interior_price}</td>
                  <td>{item.ocean_view_price}</td>
                  <td>{item.balcony_price}</td>
                  <td>{item.suite_price}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'white',
                          color: '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.2s ease',
                          padding: '8px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                        }}
                        title="Edit"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'white',
                          color: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.2s ease',
                          padding: '8px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                        }}
                        title="Delete"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editItem ? 'Edit Pricing' : 'Add Pricing'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Ship Name</Form.Label>
                <Form.Control
                  type="text"
                  name="ship_name"
                  value={form.ship_name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Route</Form.Label>
                <Form.Control
                  type="text"
                  name="route"
                  value={form.route}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Interior Price</Form.Label>
                <Form.Control
                  type="number"
                  name="interior_price"
                  value={form.interior_price}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ocean View Price</Form.Label>
                <Form.Control
                  type="number"
                  name="ocean_view_price"
                  value={form.ocean_view_price}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Balcony Price</Form.Label>
                <Form.Control
                  type="number"
                  name="balcony_price"
                  value={form.balcony_price}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Suite Price</Form.Label>
                <Form.Control
                  type="number"
                  name="suite_price"
                  value={form.suite_price}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default DynamicPricing;
