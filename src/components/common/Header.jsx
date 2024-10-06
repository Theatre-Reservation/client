import React,{ useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/header.css";
import Person2Icon from '@mui/icons-material/Person2';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SearchBar from '../../pages/SearchBar' ;
import {Dialog,IconButton} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from '../../axios'; 
import { io } from "socket.io-client";
import "../../../src/styles/NotificationsPage.css";
import "../../../src/styles/SignInPage.css";
import "../../../src/styles/ContactUs.css";
import { useNavigate } from "react-router-dom";

const Header = () => { 
  const [notifications, setNotifications] = useState([]);
  const navigate=useNavigate(); 
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
  const handleSignInClick = () => {
    setSignInOpen(true);

  }

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
  // This function can be defined to handle the search query submission
  const handleSearch = async (query) => {
    console.log('Searching for:', query);

    try {
      // Make a GET request to the search endpoint with the query parameter
      const response = await axios.get('/search', {
        params: { q: query },
      });
      
      // Update the state with the search results
      setSearchResults(response.data);

      // Handle the search results
      console.log('Search Results:', response.data);

      // Perform further actions with the search results if needed
      // For example, redirect to a search results page or update the UI
      // window.location.href = /search-results?query=${query};
    } catch (error) {
      console.error('Search Error:', error);
      // Handle errors appropriately
      setSearchResults([]); // Clear search results on error
    }

  
   
  };
  // useEffect(() => {
  //   // Fetch notifications from the backend
  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8600/api/v1/notifications");
        
  //       setNotifications(response.data);
  //       setLoading(false);
  //     } catch (err) {
  //       setError("Failed to load notifications");
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchNotifications();
  //     // Handle real-time notifications
  //     const socket = io("http://localhost:8600" ,{
  //       transports: ['websocket'],
  //       withCredentials: true,  // Send cookies with the request
  //     });
  //     socket.on("notification", (newNotification) => {
  //       // console.log(newNotification.data);
  //       setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
  //       // console.log(Notification)
  //     });
  
  //     // Clean up the socket connection
  //     // return () => {
  //     //   socket.disconnect();
  //     // };
  // }, []);
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
              {/* Conditionally render search results below the search bar */}
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
              onClick={() => {handleNotificationClick();

              }}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              <NotificationsActiveIcon className="icon" />
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
             onClick={() => {
              handleContactClick();
            }}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
             Contact Us
            </NavLink>
          </li>



          <li className="nav-item">
            <NavLink
            onClick={() => {
              handleSignInClick();
            }}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Sign In
            </NavLink>
          </li>
          <li className="nav-item">
          <NavLink  to="/profile"
            // onClick={() => {
            //   handleProfileClick();
            // }}
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <Person2Icon style={{ marginRight: '8px' }} /> {/* Adds some space between the icon and text */}
          </NavLink>
          </li>
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
    <Dialog onClose={handleContactClose} open={ContactOpen}>
       <div className="contact-us-dialog">
        <h2>Contact Us</h2>
        <p>
          Have questions or need assistance with your theater reservations? We're here to help! 
          Reach out to us via email at <a href="mailto:support@theaterreservations.com">support@theaterreservations.com</a> 
            or give us a call at (555) 123-4567. 
        </p>
        <p>Our team is available 24/7 to assist you with your booking needs.</p>
      </div>
    </Dialog>
    <Dialog onClose={handleNotificationClose} open={NotificationOpen}>
    <div className="notifications-page">
      <h1>Your Notifications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : notificationError ? (
        <p>{notificationError}</p>
      ) : notifications.length > 0 ? (
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li key={notification._id} className="notification-item">
              <div className="notification-content">
                <h3 className="show-name">{notification.ShowName || "General Notification"}</h3>
                <p className="notification-message">{notification.Message}</p>
                <p className="notification-time">
                  {new Date(notification.Timestamp).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications at the moment.</p>
      )}
    </div>
    </Dialog>
    </header>
  );
};

export default Header;





