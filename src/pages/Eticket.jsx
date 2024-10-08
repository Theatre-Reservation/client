import React, { useState } from 'react';
import axios from 'axios';
import './../../src/styles/Eticket.css';

const ETicketGenerator = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // To store the QR code URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mailDetails, setMailDetails] = useState(null);

  // Handle generating e-ticket
  const generateETicket = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call the backend to generate the e-ticket and QR code
      const response = await axios.post('http://localhost:8600/api/v1/mail/send-qrcode', {
        mailId: '66ec798d174382eee49ef1ef', // Replace with dynamic mailId if needed
      });
      console.log('Response from server:', response.data);

      // Store the QR code URL from the backend response (Firebase URL)
      setQrCodeUrl(response.data.qrCodeURL);
      setMailDetails({
        name: response.data.mail.name,
        showName: response.data.mail.showName,
        type: response.data.mail.type,
        message: response.data.mail.message,
      });

    } catch (err) {
      setError('Error generating e-ticket: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eticket-container">
      <h1 className="eticket-h1">E-Ticket Generator</h1>
      {error && <div className="eticket-error" style={{ color: 'red' }}>{error}</div>}

      {!qrCodeUrl ? (
        <div>
          <h2 className="eticket-h2">Generate Your E-Ticket</h2>
          <p className="eticket-p">Click the button below to generate your E-Ticket.</p>
          <button className="eticket-button" onClick={generateETicket} disabled={loading}>
            {loading ? 'Generating...' : 'Generate E-Ticket'}
          </button>

          {mailDetails && (
            <div>
              <h2 className="eticket-h2" style={{ color: '#333' }}>🎟️ Your E-Ticket for {mailDetails.showName}</h2>
              <p className="eticket-p">Hi <strong>{mailDetails.name}</strong>,</p>
              <p className="eticket-p">Thank you for booking your ticket for <strong>{mailDetails.showName}</strong>!</p>
              <h3 className="eticket-h3">Event Details:</h3>
              <ul className="eticket-ul">
                <li className="eticket-li"><strong>Event Name:</strong> {mailDetails.showName}</li>
                <li className="eticket-li"><strong>Event Type:</strong> {mailDetails.type}</li>
                <li className="eticket-li"><strong>Message:</strong> {mailDetails.message}</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="eticket-h2">Your E-Ticket</h2>
          <p className="eticket-p">Scan the QR code at the event entrance:</p>
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="eticket-img"
            style={{ border: '1px solid #ddd', padding: '10px', background: '#fff' }}
          />
        </div>
      )}
    </div>
  );
};

export default ETicketGenerator;
