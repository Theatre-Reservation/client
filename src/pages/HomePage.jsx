import React from "react";
import Card from "../components/common/Card";
import '../styles/homePage.css';
import react, { useState, useEffect } from "react";
const HomePage = () => {

  const [movies, setMovie] = useState([]);
  
  const recommended = [
    {
      title: 'Inception',
      genre: 'Sci-fi',
      description: 'Sample description',
      image: 'https://placehold.co/100',
    },
    {
      title: 'Indian 2',
      genre: 'Tamil',
      description: 'Sample description',
      image: 'https://placehold.co/100',
    },
  ];
 
  useEffect(() => {
    fetch("http://localhost:3000/movies/limited/5-different-genres")
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, []);

  const events = [
    {
      title: 'Event 1',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://placehold.co/100',
    },
    {
      title: 'Event 2',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://placehold.co/100',
    },
  ];

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
              genre={item.genre}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
