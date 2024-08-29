import React, { useState } from "react"; // Import useState from React
import Dialog from "@mui/material/Dialog"; // Import Dialog correctly
import '/src/styles/ContactUs.css';

export default function ContactUs() {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  return (
    <Dialog onClose={handleClose} open={open}>
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
  );
}
