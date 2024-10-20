import React, { useEffect, useState,useRef  } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/header.css";
import Person2Icon from "@mui/icons-material/Person2";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SearchBar from "../../pages/SearchBar";
import { Button, Dialog, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "../../axios";
import "../../../src/styles/NotificationsPage.css";
import "../../../src/styles/SignInPage.css";
import "../../../src/styles/ContactUs.css";
import { useNavigate } from "react-router-dom";
import "/src/styles/SignUpPage.css";
import { io } from 'socket.io-client'; 

const Header = () => {
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [signInError, setSignInError] = useState("");
  const [NotificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [ContactOpen, setContactOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const signUpTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Check if a token exists in localStorage on component mount
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true); // User is logged in
        if (!socketRef.current) {
          socketRef.current = io('http://localhost:8000');
          socketRef.current.on('newMovie', (movie) => {
            console.log('New movie received:', movie);
            setNotifications((prev) => [movie,...prev ]);
          });
          socketRef.current.on('newShowDiscount', (show) => {
            console.log('New show discount received:', show);
            setNotifications((prev) => [show,...prev ]);
          });
          socketRef.current.on('newEventDiscount', (event) => {
            console.log('New Event discount received:', event);
            setNotifications((prev) => [event,...prev ]);
          });
        }
    
        return () => {
          socketRef.current.disconnect();
          socketRef.current = null;  // Cleanup
        };
      } else {
        setIsLoggedIn(false); // User is not logged in
      }
    };
    fetchUserProfile();
  },[]);

  const handleSignInClick = () => {
    setSignInOpen(true);
  };

  const handleSignInClose = () => {
    setSignInOpen(false); // Close the dialog
  };

  const handleSignUpClick = () => {
    setSignUpOpen(true);
  };

  const handleSignUpClose = () => {
    setSignUpOpen(false); // Close the dialog
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
  };

  const handleProfileClose = () => {
    setProfileOpen(false); // Close the dialog
  };

  const handleContactClick = () => {
    setContactOpen(true);
  };

  const handleContactClose = () => {
    setContactOpen(false); // Close the dialog
  };

  const handleNotificationClick = () => {
    setNotificationOpen(true);
  };
  const handleSignIn = () => {
    setSignInOpen(true);
    setSignUpOpen(false);
  };

  const handleSignUp = () => {
    setSignInOpen(false);
    setSignUpOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false); // Close the dialog
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    // Form validation
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    // Reset error if form is valid
    setError("");

    // Call API to sign up the user
    axios
      .post("/user-auth/signup", {
        Name: name,
        Email: email,
        Password: password,
      })
      .then((res) => {
        console.log("Sign Up Success:", res.data);
        setSignInOpen(true);
        setSignUpOpen(false);
      })
      .catch((err) => {
        console.error("Sign Up Error:", err);
        // setError('An error occurred during sign-up. Please try again.');
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("An error occurred during sign-up. Please try again.");
        }
      });
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setSignInError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post('https://auth-service1-bkdhfbh9a3a2g4ba.canadacentral-01.azurewebsites.net/api/v1/user-auth/login', {
        Email: email,
        Password: password,
      }, { withCredentials: true }); // Ensure cookies are included if used

      console.log("Login Successful", response.data.user);

      // Check if token is available and store it in localStorage (or cookies)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Token stored:", response.data.token);
        setIsLoggedIn(true); // Update login status
      } else {
        throw new Error("Token not found");
      }

      // Redirect based on the role (user or admin)
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        throw new Error("Redirect URL not found");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setSignInError("Invalid credentials. Please try again.");
      } else {
        console.error("Login Error", err);
        setSignInError("Login Error. Please check your credentials.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = async (query) => {
    console.log("Searching for:", query);

    try {
      const response = await axios.get("/search", {
        params: { q: query },
      });

      setSearchResults(response.data);
      console.log("Search Results:", response.data);
    } catch (error) {
      console.error("Search Error:", error);
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
          

          {/* search bar */}
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

          {/* <li className="nav-item">
            <NavLink
              onClick={handleContactClick}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Contact Us
            </NavLink>
          </li> */}

          {/* Conditionally render Sign In button or Profile icon */}
          {isLoggedIn ? (
            <li className="nav-item">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <Person2Icon style={{ marginRight: "8px" }} />
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
                <Button variant="contained" color="primary">
                  Sign In
                </Button>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <Dialog onClose={handleSignInClose} open={signInOpen}>
        <div className="signin-page">
          <div className="signin-container">
            <h2>Flash Ticket</h2>
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
                    type={showPassword ? "text" : "password"} // Conditionally set input type
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
              Don't have an account?{" "}
              <button onClick={() => handleSignUp()}>Sign up here</button>
            </p>
          </div>
        </div>
      </Dialog>

      {/* <Dialog onClose={handleContactClose} open={ContactOpen}>
        <div className="contact-us-dialog">
          <h2>Contact Us</h2>
          <p>
            Have questions or need assistance with your theater reservations?
            We're here to help! Reach out to us via email at{" "}
            <a href="mailto:support@theaterreservations.com">
              support@theaterreservations.com
            </a>
            or give us a call at (555) 123-4567.
          </p>
          <p>
            Our team is available 24/7 to assist you with your booking needs.
          </p>
        </div>
      </Dialog> */}
      <Dialog onClose={handleNotificationClose} open={NotificationOpen}>
      <div className="notifications-page">
        <h1>Your Notifications</h1>
          {notifications.length > 0 ? (
  <ul className="notifications-list">
    {/* {notifications 
    .slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => new Date(b.released_date) - new Date(a.released_date))
    .map((newMovie) => (
      <li key={newMovie.admin_id} className="notification-item">
        <div className="notification-content">
          <h3 className="show-name"><strong>New Movie Added : </strong>{newMovie.title }</h3>
          <p className="notification-message"><strong>Language:</strong> {newMovie.language || "N/A"}</p>
          <p className="notification-message"><strong>Description:</strong> {newMovie.description || "No description available."}</p>
          <p className="notification-message"><strong>Main Genre:</strong> {newMovie.main_genre || "N/A"}</p>
          <p className="notification-message"><strong>Released Date :</strong> {newMovie.released_date.substring(0, 10) || "N/A"}</p>
          
        </div>
      </li>
    ))} */}
  </ul>
) : (
  <p>No notifications yet</p>
)}
      
      </div>
      </Dialog>

      <Dialog onClose={handleSignUpClose} open={signUpOpen}>
        <div className="signup-page">
          <div className="signup-container">
            <h2>Sign Up</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSignUpSubmit}>
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
                <label htmlFor="password">Password:</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"} // Conditionally set input type
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={signUpTogglePasswordVisibility}
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
            <p className="signup-message">
              Already have an account?{" "}
              <button onClick={() => handleSignIn()}>Sign in here</button>
            </p>
          </div>
        </div>
      </Dialog>
    </header>
  );
};

export default Header;
