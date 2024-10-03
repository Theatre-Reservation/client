import React, { useState, useEffect } from "react";
import Card from "../components/common/Card";
import '../styles/homePage.css';
import { useNavigate } from "react-router-dom";
import { useUser } from './UserContext'; // Import the useUser hook

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate=useNavigate(); 
  const { user } = useUser(); // Access user data from context

  const onClickMovie=(id)=>{
    console.log(id)
    navigate('/movie/'+id)
  }

  const onClickEvent=(id)=>{
    console.log(id)
    navigate('/event/'+id)
  }

  const viewAllMovies = () => {
    navigate('/movies');
  }

  const viewAllEvents = () => {
    navigate('/events');
  }

  // Dummy data for recommended movies
  const recommended = [
    {
      title: 'Inception',
      genre: 'Sci-fi',
      description: 'A mind-bending thriller by Christopher Nolan.',
      image: 'https://placehold.co/100',
    },
    {
      title: 'Indian 2',
      genre: 'Tamil',
      description: 'A gripping Tamil action film.',
      image: 'https://placehold.co/100',
    },
  ];
  
  const cardClicked =(id) =>{
    console.log(id)
  }
  useEffect(() => {
    // Fetching movies and events might be dependent on the user data
    console.log("User ID:", user ? user.id : "No user logged in");
    // Fetching movies
    fetch("http://localhost:3000/movies/limited/5-different-genres")
      .then((res) => res.json())
      .then((data) => setMovies(data));

    // Fetching events
    fetch("http://localhost:3000/events/limited/5")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div className="home-page">
      {/* 
      <section>
        <h2>Recommended for You</h2>
        <div className="card-container">
          {recommended.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              genre={item.genre}
              image={item.image}
            />
          ))}
        </div>
      </section>
          */}

      <section>
        <div className="section-header">
          <h2 style={{ marginTop: '20px' }}>Movies</h2> {/* styles just for adjust space */}
          <button className="view-all" onClick={viewAllMovies}>View All</button>
        </div>
        <div className="card-container">
          {movies.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              genre={item.main_genre}
              image={item.poster_path}
              _id={item._id}
              navigate={onClickMovie}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2>Events</h2>
          <button className="view-all" onClick={viewAllEvents}>View All</button>
        </div>
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
      </section>
    </div>
  );
};

export default HomePage;
