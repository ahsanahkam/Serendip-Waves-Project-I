import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import logo from './assets/logo.png';

const DynamicPricing = () => {
  const [pricing, setPricing] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    ship_name: '',
    route: '',
    interior_price: '',
    ocean_view_price: '',
    balcony_price: '',
    suit_price: ''
  });

  useEffect(() => {
    fetchPricing();
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const res = await fetch('http://localhost/Project-I/backend/getItineraries.php');
      const data = await res.json();
      setItineraries(data);
    } catch (err) {
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
      } else {
        setError(data.message || 'Failed to fetch pricing');
      }
    } catch (err) {
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
    } catch (err) {
      setError('Error updating pricing');
    }
  };

  const navigate = (to) => { window.location.href = to; };
  const handleLogoutClick = () => {
    // You can add logout logic here if needed
    navigate('/');
  };

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh' }}>
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
        <h2>Dynamic Cabin Type Pricing</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button variant="success" className="mb-3" onClick={() => {
          setEditItem(null);
          setForm({ ship_name: '', route: '', interior_price: '', ocean_view_price: '', balcony_price: '', suit_price: '' });
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
                <th>Suit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.ship_name}</td>
                  <td>{item.route}</td>
                  <td>{item.interior_price}</td>
                  <td>{item.ocean_view_price}</td>
                  <td>{item.balcony_price}</td>
                  <td>{item.suit_price}</td>
                  <td>
                    <Button variant="primary" size="sm" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>
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
                <Form.Label>Suit Price</Form.Label>
                <Form.Control
                  type="number"
                  name="suit_price"
                  value={form.suit_price}
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
