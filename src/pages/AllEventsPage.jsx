import React, { useState, useEffect } from "react";
import Card from "../components/common/Card";
import '../styles/allEventsPage.css';
import { useNavigate } from "react-router-dom";

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("https://booking-service-hwe2cmdjaebvh0ee.canadacentral-01.azurewebsites.net/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const navigate=useNavigate(); 
  const onClickEvent=(id)=>{
    console.log(id)
    navigate('/event/'+id)
  }

  return (
    <div className="all-events-page">
      <h2>All Events</h2>
      <div className="card-container">
        {events.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            genre={item.venue}
            description={item.date}
            image={item.poster_path}
            _id={item._id}
            navigate={onClickEvent}
          />
        ))}
      </div>
    </div>
  );
};

export default AllEventsPage;
