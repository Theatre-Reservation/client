import React, { useState, useEffect } from "react";
import Card from "../components/common/Card";
import '../styles/allMoviesPage.css';
import { useNavigate } from "react-router-dom";

const AllMoviesPage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("https://booking-service-hwe2cmdjaebvh0ee.canadacentral-01.azurewebsites.net/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);


  const navigate=useNavigate(); 
  const onClickMovie=(id)=>{
    console.log(id)
    navigate('/movie/'+id)
  }

  return (
    <div className="all-movies-page">
      <h2>All Movies</h2>
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
    </div>
  );
};

export default AllMoviesPage;
