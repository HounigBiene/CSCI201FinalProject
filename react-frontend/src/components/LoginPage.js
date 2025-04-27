import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
      <h2 style={styles.title}>Login</h2>
      {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label htmlFor="userId">Username</label>
          <input
            type="text"
            id="userId"
            name="userId"
            style={styles.input}
            value={credentials.userId}
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
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <Link to="/signup" style={styles.link}>
        Don't have an account? Sign up
      </Link>
    </div>
  );
};

export default LoginPage;
