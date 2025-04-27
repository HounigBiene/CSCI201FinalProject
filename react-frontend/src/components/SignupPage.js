import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Use react-hook-form's handleSubmit wrapper
  const onSubmit = async (data) => {
    setIsLoading(true);

    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: "Passwords don't match!"
      });
      setIsLoading(false);
      return;
    }

    try {
      const userToRegister = {
        username: data.username,
        email: data.email,
        password: data.password
      };

      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userToRegister)
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.text();
        setError('root.serverError', {
          type: 'manual',
          message: errorData || 'Registration failed. Please try again.'
        });
      }
    } catch (error) {
      setError('root.serverError', {
        type: 'manual',
        message: 'An error occurred during registration. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Styles for the component
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '100px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: 'white'
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    input: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    button: {
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    link: {
      display: 'block',
      marginTop: '15px',
      textAlign: 'center',
      color: '#007bff',
      textDecoration: 'none'
    }
  };

  return (
  <div style={styles.container}>
    <h2 style={styles.title}>Sign Up</h2>
    {/* error message display */}
    {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
    <form onSubmit={handleSignup} style={styles.form}>
      <div style={styles.inputGroup}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={newUser.username}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      {/* email field */}
      <div style={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={newUser.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={newUser.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={newUser.confirmPassword}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      {/* Update button to show loading state */}
      <button type="submit" style={styles.button} disabled={isLoading}>
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </button>
      </form>
      <Link to="/login" style={styles.link}>Already have an account? Login</Link>
    </div>
  );
};

export default SignupPage;
