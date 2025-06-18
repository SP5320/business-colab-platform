import { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../Toast/Toast';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simulated function to check if email exists
  const checkEmailExists = async (email) => {
    // This should be replaced with actual API call
    const existingEmails = ['test@example.com', 'user@domain.com'];
    return existingEmails.includes(email);
  };

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  const validateForm = () => {
    // Password validation
    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters long');
      return false;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!validateForm()) {
      return;
    }

    try {
      // Check if email exists
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        showToast('Email already exists');
        return;
      }

      // If all validations pass, proceed with signup
      console.log('Form submitted:', formData);
      showToast('Account created successfully!', 'success');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

    } catch (error) {
      showToast('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ show: false, message: '', type: 'error' })} 
        />
      )}
      
      <div className="auth-wrapper">
        {/* <div className="logo">
          <h1>Logo</h1>
        </div> */}
        
        <div className="auth-header">
          <h2>Create account</h2>
          <p>Please fill in your details to sign up.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-button">
              Create account
            </button>
            <p className="auth-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;