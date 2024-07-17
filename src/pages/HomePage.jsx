import React from "react";
import Card from "../components/common/Card";
import '../styles/homePage.css';

const HomePage = () => {
  const recommended = [
    {
      title: 'Inception',
      genre: 'Sci-fi',
      description: 'Sample description',
      image: 'https://example.com/visal-adare.jpg',
      rating: '4.5'
    },
    {
      title: 'Indian 2',
      genre: 'Tamil',
      description: 'Sample description',
      image: 'https://example.com/indian-2.jpg',
      rating: '4.7'
    },
    {
      title: 'Kalki 2898 AD',
      genre: 'Tamil',
      description: 'Sample description',
      image: 'https://example.com/kalki-2898-ad.jpg',
      rating: '4.8'
    },
    {
      title: 'Sample Movie 4',
      genre: 'Genre 4',
      description: 'Sample description',
      image: 'https://example.com/movie4.jpg',
      rating: '4.9'
    },
    {
      title: 'Sample Movie 5',
      genre: 'Genre 5',
      description: 'Sample description',
      image: 'https://example.com/movie5.jpg',
      rating: '5.0'
    }
  ];

  const movies = [
    {
      title: 'Movie 1',
      genre: 'Genre 1',
      description: 'Sample description',
      image: 'https://example.com/movie1.jpg',
      rating: '4.5'
    },
    {
      title: 'Movie 2',
      genre: 'Genre 2',
      description: 'Sample description',
      image: 'https://example.com/movie2.jpg',
      rating: '4.7'
    },
    {
      title: 'Movie 3',
      genre: 'Genre 3',
      description: 'Sample description',
      image: 'https://example.com/movie3.jpg',
      rating: '4.8'
    },
    {
      title: 'Movie 4',
      genre: 'Genre 4',
      description: 'Sample description',
      image: 'https://example.com/movie4.jpg',
      rating: '4.9'
    },
    {
      title: 'Movie 5',
      genre: 'Genre 5',
      description: 'Sample description',
      image: 'https://example.com/movie5.jpg',
      rating: '5.0'
    }
  ];

  const events = [
    {
      title: 'Event 1',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://example.com/event1.jpg',
      rating: '4.5'
    },
    {
      title: 'Event 2',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://example.com/event2.jpg',
      rating: '4.7'
    },
    {
      title: 'Event 3',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://example.com/event3.jpg',
      rating: '4.8'
    },
    {
      title: 'Event 4',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://example.com/event4.jpg',
      rating: '4.9'
    },
    {
      title: 'Event 5',
      genre: 'Music Show',
      description: 'Sample description',
      image: 'https://example.com/event5.jpg',
      rating: '5.0'
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
              rating={item.rating}
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
              genre={item.genre}
              description={item.description}
              image={item.image}
              rating={item.rating}
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
              rating={item.rating}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
