import React, { useState } from 'react';
import axios from 'axios';
import './../../src/styles/Eticket.css';
import { useLocation } from 'react-router-dom'; 

const ETicketGenerator = () => {

  const location = useLocation(); 

  const [qrCodeUrl, setQrCodeUrl] = useState(null); // To store the QR code URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mailDetails, setMailDetails] = useState(null);

  // Capture the passed data 
  const {
    userName = '',
    userEmail = '',

    movieName = '',
    theatreName = '',
    selectedSeats = [],

    eventTitle = '',
    venue = '',
    ticketCount = 0,

  } = location.state || {};

  // Determine if this is a movie or an event 
  const isMovie = !!movieName;
  
  console.log('Captured Dataeefee:', {
    userName,
    userEmail,
    movieName,
    theatreName,
    selectedSeats,
    eventTitle,
    venue,
    ticketCount,
    isMovie,
  });


  // Handle generating e-ticket
  const generateETicket = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call the backend to generate the e-ticket and QR code
      const response = await axios.post('https://notification-service-fydkg2d3b8bxa8d9.canadacentral-01.azurewebsites.net/api/v1/mail/send-qrcode', {
        userName,
        userEmail,
        movieName,
        theatreName,
        selectedSeats,
        eventTitle,
        venue,
        ticketCount,
        isMovie,
      });
      
      console.log('Response from server:', response.data);

      // Store the QR code URL from the backend response (Firebase URL)
      setQrCodeUrl(response.data.qrCodeURL);
      console.log(userName, movieName)
      setMailDetails({
        userName: userName,
        userEmail: userEmail,
        movieName: movieName,
        theatreName: theatreName,
        selectedSeats: selectedSeats,
        eventTitle: eventTitle,
        venue: venue,
        ticketCount: ticketCount,
        isMovie: isMovie,
      });

    } catch (err) {
      setError('Error generating e-ticket: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eticket-container">
      {!qrCodeUrl  && (
      <h1 className="eticket-h1">E-Ticket Generator</h1>
      )}
      {error && <div className="eticket-error" style={{ color: 'red' }}>{error}</div>}


        <div>
        {!qrCodeUrl  && (
          <><h2 className="eticket-h2">Generate Your E-Ticket</h2><p className="eticket-p">Click the button below to generate your E-Ticket.</p><button className="eticket-button" onClick={generateETicket} disabled={loading}>
            {loading ? 'Generating...' : 'Generate E-Ticket'}
          </button></>
        )}

          {mailDetails && (
            <div>
              <h2 className="eticket-h2" style={{ color: '#333' }}>🎟️ Your E-Ticket for {mailDetails.movieName ? mailDetails.movieName : mailDetails.eventTitle}</h2>
              <p className="eticket-p">Hi <strong>{mailDetails.userName}</strong>,</p>
              <p className="eticket-p">Thank you for booking your ticket for <strong>{mailDetails.movieName ? mailDetails.movieName : mailDetails.eventTitle}</strong>!</p>
              <h3 className="eticket-h3">Ticket Details:</h3>
              <ul className="eticket-ul">
                <li className="eticket-li"><strong>Movie/Event Name:</strong> {mailDetails.movieName ? mailDetails.movieName : mailDetails.eventTitle}</li>
                <li className="eticket-li"><strong>Theatre:</strong> {mailDetails.theatreName ? mailDetails.theatreName: mailDetails.venue}</li>
                {(mailDetails.selectedSeats != 0) ? (<li className="eticket-li"><strong>Selected Seats:</strong> {mailDetails.selectedSeats}</li>): null}
              </ul>
            </div>
          )}
        </div>
{qrCodeUrl  && (
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
