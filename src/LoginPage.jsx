import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './App';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevState => ({
        ...prevState,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Check regular user credentials
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => 
        u.email.toLowerCase() === formData.email.toLowerCase() && 
        u.password === formData.password
      );

      if (user) {
        // Remove password from user object before storing
        const { password, ...userWithoutPassword } = user;
        login(userWithoutPassword);
        navigate('/dashboard');
      } else {
        setErrors({ general: 'Invalid email or password. Please try again.' });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An error occurred during login. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ 
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           padding: '20px'
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-lg" 
                 style={{ 
                   borderRadius: '20px',
                   background: 'rgba(255, 255, 255, 0.1)',
                   backdropFilter: 'blur(20px)',
                   border: '1px solid rgba(255, 255, 255, 0.2)',
                   color: '#fff'
                 }}>
              <div className="card-body p-5">
                {/* Logo */}
                <div className="text-center mb-4">
                  <img 
                    src="/logo.png" 
                    alt="Serendip Waves Logo" 
                    width="120" 
                    height="120" 
                    className="mb-3"
                  />
                  <h2 className="fw-bold mb-0 text-white">Login to Serendip Waves</h2>
                </div>

                {/* Error Message */}
                {errors.general && (
                  <div className="alert alert-danger" role="alert">
                    {errors.general}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-3">
                    <label 
                      htmlFor="email" 
                      className="form-label fw-semibold text-white"
                    >
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      aria-describedby="emailHelp"
                      style={{ 
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <div id="emailHelp" className="form-text" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      We'll never share your email with anyone else.
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label 
                      htmlFor="password" 
                      className="form-label fw-semibold text-white"
                    >
                      🔒 Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      aria-describedby="passwordHelp"
                      style={{ 
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <div id="passwordHelp" className="form-text" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Your password must be at least 6 characters long.
                    </div>
                  </div>

                  {/* Login Button */}
                  <div className="d-grid mb-4">
                    <button 
                      type="submit" 
                      className="btn btn-warning btn-lg fw-bold"
                      disabled={isSubmitting}
                      style={{ 
                        borderRadius: '10px',
                        fontSize: '1.1rem',
                        padding: '12px',
                        background: 'rgba(255, 193, 7, 0.9)',
                        border: '1px solid rgba(255, 193, 7, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Don't have an account?{' '}
                      <Link 
                        to="/signup" 
                        className="text-decoration-none fw-semibold"
                        style={{ color: '#ffd600' }}
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Glass Effect */}
      <style>{`
        .form-control:focus {
          background: rgba(255,255,255,0.2) !important;
          border-color: #ffd600 !important;
          box-shadow: 0 0 0 0.2rem rgba(255, 214, 0, 0.25) !important;
          color: #fff !important;
          backdrop-filter: blur(15px) !important;
        }
        
        .form-control::placeholder {
          color: rgba(255,255,255,0.6) !important;
        }
        
        .btn-warning:hover:not(:disabled) {
          background: rgba(255, 193, 7, 1) !important;
          border-color: rgba(255, 193, 7, 1) !important;
          transform: translateY(-2px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
        }
        
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
        }
        
        /* Glass morphism effect */
        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default LoginPage; 