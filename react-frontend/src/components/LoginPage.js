import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/authstyle.css";

const LoginPage = () => {
  // State for storing form values
  const navigate = useNavigate();

  // State for storing form values - changed userId to username to match backend
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  // Added states for error handling and loading
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    // Must enter some values
    e.preventDefault();
    console.log('Login credentials:', credentials);
    setIsLoading(true);
    // Add API call for authentication later
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.text();

      if (response.ok) {
        console.log('Login successful:', data);
        // Store login status and user ID for future use
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', data); // Assuming response contains user ID
        // Redirect to main page after successful login
        navigate('/');
      } else {
        setError(data || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      {error && <div className="auth-error">{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="auth-input"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="auth-input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="auth-input"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <Link to="/signup" className="auth-link">
        Don't have an account? Sign up
      </Link>
    </div>
  );
};

export default LoginPage;
