import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/header.css";
import Person2Icon from '@mui/icons-material/Person2';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SearchBar from '../../pages/SearchBar';
import { Dialog, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from '../../axios'; 
import { io } from "socket.io-client";
import "../../../src/styles/NotificationsPage.css";
import "../../../src/styles/SignInPage.css";
import "../../../src/styles/ContactUs.css";
import { useNavigate } from "react-router-dom";

const Header = () => { 
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);
  const [signInError, setSignInError] = useState("");
  const [NotificationOpen, setNotificationOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [ContactOpen, setContactOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [notificationError, setNotificationError] = useState('');
  const [error, setError] = useState(null);
  
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if a token exists in localStorage on component mount
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // User is logged in
    }
  }, []);

  const handleSignInClick = () => {
    setSignInOpen(true);
  };

  const handleSignInClose = () => {
    setSignInOpen(false); // Close the dialog
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
  }

  const handleProfileClose = () => {
    setProfileOpen(false); // Close the dialog
  };

  const handleContactClick = () => {
    setContactOpen(true);
  }

  const handleContactClose = () => {
    setContactOpen(false); // Close the dialog
  };

  const handleNotificationClick = () => {
    setNotificationOpen(true);
  }

  const handleNotificationClose = () => {
    setNotificationOpen(false); // Close the dialog
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setSignInError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('/user-auth/login', {
        Email: email,
        Password: password,
      }, { withCredentials: true }); // Ensure cookies are included if used

      console.log('Login Successful', response.data.user);

      // Check if token is available and store it in localStorage (or cookies)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored:', response.data.token);
        setIsLoggedIn(true); // Update login status
      } else {
        throw new Error('Token not found');
      }

      // Redirect based on the role (user or admin)
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        throw new Error('Redirect URL not found');
      }

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

  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = async (query) => {
    console.log('Searching for:', query);

    try {
      const response = await axios.get('/search', {
        params: { q: query },
      });
      
      setSearchResults(response.data);
      console.log('Search Results:', response.data);
    } catch (error) {
      console.error('Search Error:', error);
      setSearchResults([]); // Clear search results on error
    }
  };

  return (
    <header className="header">
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Movies
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Events
            </NavLink>
          </li>

          <li className="nav-item search-item">
            <SearchBar onSearch={handleSearch} />
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((result, index) => (
                  <li key={index} className="search-result-item">
                    {result.name} {/* Customize to display relevant data */}
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Notification Icon */}
          <li className="nav-item">
            <NavLink
              onClick={handleNotificationClick}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              <NotificationsActiveIcon className="icon" />
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              onClick={handleContactClick}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Contact Us
            </NavLink>
          </li>

          {/* Conditionally render Sign In button or Profile icon */}
          {isLoggedIn ? (
            <li className="nav-item">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <Person2Icon style={{ marginRight: '8px' }} />
              </NavLink>
            </li>
          ) : (
            <li className="nav-item">
              <NavLink
                onClick={handleSignInClick}
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                Sign In
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <Dialog onClose={handleSignInClose} open={signInOpen}>
        <div className="signin-page">
          <div className="signin-container">
            <h2>Sign In</h2>
            {signInError && <p className="error-message">{signInError}</p>}
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
    </header>
  );
};

export default Header;
