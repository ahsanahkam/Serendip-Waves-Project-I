import React, { useState } from "react";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSignupSuccess(true);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="card border-0 shadow-lg" style={{
              borderRadius: '25px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff'
            }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <img 
                    src="/logo.png" 
                    alt="Serendip Waves Logo" 
                    width="120" 
                    height="120" 
                    className="mb-3"
                  />
                  <h2 className="fw-bold mb-0 text-white">Sign Up for Serendip Waves</h2>
                  <p className="text-white-50">Create your account and start your cruise adventure</p>
                </div>
                {signupSuccess ? (
                  <div className="alert alert-success text-center">
                    Account created! You can now <a href="/login">sign in</a>.
                  </div>
                ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="fullName" className="form-label fw-semibold text-white">Full Name *</label>
                      <input type="text" className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
                      {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phoneNumber" className="form-label fw-semibold text-white">Phone Number *</label>
                      <input type="tel" className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`} id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter your phone number" />
                      {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="dateOfBirth" className="form-label fw-semibold text-white">Date of Birth *</label>
                      <input type="date" className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`} id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                      {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="gender" className="form-label fw-semibold text-white">Gender (optional)</label>
                      <select className="form-select" id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label fw-semibold text-white">Email Address *</label>
                      <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label fw-semibold text-white">Password *</label>
                      <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label fw-semibold text-white">Confirm Password *</label>
                      <input type="password" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>
                  <div className="d-grid mb-4">
                    <button type="submit" className="btn btn-primary btn-lg fw-bold" disabled={isLoading} style={{ borderRadius: '8px', fontSize: '1.2rem', padding: '16px 0', background: '#007aff', border: 'none', color: '#fff' }}>
                      {isLoading ? 'Creating Account...' : 'Create account'}
                    </button>
                  </div>
                  <div className="text-center mt-4">
                    <a href="/login" className="fw-bold" style={{ color: '#007aff', fontSize: '1.2rem', textDecoration: 'none' }}>Sign in</a>
                  </div>
                </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-50px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .form-control:focus, .form-select:focus {
          background: rgba(255,255,255,0.2) !important;
          border-color: #ffd600 !important;
          box-shadow: 0 0 0 0.2rem rgba(255, 214, 0, 0.25) !important;
          color: #fff !important;
          backdrop-filter: blur(15px) !important;
        }
        .form-control::placeholder { color: rgba(255,255,255,0.6) !important; }
        .btn-warning:hover {
          background: rgba(255, 193, 7, 1) !important;
          border-color: rgba(255, 193, 7, 1) !important;
          transform: translateY(-2px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
        }
        .card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important; }
      `}</style>
    </div>
  );
};

export default SignupPage; 