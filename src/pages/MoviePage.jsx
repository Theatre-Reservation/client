import React from 'react';
import '../styles/moviePage.css';

const MoviePage = () => {
    return (
        <div className="movie-page">
            <div className="movie-header">
                <div className="movie-poster">
                    <img src="path_to_poster_image" alt="Movie Poster" />
                </div>
                <div className="movie-info">
                    <h1>Deadpool & Wolverine</h1>
                    <div className="movie-details">
                        <span>English</span>
                        <span className="movie-genre">Action | Adventure | Comedy</span>
                        <span>26 Jul, 2024</span>
                        <span>2 hrs 08 mins</span>
                    </div>
                    <button className="book-tickets">Book Tickets</button>
                </div>
            </div>
            <div className="movie-tabs">
                <div className="tab active">Summary</div>
                <div className="tab">User Reviews</div>
                <div className="tab">Critic Reviews</div>
            </div>
            <div className="movie-content">
                <h2>Synopsis</h2>
                <p>Marvel Studios’ 'Deadpool & Wolverine' delivers the ultimate, iconic, cinematic team-up throwdown on July 26.</p>
                <h2>Cast</h2>
                <div className="cast-list">
                    <div className="cast-member">
                        <img src="path_to_cast_image" alt="Ryan Reynolds" />
                        <p>Ryan Reynolds</p>
                        <p>Actor</p>
                    </div>
                    <div className="cast-member">
                        <img src="path_to_cast_image" alt="Hugh Jackman" />
                        <p>Hugh Jackman</p>
                        <p>Actor</p>
                    </div>
                    {/* Add more cast members here */}
                </div>
                <h2>Crew</h2>
                <div className="crew-list">
                    <div className="crew-member">
                        <img src="path_to_crew_image" alt="Shawn Levy" />
                        <p>Shawn Levy</p>
                        <p>Director</p>
                    </div>
                    <div className="crew-member">
                        <img src="path_to_crew_image" alt="Ryan Reynolds" />
                        <p>Ryan Reynolds</p>
                        <p>Writer</p>
                    </div>
                    {/* Add more crew members here */}
                </div>
            </div>
        </div>
    );
};

export default MoviePage;


