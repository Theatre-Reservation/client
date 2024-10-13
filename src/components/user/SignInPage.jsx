import React, { useState, useEffect } from 'react';
import {Dialog,IconButton} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '/src/styles/SignInPage.css';
import axios from '../../axios';// Import Axios instance
import { useNavigate, useLocation } from 'react-router-dom';
export default function SignInPage() {
  const [open, setOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');
  const [signInOpen, setSignInOpen] = useState(true);
  const [signInError, setSignInError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation to get previous location
  const [previousPage, setPreviousPage] = useState(null);

  useEffect(() => {
    // Check if the data already exists in localStorage
    const storedData = localStorage.getItem('previousPage');
    
    if (storedData) {
      // If data exists, use the stored data
      setPreviousPage(JSON.parse(storedData));
    } else {
      // Otherwise, generate new data and store it
      const previousPageData = location.state?.from || '/'; // Get the previous page or set default to '/'
      setPreviousPage(previousPageData);
      const dataToBeStored = location.state?.from || '/';
      console.log(dataToBeStored, 'Data to be stored')
      localStorage.setItem('previousPage',JSON.stringify(dataToBeStored));
    }
  }, []); // The empty dependency array ensures this runs only on the first render


  const handleSignInClose = () => {
    setSignInOpen(false); // Close the dialog
  };
  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setSignInError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8500/api/v1/user-auth/login', {
        Email: email,
        Password: password,
      }, { withCredentials: true }); // Ensure cookies are included if used

      console.log('Login Successful', response.data.user);

      // Check if token is available and store it in localStorage (or cookies)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored:', response.data.token);
        setIsLoggedIn(true); // Update login status
        console.log(previousPage, "Previous Page");
        console.log(previousPage.pathname,"Path")
        window.location.href = 'http://localhost:5173' + JSON.parse(localStorage.getItem('previousPage')).pathname;
        localStorage.removeItem('previousPage');

      } else {
        throw new Error('Token not found');
      }

      // Redirect based on the role (user or admin)
    //   if (response.data.redirectUrl) {
    //     window.location.href = response.data.redirectUrl;
    //   } else {
    //     throw new Error('Redirect URL not found');
    //   }

    } catch (err) {
      if (err.response && err.response.status === 401) {
        setSignInError('Invalid credentials. Please try again.');
      } else {
        console.error('Login Error', err);
        setSignInError('Login Error. Please check your credentials.');
      }
    }
  }; 
  
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };
  return (
    // <Dialog onClose={handleSignInClose} open={signInOpen}>
   
    <div className="signin-page">
      <div className="signin-container">
        <h2>Sign In</h2>
        {signInError && <p className="error-message">{signInError}</p>}
        <form onSubmit={handleSignInSubmit}>
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
          Don't have an account?  <a href="/signup">Sign Up here</a>
        </p>
      </div>
  
    </div>
//   </Dialog>
  );
}