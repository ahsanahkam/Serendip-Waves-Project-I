import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';

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

  return (
    <div style={{ padding: '2rem' }}>
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
              <th>Suite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pricing.map((item) => (
              <tr key={item.id}>
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
            {!editItem && (
              <>
                <Form.Group controlId="formShipName">
                  <Form.Label>Ship Name</Form.Label>
                  <Form.Select name="ship_name" value={form.ship_name} onChange={handleChange} required>
                    <option value="">Select Ship</option>
                    {[...new Set(itineraries.map(i => i.ship_name))].map(ship => (
                      <option key={ship} value={ship}>{ship}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="formRoute">
                  <Form.Label>Route</Form.Label>
                  <Form.Select name="route" value={form.route} onChange={handleChange} required>
                    <option value="">Select Route</option>
                    {itineraries.filter(i => i.ship_name === form.ship_name).map(i => (
                      <option key={i.route} value={i.route}>{i.route}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </>
            )}
            {editItem && (
              <>
                <Form.Group controlId="formShipName">
                  <Form.Label>Ship Name</Form.Label>
                  <Form.Control type="text" name="ship_name" value={form.ship_name} readOnly />
                </Form.Group>
                <Form.Group controlId="formRoute">
                  <Form.Label>Route</Form.Label>
                  <Form.Control type="text" name="route" value={form.route} readOnly />
                </Form.Group>
              </>
            )}
            <Form.Group controlId="formInterior">
              <Form.Label>Interior Price</Form.Label>
              <Form.Control type="number" name="interior_price" value={form.interior_price} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formOceanView">
              <Form.Label>Ocean View Price</Form.Label>
              <Form.Control type="number" name="ocean_view_price" value={form.ocean_view_price} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formBalcony">
              <Form.Label>Balcony Price</Form.Label>
              <Form.Control type="number" name="balcony_price" value={form.balcony_price} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formSuite">
              <Form.Label>Suite Price</Form.Label>
              <Form.Control type="number" name="suit_price" value={form.suit_price} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={async () => {
            if (editItem) {
              await handleSave();
            } else {
              // Add new pricing
              try {
                const res = await fetch('http://localhost/Project-I/backend/addCabinTypePricing.php', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(form)
                });
                const data = await res.json();
                if (data.success) {
                  fetchPricing();
                  setShowModal(false);
                } else {
                  setError(data.message || 'Failed to add pricing');
                }
              } catch (err) {
                setError('Error adding pricing');
              }
            }
          }}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DynamicPricing;
