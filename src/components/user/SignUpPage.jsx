import React, { useState } from 'react';
import {Dialog,IconButton} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '/src/styles/SignUpPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../axios';// Import Axios instance
export default function SignUpPage() {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');
  const location = useLocation();
  const handleClose = () => {
    setOpen(false); // Close the dialog
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Reset error if form is valid
    setError('');
    // Call API to sign up the user
    axios.post('/user-auth/signup', { Name: name, Email: email, Password: password })
      .then((res) => {
        console.log('Sign Up Success:', res.data);
        
        window.location.href = '/signin'; // Redirect to sign-in page after successful sign-up
      })
      .catch((err) => {
        console.error('Sign Up Error:', err);
        // setError('An error occurred during sign-up. Please try again.');
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An error occurred during sign-up. Please try again.');
        }
      });
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };
  return (
    // <Dialog onClose={handleClose} open={open}>
 
    <div className="signup-page">
      <div className="signup-container">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            {/* <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /> */}
             <label htmlFor="password">Password:</label>
            <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'} // Conditionally set input type
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                  className="password-toggle-icon"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p className="signin-message">
          Already have an account? <a href="/signin">Sign in here</a>
        </p>
      </div>
    </div>
  
    // </Dialog>
  );
}