import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/singleMoviePage.css';
import { useUser } from './UserContext';

const SingleMoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();

  const bookNow = (title) => {
    navigate("/selectshow/" + title);
  };

  useEffect(() => {
    fetch(`https://booking-service-hwe2cmdjaebvh0ee.canadacentral-01.azurewebsites.net/movies/single/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  useEffect(() => {
    fetch(`https://booking-service-hwe2cmdjaebvh0ee.canadacentral-01.azurewebsites.net/reviews/movie/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoadingReviews(false);
      })
      .catch(() => setLoadingReviews(false));
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;
    setSubmitting(true);

    const reviewData = {
      userId: user._id,
      userName: user.Name,
      movieId: id,
      comment: newReview,
    };

    try {
      const response = await fetch('https://booking-service-hwe2cmdjaebvh0ee.canadacentral-01.azurewebsites.net/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const createdReview = await response.json();
        setReviews([createdReview, ...reviews]);
        setNewReview('');
      }
    } catch (error) {
      console.error('Failed to submit review', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single-movie-page">
      <div className="movie-cover" style={{ backgroundImage: `url(${movie.cover_path})` }}>
        <div className="overlay-1">
          <div className="movie-header">
            <img src={movie.poster_path} alt={movie.title} className="movie-poster-1" />
            <div className="movie-details-1">
              <h1>{movie.title}</h1>
              <div className="movie-meta">
                <span className="movie-language">{movie.language}</span>
                <span className="movie-genres">{movie.main_genre} | {movie.sub_genres.join(' | ')}</span>
                <span className="movie-release-date">Released Date: {new Date(movie.released_date).toLocaleDateString()}</span>
                <span className="movie-runtime">Run Time: {movie.runtime}</span>
              </div>
              <button className="book-tickets-btn" onClick={() => bookNow(movie.title)}>Book Tickets</button>
            </div>
          </div>
        </div>
      </div>

      <div className="movie-synopsis">
        <h2 className="underline-title">Summary</h2>
        <p className="movie-description">{movie.description}</p>
      </div>

      <div className="user-reviews">
        <h2 className="underline-title">Movie Reviews</h2>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to add one!</p>
        ) : (
          <ul className="review-list">
            {reviews.map((review) => (
              <li key={review._id} className="review-item">
                <div className="review-content">
                  <strong className="review-author">{review.userName}</strong>
                  <p>{review.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {user ? (
          <div className="add-review">
            <textarea
              placeholder="Write your review..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows="4"
              className="review-textarea"
            />
            <button 
              onClick={handleReviewSubmit} 
              className="submit-review-btn" 
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        ) : (
          <p>Please log in to add a review.</p>
        )}
      </div>
    </div>
  );
};

export default SingleMoviePage;
