import React, { useState, useEffect } from 'react';
import '../styles/singleEventPage.css';
import { useParams } from 'react-router-dom';

const SingleEventPage = () => {
  const { id } = useParams(); // Extract event ID from the route
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Fetch event details from your backend
    fetch(`http://localhost:3000/events/single/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data));
  }, [id]);

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
          <p><strong>Ticket Price:</strong> {event.ticket_price}</p>
        </div>
        <button className="book-now-btn">Book Now</button>
      </div>
    </div>
  );
};

export default SingleEventPage;
