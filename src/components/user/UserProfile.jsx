import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import '/src/styles/UserProfile.css';

export default function UserProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Add state for email
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status

  const socket = io("http://localhost:5173", {
    transports: ['websocket'],
    withCredentials: true,
  });

  // Listen for notifications from the WebSocket server
  socket.on("notification", (newNotification) => {
    console.log("New notification:", newNotification);
    setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
  });

  // Fetch login details when the user logs in
  useEffect(() => {
    const fetchLoginDetails = async () => {
      try {
        const response = await axios.get("profile-auth/user_logged_in");
        console.log(response.data, "Profile Details");
  
        // Extract the profile details (Name and Email) from the response
        const { updatedProfile } = response.data;
  
        setName(updatedProfile.Name);   // Set name from the response
        setEmail(updatedProfile.Email); // Set email from the response
        setLoading(false);
      } catch (err) {
        console.error("Failed to load profile details:", err);
        setLoading(false);
      }
    };

    // Fetch user data only if logged in
    if (isLoggedIn) {
      fetchLoginDetails();
    }
  }, [isLoggedIn]); // Dependency array includes isLoggedIn

  // WebSocket event listener for login
  useEffect(() => {
    console.log("Listener Listening")
    socket.on('user_logged_in', () => {
      console.log('User logged in event received');
      setIsLoggedIn(true); // Set login status to true
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSave = () => {
    // Send updated name and email to the server
    console.log('Profile Updated:', { name, email });
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="profile-info">
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>
      )}
      <div className="profile-actions">
        <button onClick={handleSave} className="save-button">
          Save
        </button>
      </div>
    </div>
  );
}
