import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./App";
import logo from './assets/logo.png';

const cabinTypes = ["Interior", "Ocean View", "Balcony", "Suit"];
const dietaryOptions = ["None", "Vegetarian", "Vegan", "Gluten-Free", "Kosher", "Halal"];
const addOns = [
  { label: "Snorkeling Excursion", value: "snorkeling" },
  { label: "City Tour", value: "citytour" },
  { label: "Spa Package", value: "spa" },
  { label: "Private Dining", value: "dining" }
];

const steps = ["Add details", "Passenger details", "Payment"];

// Cabin prices for adults and children
const CABIN_PRICES = {
  "Interior": { adult: 500, child: 250 },
  "Ocean View": { adult: 1000, child: 500 },
  "Balcony": { adult: 2000, child: 1000 },
  "Suit": { adult: 4000, child: 2000 }
};

const BookingModal = ({ isOpen, onClose, defaultCountry }) => {
  const { currentUser } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    adults: 1,
    children: 0,
    cabinType: "",
    destination: "",
    cardType: "Visa",
    cardNumber: "",
    expiry: "",
    cvv: "",
    special_requests: "",
    // Primary passenger (adult)
    primaryPassenger: {
      fullName: currentUser?.full_name || "",
      gender: currentUser?.gender || "",
      citizenship: "",
      email: currentUser?.email || "",
      age: "",
      isChild: false
    },
    // Additional passengers (adults and children)
    additionalPassengers: []
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [guestCountError, setGuestCountError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [cabinNumber, setCabinNumber] = useState("");
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [itineraries, setItineraries] = useState([]);

  // Initialize additional passengers when adults/children change
  useEffect(() => {
    const totalPassengers = form.adults + form.children;
    const currentPassengers = form.additionalPassengers.length;
    
    if (totalPassengers - 1 > currentPassengers) {
      // Add new passengers
      const newPassengers = Array(totalPassengers - 1 - currentPassengers).fill().map((_, i) => ({
        fullName: "",
        gender: "",
        citizenship: "",
        age: "",
        isChild: i >= (form.adults - 1) // Mark as child if beyond adult count
      }));
      setForm(prev => ({
        ...prev,
        additionalPassengers: [...prev.additionalPassengers, ...newPassengers]
      }));
    } else if (totalPassengers - 1 < currentPassengers) {
      // Remove extra passengers
      setForm(prev => ({
        ...prev,
        additionalPassengers: prev.additionalPassengers.slice(0, totalPassengers - 1)
      }));
    }
  }, [form.adults, form.children]);

  // Fetch itineraries and extract unique destinations
  useEffect(() => {
    if (!isOpen) return;
    fetch('http://localhost/Project-I/backend/getItineraries.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItineraries(data);
          const uniqueDest = [...new Set(data.map(item => item.route).filter(Boolean))];
          setAvailableDestinations(uniqueDest);
        } else {
          setAvailableDestinations([]);
        }
      })
      .catch(() => setAvailableDestinations([]));
  }, [isOpen]);

  const getShipNameForDestination = (destination) => {
    const itinerary = itineraries.find(item => item.route === destination);
    return itinerary ? itinerary.ship_name : '';
  };

  const getItineraryForDestination = (destination) => {
    return itineraries.find(item => item.route === destination);
  };

  const getTotalPrice = () => {
    const { cabinType, adults, children } = form;
    if (!cabinType || !CABIN_PRICES[cabinType]) return 0;
    const price = CABIN_PRICES[cabinType];
    return (Number(adults) * price.adult) + (Number(children) * price.child);
  };

  useEffect(() => {
    if (isOpen && defaultCountry && !form.destination) {
      setForm(prev => ({ ...prev, destination: defaultCountry }));
    }
  }, [isOpen, defaultCountry]);

  useEffect(() => {
    if (isOpen && currentUser) {
      setForm(prev => ({
        ...prev,
        primaryPassenger: {
          ...prev.primaryPassenger,
          fullName: currentUser.full_name || "",
          gender: currentUser.gender || "",
          email: currentUser.email || "",
          age: currentUser.age || ""
        }
      }));
    }
  }, [isOpen, currentUser]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePrimaryPassengerChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      primaryPassenger: {
        ...prev.primaryPassenger,
        [name]: value
      }
    }));
  };

  const handleAdditionalPassengerChange = (index, e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updatedPassengers = [...prev.additionalPassengers];
      updatedPassengers[index] = {
        ...updatedPassengers[index],
        [name]: value
      };
      return {
        ...prev,
        additionalPassengers: updatedPassengers
      };
    });
  };

  const handleAdultsChange = (e) => {
    const adults = Number(e.target.value);
    const maxChildren = 4 - adults;
    setForm(prev => ({
      ...prev,
      adults,
      children: Math.min(prev.children, maxChildren)
    }));
    setGuestCountError("");
  };

  const handleChildrenChange = (e) => {
    const children = Number(e.target.value);
    const total = (Number(form.adults) || 0) + children;
    if (total > 4) {
      setGuestCountError("Total guests (adults + children) cannot exceed 4.");
      return;
    }
    setForm(prev => ({ ...prev, children }));
    setGuestCountError("");
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (step === 1 && (!form.destination || !form.adults || form.children === undefined)) {
      setError("Please fill in all required fields.");
      return;
    }
    if (step === 2) {
      // Validate primary passenger
      if (!form.primaryPassenger.fullName || !form.primaryPassenger.gender || 
          !form.primaryPassenger.citizenship || !form.primaryPassenger.age) {
        setError("Please fill in all primary passenger details.");
        return;
      }
      // Validate additional passengers
      for (let i = 0; i < form.additionalPassengers.length; i++) {
        const passenger = form.additionalPassengers[i];
        if (!passenger.fullName || !passenger.gender || !passenger.citizenship || !passenger.age) {
          setError(`Please fill in all details for passenger ${i + 2}.`);
          return;
        }
      }
      if (!form.cabinType) {
        setError("Please select a cabin type.");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.cardNumber || !form.expiry || !form.cvv) {
      setError("Please fill in all payment details.");
      return;
    }
    if (!/^\d{16}$/.test(form.cardNumber)) {
      setError("Card number must be exactly 16 digits.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const shipName = getShipNameForDestination(form.destination);
      const allPassengers = [
        form.primaryPassenger,
        ...form.additionalPassengers
      ];

      const response = await fetch('http://localhost/Project-I/backend/booking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: form.primaryPassenger.fullName,
          gender: form.primaryPassenger.gender,
          email: form.primaryPassenger.email,
          citizenship: form.primaryPassenger.citizenship,
          age: form.primaryPassenger.age,
          passengers: allPassengers,
          room_type: form.cabinType,
          adults: parseInt(form.adults),
          children: parseInt(form.children),
          number_of_guests: parseInt(form.adults) + parseInt(form.children),
          card_type: form.cardType,
          card_number: form.cardNumber,
          ship_name: shipName,
          destination: form.destination,
          total_price: getTotalPrice()
        })
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.message + (data.error ? `: ${data.error}` : ""));
        setLoading(false);
        return;
      }

      setBookingSuccess(true);
      setBookingId(data.booking_id);
      setCabinNumber(data.cabin_number);
      setSuccess("Booking successful! Thank you for booking with Serendip Waves.");

      // Store passengers in backend
      try {
        const passengerPayload = {
          booking_id: data.booking_id,
          ship_name: shipName,
          route: form.destination,
          cabin_id: data.cabin_number || '',
          passengerList: [
            {
              passenger_name: form.primaryPassenger.fullName,
                            email: form.primaryPassenger.email,
              age: form.primaryPassenger.age,
              gender: form.primaryPassenger.gender,
              citizenship: form.primaryPassenger.citizenship
            },
            ...form.additionalPassengers.map(p => ({
              passenger_name: p.fullName,
                            email: '', // Or use p.email if collected
              age: p.age,
              gender: p.gender,
              citizenship: p.citizenship
            }))
          ]
        };
        const passRes = await fetch('http://localhost/Project-I/backend/addPassengers.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(passengerPayload)
        });
        const passData = await passRes.json();
        if (!passData.success) {
          setError('Booking succeeded, but failed to store passenger details: ' + (passData.message || 'Unknown error'));
        }
      } catch (e) {
        setError('Booking succeeded, but a network error occurred while storing passenger details.');
      }

      // Send confirmation email
      try {
        const itinerary = getItineraryForDestination(form.destination);
        const emailRes = await fetch('http://localhost/Project-I/backend/sendBookingConfirmation.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.primaryPassenger.email,
            full_name: form.primaryPassenger.fullName,
            booking_id: data.booking_id,
            cruise_title: form.destination,
            cabin_type: form.cabinType,
            cabin_number: data.cabin_number,
            adults: form.adults,
            children: form.children,
            departure_date: itinerary?.start_date || '',
            return_date: itinerary?.end_date || '',
            total_price: getTotalPrice(),
            ship_name: shipName,
            destination: form.destination,
            special_requests: form.special_requests || ''
          })
        });
        const emailData = await emailRes.json();
        if (!emailData.success) {
          setError("Booking succeeded, but confirmation email failed to send: " + emailData.message);
        }
      } catch (e) {
        setError("Booking succeeded, but confirmation email could not be sent due to a network error.");
      }
    } catch (error) {
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setForm({
        adults: 1,
        children: 0,
        cabinType: "",
        destination: "",
        cardType: "Visa",
        cardNumber: "",
        expiry: "",
        cvv: "",
        primaryPassenger: {
          fullName: currentUser?.full_name || "",
          gender: currentUser?.gender || "",
          citizenship: "",
          email: currentUser?.email || "",
          age: "",
          isChild: false
        },
        additionalPassengers: []
      });
      setSuccess("");
      setError("");
      setGuestCountError("");
      setBookingSuccess(false);
      setBookingId("");
      setCabinNumber("");
      setStep(1);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(8px)",
        transition: "background 0.3s"
      }}
      onClick={onClose}
    >
      <style>{`
        /* ... (keep all existing styles) ... */
        .passenger-section {
          margin-bottom: 24px;
          padding: 16px;
          border-radius: 12px;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
        }
        .passenger-title {
          font-weight: 600;
          color: #7c4dff;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }
        .passenger-title .badge {
          margin-left: 8px;
          background: #7c4dff;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
      `}</style>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          color: "#111", // Set black font color for all modal text
          backdropFilter: "blur(20px)",
          borderRadius: "48px",
          padding: "56px 32px 32px 32px",
          maxWidth: "900px",
          width: "98%",
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          position: "relative",
          transition: "all 0.3s",
          marginTop: '40px',
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          .booking-modal-btn, .booking-modal-select, .booking-modal-input, .booking-modal-radio {
            color: #111 !important;
          }
          .booking-modal-btn {
            background: #fff !important;
            color: #111 !important;
            border: 1.5px solid #7c4dff !important;
            font-weight: 600;
            border-radius: 8px;
            padding: 10px 28px;
            box-shadow: 0 2px 8px rgba(140, 140, 140, 0.08);
            transition: background 0.2s, color 0.2s, border 0.2s;
          }
          .booking-modal-btn:hover, .booking-modal-btn:focus {
            background: #f3f0ff !important;
            color: #7c4dff !important;
            border-color: #7c4dff !important;
            outline: none !important;
          }
          .booking-modal-btn.secondary {
            background: #fff !important;
            color: #7c4dff !important;
            border: 1.5px solid #7c4dff !important;
          }
          .booking-modal-btn.secondary:hover, .booking-modal-btn.secondary:focus {
            background: #f3f0ff !important;
            color: #111 !important;
          }
          .booking-modal-select, .booking-modal-input, select, input, textarea {
            background: #fff !important;
            color: #111 !important;
            border: 1px solid #ccc !important;
          }
          .booking-modal-select:focus, .booking-modal-input:focus, select:focus, input:focus, textarea:focus {
            background: #fff !important;
            color: #111 !important;
            border: 1.5px solid #7c4dff !important;
            outline: none !important;
          }
          .passenger-section, .passenger-title, .booking-modal-step-label, .booking-modal-divider, .alert {
            color: #111 !important;
          }
          .booking-modal-step.active {
            color: #fff !important;
          }
          h3, .booking-modal-step-label[style] {
            color: #7c4dff !important;
          }
          label {
            color: #111 !important;
          }
        `}</style>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            color: "#666"
          }}
        >
          ×
        </button>
        {/* Step Indicator */}
        <div className="booking-modal-steps">
          {steps.map((label, idx) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className={`booking-modal-step${step === idx + 1 ? ' active' : ''}`}>{idx + 1}</div>
              <div className="booking-modal-step-label" style={{ color: step === idx + 1 ? '#7c4dff' : '#bdbdbd' }}>{label}</div>
            </div>
          ))}
        </div>
        <hr className="booking-modal-divider" />
        {step === 1 && (
          <form onSubmit={e => { e.preventDefault(); handleNext(); }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <img src={logo} alt="Logo" width="160" height="160" style={{ display: 'block', margin: '0 auto 16px auto' }} />
            </div>
            <h3 style={{ color: "#7c4dff", fontWeight: 700, marginBottom: 32, fontSize: 26, textAlign: 'center' }}>Add details</h3>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600 }}>Adults</label>
              <select
                name="adults"
                value={form.adults}
                onChange={handleAdultsChange}
                className="booking-modal-select"
                style={{ width: 90, borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 8, marginRight: 12 }}
                required
              >
                {[1,2,3,4].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <label style={{ fontWeight: 600, marginLeft: 10 }}>Children</label>
              <select
                name="children"
                value={form.children}
                onChange={handleChildrenChange}
                className="booking-modal-select"
                style={{ width: 90, borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 8 }}
                required
              >
                {Array.from({length: 4 - form.adults + 1}, (_, i) => i).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              {guestCountError && (
                <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>{guestCountError}</div>
              )}
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600 }}>Destination</label>
              <select
                name="destination"
                value={form.destination}
                onChange={handleChange}
                className="booking-modal-select"
                style={{ width: '100%', borderRadius: 8, border: '1px solid #ccc', padding: 8, marginTop: 8 }}
                required
              >
                <option value="">Select destination</option>
                {availableDestinations.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="submit" className="booking-modal-btn">Next</button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={e => { e.preventDefault(); handleNext(); }}>
            <h3 style={{ textAlign: "center", marginBottom: 24, color: '#7c4dff', fontWeight: 700 }}>Passenger details</h3>
            
            {/* Primary Passenger */}
            <div className="passenger-section">
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>Special Requests (optional)</label>
                <textarea
                  name="special_requests"
                  value={form.special_requests}
                  onChange={handleChange}
                  className="booking-modal-input"
                  style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 8, minHeight: 60, marginTop: 2 }}
                  placeholder="Let us know if you have any dietary needs, accessibility requirements, or other requests."
                />
              </div>
              <div className="passenger-title">
                Primary Passenger <span className="badge">Adult</span>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Full name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={form.primaryPassenger.fullName} 
                  onChange={handlePrimaryPassengerChange} 
                  className="booking-modal-input" 
                  style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Gender</label>
                <select
                  name="gender"
                  value={form.primaryPassenger.gender}
                  onChange={handlePrimaryPassengerChange}
                  className="booking-modal-select"
                  style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Citizenship</label>
                <select
                  name="citizenship"
                  value={form.primaryPassenger.citizenship}
                  onChange={handlePrimaryPassengerChange}
                  className="booking-modal-select"
                  style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }}
                  required
                >
                  <option value="">Select citizenship</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Australia">Australia</option>
                  <option value="Norway">Norway</option>
                  <option value="Greece">Greece</option>
                  <option value="Japan">Japan</option>
                  <option value="Caribbean">Caribbean</option>
                  <option value="Alaska">Alaska</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.primaryPassenger.email} 
                  onChange={handlePrimaryPassengerChange} 
                  className="booking-modal-input" 
                  style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Age</label>
                <input 
                  type="number" 
                  name="age" 
                  value={form.primaryPassenger.age} 
                  onChange={handlePrimaryPassengerChange} 
                  className="booking-modal-input" 
                  style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }} 
                  required 
                  min="1"
                />
              </div>
            </div>

            {/* Additional Passengers */}
            {form.additionalPassengers.map((passenger, index) => (
              <div key={index} className="passenger-section">
                <div className="passenger-title">
                  Passenger {index + 2} <span className="badge">{passenger.isChild ? 'Child' : 'Adult'}</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Full name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={passenger.fullName} 
                    onChange={(e) => handleAdditionalPassengerChange(index, e)} 
                    className="booking-modal-input" 
                    style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }} 
                    required 
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={passenger.gender}
                    onChange={(e) => handleAdditionalPassengerChange(index, e)}
                    className="booking-modal-select"
                    style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Citizenship</label>
                  <select
                    name="citizenship"
                    value={passenger.citizenship}
                    onChange={(e) => handleAdditionalPassengerChange(index, e)}
                    className="booking-modal-select"
                    style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }}
                    required
                  >
                    <option value="">Select citizenship</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Australia">Australia</option>
                    <option value="Norway">Norway</option>
                    <option value="Greece">Greece</option>
                    <option value="Japan">Japan</option>
                    <option value="Caribbean">Caribbean</option>
                    <option value="Alaska">Alaska</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Age</label>
                  <input 
                    type="number" 
                    name="age" 
                    value={passenger.age} 
                    onChange={(e) => handleAdditionalPassengerChange(index, e)} 
                    className="booking-modal-input" 
                    style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }} 
                    required 
                    min="1"
                  />
                </div>
              </div>
            ))}

            {/* Cabin Type Selection */}
            <div style={{ marginTop: 24, marginBottom: 24 }}>
              <label style={{ fontWeight: 600 }}>Cabin type</label>
              <select
                name="cabinType"
                value={form.cabinType}
                onChange={handleChange}
                className="booking-modal-select"
                style={{ width: '100%', borderRadius: 8, border: '1px solid #ccc', padding: 8, marginTop: 8 }}
                required
              >
                <option value="">Select cabin type</option>
                {cabinTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
              <button type="button" onClick={handleBack} className="booking-modal-btn secondary">Back</button>
              <button type="submit" className="booking-modal-btn">Next</button>
            </div>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={{ color: '#7c4dff', fontWeight: 700, fontSize: 32 }}>Total amount&nbsp;${getTotalPrice()}</span>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 20 }}>Select card type</div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
                <label htmlFor="cardType-visa" className={`booking-modal-radio${form.cardType === 'Visa' ? ' selected' : ''}`} style={{ minWidth: 180 }}>
                  <input id="cardType-visa" type="radio" name="cardType" value="Visa" checked={form.cardType === 'Visa'} onChange={handleChange} style={{ cursor: 'pointer' }} />
                  <span className="booking-modal-radio-icon">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '24px' }} />
                  </span>
                  Visa
                </label>
                <label htmlFor="cardType-master" className={`booking-modal-radio${form.cardType === 'Master Card' ? ' selected' : ''}`} style={{ minWidth: 220 }}>
                  <input id="cardType-master" type="radio" name="cardType" value="Master Card" checked={form.cardType === 'Master Card'} onChange={handleChange} style={{ cursor: 'pointer' }} />
                  <span className="booking-modal-radio-icon">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" style={{ height: '24px' }} />
                  </span>
                  Master Card
                </label>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label>CARD NUMBER</label>
              <input type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange} className="booking-modal-input" style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 4 }} required maxLength={16} pattern="\d{16}" placeholder="Enter 16-digit card number" />
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label>EXPIRY</label>
                <input type="text" name="expiry" value={form.expiry} onChange={handleChange} className="booking-modal-input" style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 4 }} required placeholder="MM/YY" />
              </div>
              <div style={{ flex: 1 }}>
                <label>CVV</label>
                <input type="text" name="cvv" value={form.cvv} onChange={handleChange} className="booking-modal-input" style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 4 }} required />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <button type="button" onClick={handleBack} className="booking-modal-btn secondary">Cancel</button>
              {!bookingSuccess && (
                <button type="submit" className="booking-modal-btn" id="managePaymentBtn">Make Payment</button>
              )}
            </div>
          </form>
        )}
        {error && (
          <div className="alert alert-danger text-center" style={{ borderRadius: "10px", marginTop: 24 }}>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success text-center" style={{ borderRadius: "10px", marginTop: 24 }}>
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;