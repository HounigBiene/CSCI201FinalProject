import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/authstyle.css";

const SignupPage = () => {
  // State for storing form values
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    console.log('New user data:', newUser);
    try {
      // Create a user object without confirmPassword for the API
      const userToRegister = {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password
      };

      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToRegister),
      });

      const data = await response.text();

      if (response.ok) {
        console.log('Registration successful:', data);
        // Redirect to login page after successful registration
        navigate('/login');
      } else {
        setError(data || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }

  };

  return (
  <div className="auth-container">
    <h2 className="auth-title">Sign Up</h2>
    {/* error message display */}
    {error && <div className="auth-error">{error}</div>}
    <form onSubmit={handleSignup} className="auth-form">
      <div className="auth-input-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={newUser.username}
          onChange={handleChange}
          className="auth-input"
          required
        />
      </div>

      {/* email field */}
      <div className="auth-input-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={newUser.email}
          onChange={handleChange}
          className="auth-input"
          required
        />
      </div>

      <div className="auth-input-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={newUser.password}
          onChange={handleChange}
          className="auth-input"
          required
        />
      </div>

      <div className="auth-input-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={newUser.confirmPassword}
          onChange={handleChange}
          className="auth-input"
          required
        />
      </div>

      {/* Update button to show loading state */}
      <button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
    <Link to="/login" className="auth-link">Already have an account? Login</Link>
  </div>
  );
};

export default SignupPage;
