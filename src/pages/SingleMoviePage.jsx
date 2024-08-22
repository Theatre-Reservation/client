import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/singleMoviePage.css';

const SingleMoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/movies/single/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single-movie-page">
      <div 
        className="movie-cover" 
        style={{ backgroundImage: `url(${movie.cover_path})` }}
      >
        <div className="overlay">
          <div className="movie-header">
            <img src={movie.poster_path} alt={movie.title} className="movie-poster" />
            <div className="movie-details">
              <h1>{movie.title}</h1>
              <div className="movie-meta">
                <span className="movie-language">{movie.language}</span>
                <span className="movie-genres">{movie.main_genre} | {movie.sub_genres.join(' | ')}</span>
                <span className="movie-release-date">{new Date(movie.released_date).toLocaleDateString()}</span>
                <span className="movie-runtime">{movie.runtime}</span>
              </div>
              <button className="book-tickets-btn">Book Tickets</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="movie-synopsis">
        <h2>Summery</h2>
        <p>{movie.description}</p>
      </div>

      <div className="user-reviews">
        <h2>User Reviews</h2>
        <p>No reviews yet.</p>
      </div>
    </div>
  );
};

export default SingleMoviePage;
