import React, { useState } from 'react';
import axios from 'axios';
import './../../src/styles/SearchBar.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Handle input changes as the user types
  const handleInputChange = async (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Call the search API only if there's input
    if (newQuery.length > 0) {
      try {
        console.log(newQuery, "New Query");
        // Call the backend search API (replace with your actual backend URL)
        const response = await axios.get('http://localhost:8600/api/v1/movies/search', {
          params: { q: newQuery }, // query parameter
        });
        setSearchResults(response.data); // Update results based on the response
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]); // Clear results if an error occurs
      }
    } else {
      setSearchResults([]); // Clear results if the query is empty
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={handleInputChange}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {/* Display search results right under the search bar */}
      <div className="results-container">
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((result) => (
              <li key={result._id} className="search-result-item">
                <img src={result.poster_path} alt={result.title} width="50" style={{ marginRight: '10px' }} />
                <div>
                  <strong>{result.title}</strong>
                  <p>{result.main_genre}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
