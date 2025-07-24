import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./App";
import logo from './assets/logo.png'; // Added import for logo

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
    fullName: currentUser?.full_name || "",
    gender: currentUser?.gender || "",
    citizenship: "",
    destination: "",
    email: currentUser?.email || "",
    age: "",
    cardType: "Visa",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [guestCountError, setGuestCountError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [cabinNumber, setCabinNumber] = useState("");
  // State for available destinations (arrival countries)
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [itineraries, setItineraries] = useState([]); // Store all itineraries for lookup

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

  // Helper to get ship_name for selected destination
  const getShipNameForDestination = (destination) => {
    const itinerary = itineraries.find(item => item.route === destination);
    return itinerary ? itinerary.ship_name : '';
  };

  // Helper to get itinerary for selected destination
  const getItineraryForDestination = (destination) => {
    return itineraries.find(item => item.route === destination);
  };

  // Calculate total price based on form values
  const getTotalPrice = () => {
    const { cabinType, adults, children } = form;
    if (!cabinType || !CABIN_PRICES[cabinType]) return 0;
    const price = CABIN_PRICES[cabinType];
    return (Number(adults) * price.adult) + (Number(children) * price.child);
  };

  // Set default country when modal opens
  useEffect(() => {
    if (isOpen && defaultCountry && !form.destination) {
      setForm(prev => ({ ...prev, destination: defaultCountry }));
    }
    // eslint-disable-next-line
  }, [isOpen, defaultCountry]);

  useEffect(() => {
    if (isOpen && currentUser) {
      setForm(prev => ({
        ...prev,
        fullName: currentUser.full_name || "",
        gender: currentUser.gender || "",
        email: currentUser.email || "",
        age: currentUser.age || ""
      }));
    }
  }, [isOpen, currentUser]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
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

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.cabinType || !form.adults || form.children === undefined || !form.fullName || !form.email || !form.cardNumber || !form.expiry || !form.cvv) {
      setError("Please fill in all required fields.");
      setSuccess("");
      return;
    }
    // Card number validation: must be exactly 16 digits
    if (!/^\d{16}$/.test(form.cardNumber)) {
      setError("Card number must be exactly 16 digits.");
      setSuccess("");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Get the correct ship_name for the selected destination
      const shipName = getShipNameForDestination(form.destination);
      const response = await fetch('http://localhost/Project-I/backend/booking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: form.fullName,
          gender: form.gender,
          email: form.email,
          citizenship: form.citizenship,
          age: form.age,
          room_type: form.cabinType,
          adults: parseInt(form.adults),
          children: parseInt(form.children),
          number_of_guests: parseInt(form.adults) + parseInt(form.children),
          card_type: form.cardType,
          card_number: form.cardNumber,
          ship_name: shipName, // Use looked-up ship name
          destination: form.destination,
          total_price: getTotalPrice()
        })
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.message + (data.error ? `: ${data.error}` : ""));
        setSuccess("");
        setLoading(false);
        return;
      }

      if (data.success) {
        setBookingSuccess(true);
        setBookingId(data.booking_id);
        setCabinNumber(data.cabin_number);
        setSuccess("Booking successful! Thank you for booking with Serendip Waves.");

        // Get departure and return dates from itinerary
        const itinerary = getItineraryForDestination(form.destination);
        const departureDate = itinerary?.start_date || '';
        const returnDate = itinerary?.end_date || '';

        // Send confirmation email
        try {
          const emailRes = await fetch('http://localhost/Project-I/backend/sendBookingConfirmation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: form.email,
              full_name: form.fullName,
              booking_id: data.booking_id,
              cruise_title: form.destination, // or the correct cruise title if available
              cabin_type: form.cabinType,
              cabin_number: data.cabin_number,
              adults: form.adults,
              children: form.children,
              departure_date: departureDate,
              return_date: returnDate,
              total_price: getTotalPrice(),
              ship_name: getShipNameForDestination(form.destination),
              destination: form.destination,
              special_requests: form.specialRequests || 'None'
            })
          });
          const emailData = await emailRes.json();
          if (!emailData.success) {
            setError("Booking succeeded, but confirmation email failed to send: " + emailData.message);
          } else {
            setSuccess("Booking successful! Confirmation email sent. Thank you for booking with Serendip Waves.");
          }
        } catch (e) {
          setError("Booking succeeded, but confirmation email could not be sent due to a network error.");
        }
      } else {
        setError(data.message || "Booking failed.");
      }
    } catch (error) {
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // Reset form and booking state when popup closes
  useEffect(() => {
    if (!isOpen) {
      setForm({
        adults: 1,
        children: 0,
        cabinType: "",
        fullName: currentUser?.full_name || "",
        gender: currentUser?.gender || "",
        citizenship: "",
        destination: "",
        email: currentUser?.email || "",
        age: "",
        cardType: "Visa",
        cardNumber: "",
        expiry: "",
        cvv: ""
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
        .booking-modal-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 18px;
          margin-bottom: 28px;
        }
        .booking-modal-step {
          font-weight: 600;
          font-size: 1.08rem;
          color: #bdbdbd;
          background: #f3f3fa;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #e0e0e0;
          transition: all 0.2s;
        }
        .booking-modal-step.active {
          color: #fff;
          background: #7c4dff;
          border: 2px solid #7c4dff;
          box-shadow: 0 2px 8px #7c4dff33;
        }
        .booking-modal-step-label {
          font-size: 0.98rem;
          margin-top: 4px;
          text-align: center;
          color: #7c4dff;
        }
        .booking-modal-btn {
          background: #7c4dff;
          color: #fff;
          border: none;
          border-radius: 20px;
          padding: 8px 32px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px #7c4dff22;
        }
        .booking-modal-btn:hover, .booking-modal-btn:focus {
          background: #5f2eea;
          box-shadow: 0 4px 16px #7c4dff44;
        }
        .booking-modal-btn.secondary {
          background: #eee;
          color: #7c4dff;
        }
        .booking-modal-btn.secondary:hover, .booking-modal-btn.secondary:focus {
          background: #e0e0e0;
        }
        .booking-modal-input:focus, .booking-modal-select:focus {
          outline: 2px solid #7c4dff;
          border-color: #7c4dff;
          background: #f8f6ff;
        }
        .booking-modal-divider {
          border: none;
          border-top: 1.5px solid #ececec;
          margin: 24px 0 18px 0;
        }
        /* Hide number input spin buttons for Chrome, Safari, Edge, Opera */
        .booking-modal-input::-webkit-outer-spin-button,
        .booking-modal-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Hide number input spin buttons for Firefox */
        .booking-modal-input[type=number] {
          -moz-appearance: textfield;
        }
        .booking-modal-select {
          color: #222;
        }
        .booking-modal-input {
          color: #fff;
          background: #fff;
          color: #222;
        }
        .booking-modal-select {
          background: #fff;
        }
        .booking-modal-radio {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 12px;
          border: 2px solid #e0e0e0;
          background: #fafaff;
          transition: border 0.2s, background 0.2s;
          margin-right: 10px;
        }
        .booking-modal-radio.selected {
          border: 2px solid #7c4dff;
          background: #f3f0ff;
          box-shadow: 0 2px 8px #7c4dff22;
        }
        .booking-modal-radio input[type="radio"] {
          accent-color: #7c4dff;
          width: 18px;
          height: 18px;
          margin-right: 6px;
        }
        .booking-modal-radio-icon {
          display: flex;
          align-items: center;
          height: 18px;
          margin-right: 4px;
        }
        /* Hide scrollbar for all browsers */
        div[style*='overflowY']::-webkit-scrollbar { display: none; }
        div[style*='overflowY'] { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
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
            <h3 style={{ textAlign: "center", marginBottom: 14, color: '#7c4dff', fontWeight: 700 }}>Passenger details</h3>
            <div style={{ marginBottom: 8 }}>
              <label>Full name</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="booking-modal-input" style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }} required />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
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
            <div style={{ marginBottom: 8 }}>
              <label>Cabin type</label>
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
            <div style={{ marginBottom: 8 }}>
              <label>Citizenship</label>
              <select
                name="citizenship"
                value={form.citizenship}
                onChange={handleChange}
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
            <div style={{ marginBottom: 8 }}>
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="booking-modal-input" style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }} required />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} className="booking-modal-input" style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 2 }} required />
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