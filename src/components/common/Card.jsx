import React from 'react';
import '../../styles/card.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const FullStar = () => <i className="fas fa-star"></i>;
const HalfStar = () => <i className="fas fa-star-half-alt"></i>;
const EmptyStar = () => <i className="far fa-star"></i>;

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FullStar key={i} />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<HalfStar key={i} />);
    } else {
      stars.push(<EmptyStar key={i} />);
    }
  }

  return stars;
};

const Card = ({ title, genre, description, image, rating }) => {
  return (
    <div className="card">
      <img src="https://via.placeholder.com/100" alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <h3 className="card-genre">{genre}</h3>
        <p className="card-description">{description}</p>
        <div className="card-rating">
          <div className="stars">{renderStars(rating)}</div>
          <div className="rating-number">{rating}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
