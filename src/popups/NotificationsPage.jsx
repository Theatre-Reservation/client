import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "/src/styles/NotificationsPage.css"; 
import Dialog from "@mui/material/Dialog"


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true);


  useEffect(() => {

    



    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:8500/api/v1/notifications");
        
        setNotifications(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load notifications");
        setLoading(false);
      }
    };
    
    fetchNotifications();

      // Handle real-time notifications
      const socket = io("http://localhost:8500/api/v1");
      socket.on("notification", (newNotification) => {
        setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
      });
  
      // Clean up the socket connection
      return () => {
        socket.disconnect();
      };
  }, []);

  const handleClose = () => {
    setOpen(false) ;   //close the dialog
  }

  return (
    <Dialog onClose={handleClose} open={open}>
    <div className="notifications-page">
      <h1>Your Notifications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
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
  );
}
