import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import "../css/authstyle.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login credentials:', credentials);
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Login API call successful, received user data:', userData);

        login(userData);

        navigate('/');

      } else {        
        const errorData = await response.text();
        setError(errorData || 'Login failed. Please check your credentials.');
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