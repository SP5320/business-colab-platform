// Navbar.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, AUTH_CHANGE_EVENT } from '../auth';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(isAuthenticated());
    };

    // Initial check
    handleAuthChange();

    // Listen for auth changes
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Company Logo" className="logo-image" />
      </div>
      {isLoggedIn && (
        <div className="navbar-links">
          <button className="navbar-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;