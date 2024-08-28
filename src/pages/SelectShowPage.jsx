import React, { useState, useEffect } from 'react';
import "../styles/selectShowPage.css";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SelectShowPage = () => {
    const { movieTitle } = useParams();
    const [shows, setShows] = useState([]);
    const [movieDetails, setMovieDetails] = useState(null);
    
    useEffect(() => {
        // Fetch movie details
        axios.get(`http://localhost:3000/movies/title/${encodeURIComponent(movieTitle)}`)
            .then(response => {
                setMovieDetails(response.data);
            });

        // Fetch shows related to the movie
        axios.get(`http://localhost:3000/booking/by-movie?movieTitle=${encodeURIComponent(movieTitle)}`)
            .then(response => {
                const sortedShows = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
                setShows(sortedShows);
            });
    }, [movieTitle]);

    if (!movieDetails) {
        return <div>Loading...</div>;
    }

    // Function to format date as "Day | Sep 01"
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const monthAndDay = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        return `${dayOfWeek} | ${monthAndDay}`;
    };

    // Group shows by date and theater
    const groupedShows = shows.reduce((acc, show) => {
        const date = show.date;
        const theater = show.theater;

        if (!acc[date]) {
            acc[date] = {};
        }
        if (!acc[date][theater]) {
            acc[date][theater] = [];
        }
        acc[date][theater].push(show);
        return acc;
    }, {});

    // Sort showtimes within each theater
    const sortedGroupedShows = Object.keys(groupedShows).reduce((acc, date) => {
        acc[date] = Object.keys(groupedShows[date]).reduce((theaterAcc, theater) => {
            theaterAcc[theater] = groupedShows[date][theater].sort((a, b) => new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`));
            return theaterAcc;
        }, {});
        return acc;
    }, {});

    return (
        <div className="select-show-page">
            <div className="movie-cover" style={{ backgroundImage: `url(${movieDetails.cover_path})` }}>
                <div className="overlay">
                    <div className="movie-header">
                        <img src={movieDetails.poster_path} alt={movieDetails.title} className="movie-poster" />
                        <div className="movie-details">
                            <h1>{movieDetails.title}</h1>
                            <div className="movie-meta">
                                <span className="movie-language">{movieDetails.language}</span>
                                <span className="movie-genres">{movieDetails.main_genre} | {movieDetails.sub_genres.join(' | ')}</span>
                                <span className="movie-release-date">{new Date(movieDetails.released_date).toLocaleDateString()}</span>
                                <span className="movie-runtime">{movieDetails.runtime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="theatre-list">
                {shows.length === 0 ? (
                    <div className="no-shows-message">No shows available</div>
                ) : (
                    Object.keys(sortedGroupedShows).map(date => (
                        <div key={date}>
                            <h2 className="date-header">{formatDate(date)}</h2>
                            {Object.keys(sortedGroupedShows[date]).map(theater => (
                                <div key={theater} className="theatre-item">
                                    <h3>{theater}</h3>
                                    <div className="show-times">
                                        {sortedGroupedShows[date][theater].map(show => (
                                            <div key={show._id} className="time-button-wrapper">
                                                <button className="time-button">{show.time}</button>
                                                <div className="price-popup">
                                                    LKR {show.price.toFixed(2)}<br />
                                                    Remaining seats: {show.available_seats}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SelectShowPage;
