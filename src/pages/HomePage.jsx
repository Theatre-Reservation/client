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
      image: 'https://example.com/visal-adare.jpg',
    },
    {
      title: 'Indian 2',
      genre: 'Tamil',
      description: 'Sample description',
      image: 'https://example.com/indian-2.jpg',
    },
    {
      title: 'Kalki 2898 AD',
      genre: 'Tamil',
      description: 'Sample description',
      image: 'https://example.com/kalki-2898-ad.jpg',
    },
    {
      title: 'Sample Movie 4',
      genre: 'Genre 4',
      description: 'Sample description',
      image: 'https://example.com/movie4.jpg',
    },
    {
      title: 'Sample Movie 5',
      genre: 'Genre 5',
      description: 'Sample description',
      image: 'https://example.com/movie5.jpg',
    }
  ];
 
  useEffect(() => {
    fetch("http://localhost:3000/movies")
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, []);
  const movies1 = [
    {
      title: 'Movie 1',
      genre: 'Genre 1',
      description: 'Sample description',
      image: 'https://example.com/movie1.jpg',
    },
    {
      title: 'Movie 2',
      genre: 'Genre 2',
      description: 'Sample description',
      image: 'https://example.com/movie2.jpg',
    },
    {
      title: 'Movie 3',
      genre: 'Genre 3',
      description: 'Sample description',
      image: 'https://example.com/movie3.jpg',
    },
    {
      title: 'Movie 4',
      genre: 'Genre 4',
      description: 'Sample description',
      image: 'https://example.com/movie4.jpg',
    },
    {
      title: 'Movie 5',
      genre: 'Genre 5',
      description: 'Sample description',
      image: 'https://example.com/movie5.jpg',
    }
  ];

  const events = [
    {
      title: 'Event 1',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://example.com/event1.jpg',
    },
    {
      title: 'Event 2',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://example.com/event2.jpg',
    },
    {
      title: 'Event 3',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://example.com/event3.jpg',
    },
    {
      title: 'Event 4',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://example.com/event4.jpg',
    },
    {
      title: 'Event 5',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://example.com/event5.jpg',
    }
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
