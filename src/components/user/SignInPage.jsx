import React, { useState } from 'react';
import {Dialog,IconButton} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '/src/styles/SignInPage.css';
import axios from '../../axios';// Import Axios instance


export default function SignInPage() {
  const [open, setOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');


  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

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
      localStorage.setItem('token', response.data.token); //// Use localStorage or any other method
      

      // Redirect based on the role (user or admin)
      
      window.location.href = response.data.redirectUrl;
      // // Redirect user or update UI based on successful login
      // window.location.href = '/';
    } catch (err) {
      console.error('Login Error', err);
      setError('Login Error. Please check your credentials.');
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };
  return (
    <Dialog onClose={handleClose} open={open}>
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
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
        <p className="signup-message">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
    </Dialog>
  );
}
