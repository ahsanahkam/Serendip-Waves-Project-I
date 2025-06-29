import React, { useState } from "react";

const cabinTypes = ["Interior", "Ocean view", "Balcony", "Suite"];
const dietaryOptions = ["None", "Vegetarian", "Vegan", "Gluten-Free", "Kosher", "Halal"];
const addOns = [
  { label: "Snorkeling Excursion", value: "snorkeling" },
  { label: "City Tour", value: "citytour" },
  { label: "Spa Package", value: "spa" },
  { label: "Private Dining", value: "dining" }
];

const steps = ["Add details", "Passenger details", "Payment"];

const BookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    adults: 1,
    children: 0,
    cabinType: "",
    fullName: "",
    gender: "",
    citizenship: "",
    email: "",
    age: "",
    cardType: "Visa",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const totalAmount = 375; // Example static amount

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleNumberChange = (name, value) => {
    let newValue = Number(value);
    if (name === "adults") {
      if (newValue < 1) newValue = 1;
      if (newValue + form.children > 4) newValue = 4 - form.children;
    }
    if (name === "children") {
      if (newValue < 0) newValue = 0;
      if (form.adults + newValue > 4) newValue = 4 - form.adults;
    }
    setForm(prev => ({ ...prev, [name]: newValue }));
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.cabinType || !form.adults || !form.fullName || !form.email || !form.cardNumber || !form.expiry || !form.cvv) {
      setError("Please fill in all required fields.");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("Booking successful! Thank you for booking with Serendip Waves.");
    // Here you would send the booking data to your backend
    setTimeout(() => {
      onClose();
      setStep(1);
      setForm({
        adults: 1,
        children: 0,
        cabinType: "",
        fullName: "",
        gender: "",
        citizenship: "",
        email: "",
        age: "",
        cardType: "Visa",
        cardNumber: "",
        expiry: "",
        cvv: ""
      });
      setSuccess("");
    }, 2000);
  };

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
      `}</style>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "44px 38px 38px 38px",
          maxWidth: "480px",
          width: "95%",
          maxHeight: "98vh",
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
            <h3 style={{ textAlign: "center", marginBottom: 24, color: '#7c4dff', fontWeight: 700 }}>Add details</h3>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600 }}>Guest count</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                <span>Adult</span>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={form.adults}
                  onChange={e => handleNumberChange("adults", e.target.value)}
                  className="booking-modal-input"
                  style={{ width: 50, borderRadius: 6, border: '1px solid #ccc', padding: 4 }}
                />
                <span>Children</span>
                <input
                  type="number"
                  min={0}
                  max={4}
                  value={form.children}
                  onChange={e => handleNumberChange("children", e.target.value)}
                  className="booking-modal-input"
                  style={{ width: 50, borderRadius: 6, border: '1px solid #ccc', padding: 4 }}
                />
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600 }}>Cabin type</label>
              <select
                name="cabinType"
                value={form.cabinType}
                onChange={handleChange}
                className="booking-modal-select"
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  padding: 8,
                  marginTop: 8
                }}
                required
              >
                <option value="">Select cabin type</option>
                {cabinTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
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
                <option value="Creebean">Creebean</option>
                <option value="Alaska">Alaska</option>
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
            <h3 style={{ textAlign: "center", marginBottom: 24, color: '#7c4dff', fontWeight: 700 }}>Total amount <span style={{ color: '#7c4dff', fontWeight: 700, fontSize: 22, marginLeft: 8 }}>${totalAmount}</span></h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 500 }}>Select card type</label>
              <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                <label htmlFor="cardType-visa" className={`booking-modal-radio${form.cardType === 'Visa' ? ' selected' : ''}`}>
                  <input id="cardType-visa" type="radio" name="cardType" value="Visa" checked={form.cardType === 'Visa'} onChange={handleChange} style={{ cursor: 'pointer' }} />
                  <span className="booking-modal-radio-icon">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '18px' }} />
                  </span>
                  Visa
                </label>
                <label htmlFor="cardType-master" className={`booking-modal-radio${form.cardType === 'Master Card' ? ' selected' : ''}`}>
                  <input id="cardType-master" type="radio" name="cardType" value="Master Card" checked={form.cardType === 'Master Card'} onChange={handleChange} style={{ cursor: 'pointer' }} />
                  <span className="booking-modal-radio-icon">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" style={{ height: '18px' }} />
                  </span>
                  Master Card
                </label>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label>CARD NUMBER</label>
              <input type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange} className="booking-modal-input" style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 6, marginTop: 4 }} required />
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
              <button type="submit" className="booking-modal-btn">Make Payment</button>
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