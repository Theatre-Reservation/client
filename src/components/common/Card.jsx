import React from 'react';
import '../../styles/card.css';

const Card = ({ title, genre, description, image  }) => {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <h3 className="card-genre">{genre}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

export default Card;
