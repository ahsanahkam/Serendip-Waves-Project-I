import React, { useEffect, useState } from 'react';
import './ItineraryDetails.css';
import logo from './assets/logo.png';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost/Project-I/backend';

const initialForm = {
  description: '',
  schedule: '',
  image1: null,
  image2: null,
  image3: null,
  image4: null,
  image5: null,
  destination: '',
};

const ItineraryDetails = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [itineraries, setItineraries] = useState([]); // Store all itineraries
  const navigate = useNavigate();

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/getItineraryDetails.php`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDetails(data);
    } catch (err) {
      setError('Error fetching itinerary details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available destinations (arrival countries) from itineraries
  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${API_BASE}/getItineraries.php`);
      if (!res.ok) throw new Error('Failed to fetch itineraries');
      const data = await res.json();
      setItineraries(data); // Store all itineraries
      const uniqueDest = [...new Set(data.map(item => item.route).filter(Boolean))];
      setDestinations(uniqueDest);
    } catch (err) {
      setDestinations([]);
      setItineraries([]);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchDestinations();
  }, []);

  const handleInputChange = e => {
    const { name, value, files } = e.target;
    if (files) {
      setForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Find itinerary_id for selected destination
    const itinerary = itineraries.find(it => it.route === form.destination);
    if (!itinerary) {
      setError('Selected destination does not match any itinerary.');
      return;
    }
    const endpoint = editId ? 'updateItineraryDetail.php' : 'addItineraryDetail.php';
    const formData = new FormData();
    formData.append('itinerary_id', itinerary.id); // Always set itinerary_id
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'itinerary_id' && value !== null && value !== '') formData.append(key, value);
    });
    if (editId) formData.append('detail_id', editId);
    setEditLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(editId ? 'Detail updated!' : 'Detail added!');
        setForm(initialForm);
        setEditId(null);
        setShowModal(false);
        fetchDetails();
      } else {
        setError(data.message || 'Error saving detail');
      }
    } catch (err) {
      setError('Error saving detail');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEdit = detail => {
    setEditId(detail.detail_id);
    setForm({
      itinerary_id: detail.itinerary_id,
      description: detail.description,
      schedule: detail.schedule,
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      destination: detail.destination, // Set destination from detail
    });
    setSuccess('');
    setError('');
    setShowModal(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this itinerary detail?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/deleteItineraryDetail.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ detail_id: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Detail deleted!');
        fetchDetails();
      } else {
        setError(data.message || 'Error deleting detail');
      }
    } catch (err) {
      setError('Error deleting detail');
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm(initialForm);
    setSuccess('');
    setError('');
    setShowModal(false);
  };

  const handleAddDetail = () => {
    setEditId(null);
    setForm(initialForm);
    setSuccess('');
    setError('');
    setShowModal(true);
  };

  return (
    <div className="itinerary-dashboard-bg">
      <div className="itinerary-container">
        <div className="itinerary-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <img
              src={logo}
              alt="Logo"
              style={{ height: '90px', width: 'auto', maxWidth: '90px', cursor: 'pointer', objectFit: 'contain' }}
            />
            <div className="itinerary-title">Itinerary Details Management</div>
          </div>
          <div className="admin-info">
            <div className="admin-name">Super Admin</div>
            <div className="admin-role">Administrator</div>
          </div>
        </div>
        <div className="table-section">
          <div className="table-header">
            <div className="table-title">Itinerary Details</div>
            <button className="add-btn" type="button" onClick={handleAddDetail}>Add Detail</button>
            <button onClick={fetchDetails} className="add-btn" type="button" style={{ marginLeft: 10 }}>Refresh</button>
          </div>
          {loading && <div style={{ padding: 18 }}>Loading...</div>}
          <div className="itinerary-details-table-container">
            <table className="itinerary-details-table itinerary-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Image 1</th>
                  <th>Image 2</th>
                  <th>Image 3</th>
                  <th>Image 4</th>
                  <th>Image 5</th>
                  <th>Schedule</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {details.length === 0 ? (
                  <tr><td colSpan={10} style={{ textAlign: 'center', padding: 24 }}>No details found.</td></tr>
                ) : (
                  details.map((detail, idx) => (
                    <tr key={idx}>
                      <td>
                        <span
                          style={{ color: '#1e3a8a', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
                          onClick={() => navigate(`/destination/${encodeURIComponent(detail.destination.toLowerCase())}`, { state: { destination: detail } })}
                        >
                          {detail.destination}
                        </span>
                      </td>
                      {[1,2,3,4,5].map(i => (
                        <td key={i}>
                          {detail[`image${i}`] ? (
                            <img src={`http://localhost/Project-I/backend/${detail[`image${i}`]}`} alt={`img${i}`} />
                          ) : '-' }
                        </td>
                      ))}
                      <td style={{ maxWidth: 200, whiteSpace: 'pre-wrap' }}>{detail.schedule}</td>
                      <td className="action-buttons">
                        <button className="icon-btn edit-btn" onClick={() => handleEdit(detail)} title="Edit"><span role="img" aria-label="Edit">✏️</span></button>
                        <button className="icon-btn delete-btn" onClick={() => handleDelete(detail.detail_id)} title="Delete"><span role="img" aria-label="Delete">🗑️</span></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Modal show={showModal} onHide={handleCancelEdit} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit' : 'Add'} Itinerary Detail</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="form-group">
                    <Form.Label>Destination*</Form.Label>
                    <Form.Select name="destination" value={form.destination} onChange={handleInputChange} required>
                      <option value="">Select destination</option>
                      {destinations.map(dest => (
                        <option key={dest} value={dest}>{dest}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="form-group">
                    <Form.Label>Description*</Form.Label>
                    <Form.Control as="textarea" name="description" value={form.description} onChange={handleInputChange} required rows={2} />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Form.Group className="form-group">
                    <Form.Label>Schedule</Form.Label>
                    <Form.Control as="textarea" name="schedule" value={form.schedule} onChange={handleInputChange} rows={2} />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                {[1,2,3,4,5].map(i => (
                  <div className="col-md-4" key={i} style={{ marginBottom: 12 }}>
                    <Form.Group className="form-group">
                      <Form.Label>Image {i}</Form.Label>
                      <Form.Control type="file" name={`image${i}`} accept="image/*" onChange={handleInputChange} />
                    </Form.Group>
                  </div>
                ))}
              </div>
              {success && <div className="itinerary-details-success">{success}</div>}
              {error && <div className="itinerary-details-error">{error}</div>}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={editLoading}>
              {editId ? 'Update Detail' : 'Add Detail'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ItineraryDetails; 