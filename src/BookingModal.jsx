import React, { useState } from "react";

const cabinTypes = ["Interior", "Oceanview", "Balcony", "Suite"];
const dietaryOptions = ["None", "Vegetarian", "Vegan", "Gluten-Free", "Kosher", "Halal"];
const addOns = [
  { label: "Snorkeling Excursion", value: "snorkeling" },
  { label: "City Tour", value: "citytour" },
  { label: "Spa Package", value: "spa" },
  { label: "Private Dining", value: "dining" }
];

const BookingModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    cabinType: "",
    guests: 1,
    dietary: "",
    addOns: [],
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm(prev => ({
        ...prev,
        addOns: checked
          ? [...prev.addOns, value]
          : prev.addOns.filter(a => a !== value)
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.cabinType || !form.guests || !form.cardName || !form.cardNumber || !form.expiry || !form.cvc) {
      setError("Please fill in all required fields.");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("Booking successful! Thank you for booking with Serendip Waves.");
    // Here you would send the booking data to your backend
    setTimeout(() => {
      onClose();
      setForm({
        cabinType: "",
        guests: 1,
        dietary: "",
        addOns: [],
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvc: ""
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
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(8px)"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "32px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 className="fw-bold mb-0" style={{ color: "#333" }}>Book Your Cruise</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
              padding: "4px",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
              e.target.style.color = "#333";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#666";
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Cabin Type *</label>
            <select 
              className="form-select" 
              name="cabinType" 
              value={form.cabinType} 
              onChange={handleChange} 
              required
              style={{ 
                background: "rgba(255, 255, 255, 0.8)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "10px"
              }}
            >
              <option value="">Select cabin type</option>
              {cabinTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Number of Guests *</label>
            <input 
              type="number" 
              className="form-control" 
              name="guests" 
              min={1} 
              max={10} 
              value={form.guests} 
              onChange={handleChange} 
              required
              style={{ 
                background: "rgba(255, 255, 255, 0.8)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "10px"
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Dietary Needs</label>
            <select 
              className="form-select" 
              name="dietary" 
              value={form.dietary} 
              onChange={handleChange}
              style={{ 
                background: "rgba(255, 255, 255, 0.8)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "10px"
              }}
            >
              <option value="">None</option>
              {dietaryOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Add-ons (Excursions)</label>
            <div>
              {addOns.map(addon => (
                <div key={addon.value} className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={addon.value}
                    value={addon.value}
                    checked={form.addOns.includes(addon.value)}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor={addon.value}>{addon.label}</label>
                </div>
              ))}
            </div>
          </div>

          <hr style={{ borderColor: "rgba(0, 0, 0, 0.1)" }} />
          
          <h5 className="fw-bold mb-3" style={{ color: "#333" }}>Payment Information</h5>
          
          <div className="mb-3">
            <label className="form-label">Cardholder Name *</label>
            <input 
              type="text" 
              className="form-control" 
              name="cardName" 
              value={form.cardName} 
              onChange={handleChange} 
              required
              style={{ 
                background: "rgba(255, 255, 255, 0.8)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "10px"
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Card Number *</label>
            <input 
              type="text" 
              className="form-control" 
              name="cardNumber" 
              value={form.cardNumber} 
              onChange={handleChange} 
              required 
              maxLength={19}
              style={{ 
                background: "rgba(255, 255, 255, 0.8)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "10px"
              }}
            />
          </div>

          <div className="row">
            <div className="col mb-3">
              <label className="form-label">Expiry *</label>
              <input 
                type="text" 
                className="form-control" 
                name="expiry" 
                value={form.expiry} 
                onChange={handleChange} 
                placeholder="MM/YY" 
                required 
                maxLength={5}
                style={{ 
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px"
                }}
              />
            </div>
            <div className="col mb-3">
              <label className="form-label">CVC *</label>
              <input 
                type="text" 
                className="form-control" 
                name="cvc" 
                value={form.cvc} 
                onChange={handleChange} 
                required 
                maxLength={4}
                style={{ 
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px"
                }}
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-danger text-center" style={{ borderRadius: "10px" }}>
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success text-center" style={{ borderRadius: "10px" }}>
              {success}
            </div>
          )}

          <div className="d-grid mt-4">
            <button 
              type="submit" 
              className="btn btn-lg fw-bold"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "15px",
                padding: "12px 24px",
                fontSize: "1.1rem"
              }}
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal; 