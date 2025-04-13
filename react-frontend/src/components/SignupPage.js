import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  // State for storing form values
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  // Handle form submission
  const handleSignup = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    console.log('New user data:', newUser);
    // Add API call for registration later
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
      <form style={styles.form} onSubmit={handleSignup}>
        <div style={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            style={styles.input}
            value={newUser.username}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            style={styles.input}
            value={newUser.password}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            style={styles.input}
            value={newUser.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Sign Up
        </button>
      </form>
      <Link to="/login" style={styles.link}>
        Already have an account? Login
      </Link>
    </div>
  );
};

export default SignupPage;
