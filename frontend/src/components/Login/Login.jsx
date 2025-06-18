import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../auth';
import Toast from '../Toast/Toast';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  // Define handleChange function properly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://collabconnect-y1zi.onrender.com/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);

        setToast({
          show: true,
          message: 'Login successful!',
          type: 'success'
        });

        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setToast({
          show: true,
          message: data.message || 'Login failed',
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: 'An error occurred during login',
        type: 'error'
      });
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
        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit}>
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

          <div className="form-footer">
            <button type="submit" className="submit-button">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;