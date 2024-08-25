import React, { useState } from 'react';
import axios from '../../../axios'; // Import the Axios instance
import '/src/styles/SignInPage.css';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('/user-auth/login', {
        Email: email,
        Password: password,
      });
      
      console.log('Login Successful', response.data);

      // Store JWT in localStorage or cookies
      localStorage.setItem('token', response.data.token); // Use localStorage or any other method

      // Redirect user or update UI based on successful login
      // e.g., window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login Error', err);
      setError('Login Error. Please check your credentials.');
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
        <p className="signup-message">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
}
