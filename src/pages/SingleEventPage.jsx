import React, { useState, useEffect } from 'react';
import '../styles/singleEventPage.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext'; // Import useUser
import 'bootstrap/dist/css/bootstrap.min.css';

const SingleEventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [showTicketSelector, setShowTicketSelector] = useState(false);
  const navigate = useNavigate(); // For navigation
  const location = useLocation(); // To get current location
  const { user, loading } = useUser(); // Access user and loading state

  useEffect(() => {
    fetch(`https://booking-service-hwe2cmdjaebvh0ee.canadacentral-01.azurewebsites.net/events/single/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.ticket_price) {
          data.ticket_price = parseFloat(data.ticket_price);
        }
        setEvent(data);
      });
  }, [id]);

  const handleBookNow = () => {
    if (loading) {
      // Optionally, show a loading indicator or disable the button
      return;
    }

    if (!user) {
      // User is not logged in, redirect to login page
      navigate('/signin', { state: { from: location } });  
      return;
    }

    // User is logged in, proceed to show ticket selector
    setShowTicketSelector(true);
  };

  const incrementTickets = () => setTicketCount(prev => prev + 1);
  const decrementTickets = () => setTicketCount(prev => Math.max(1, prev - 1));
  const totalPrice = event ? (ticketCount * event.ticket_price).toFixed(2) : 0;

  const handleProceed = () => {
    // Reset the payment status stored in local storage
    sessionStorage.removeItem('paymentStatus');
    
    navigate("/event-payment", {
      state: {
        totalAmount: parseFloat(totalPrice),
        ticketCount,
        eventId: id,
      },
    });
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-container">
      <div className="event-poster">
        <img src={event.poster_path} alt={event.title} />
      </div>
      <div className="event-details">
        <h1 className="event-title">{event.title}</h1>
        <p className="event-description">{event.description}</p>
        <div className="event-info">
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Runtime:</strong> {event.runtime}</p>
          <p><strong>Ticket Price:</strong> LKR {event.ticket_price.toFixed(2)}</p>
          {showTicketSelector && (
            <div className='ticket-container'>
              <div className="ticket-control mx-auto">
                <div className="ticket-heading">Select Tickets:</div>
                <div className="ticket-selection">
                  <button onClick={decrementTickets} className="ticket-change-btn">-</button>
                  <span className="ticket-count">{ticketCount}</span>
                  <button onClick={incrementTickets} className="ticket-change-btn">+</button>
                </div>
                <div className="total-and-proceed">
                  <div className="total-amount">
                    <div>Total Amount:</div>
                    <div>LKR {totalPrice}</div>
                  </div>
                  <button className="proceed-btn mx-auto" onClick={handleProceed}>
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          )}
          {!showTicketSelector && (
            <button onClick={handleBookNow} className="book-now-btn">
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleEventPage;
