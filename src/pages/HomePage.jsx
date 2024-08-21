import React, { useState, useEffect } from "react";
import Card from "../components/common/Card";
import '../styles/homePage.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [events, setEvents] = useState([]);

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

  useEffect(() => {
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
      <section>
        <h2>Recommended for You</h2>
        <div className="card-container">
          {recommended.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              genre={item.genre}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      </section>

      <section>
        <h2>Movies</h2>
        <div className="card-container">
          {movies.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              genre={item.main_genre}
              image={item.poster_path}
            />
          ))}
        </div>
      </section>

      <section>
        <h2>Events</h2>
        <div className="card-container">
          {events.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              genre={item.venue}  // Didn't change the Card component. Just match with the data that want to display.
              description={item.date} // Didn't change the Card component. Just match with the data that want to display.
              image={item.poster_path}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
