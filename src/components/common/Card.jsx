import React from 'react';
import '../../styles/card.css';


const Card = ({ title, genre, description, image,_id ,navigate }) => {
  return (
    <div className="card" onClick={()=>{navigate(_id)}}>
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <h3 style={{marginBottom: 0 }} className="card-genre">{genre}</h3>
        <p style={{marginTop: 0}} className="card-description">{description}</p>
      </div>
    </div>
  );
};

export default Card;
