import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./../../src/styles/SearchBar.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false); // State to manage visibility
  const searchRef = useRef(null); // Reference to the search bar and results container
  const navigate = useNavigate();

  // Load all data when pathname includes '/'
  const loadAllData = async () => {
    try {
      const [moviesResponse, eventsResponse] = await Promise.all([
        axios.get(
          "https://notification-service-fydkg2d3b8bxa8d9.canadacentral-01.azurewebsites.net/api/v1/movies/search"
        ),
        axios.get(
          "https://notification-service-fydkg2d3b8bxa8d9.canadacentral-01.azurewebsites.net/api/v1/event-search/search"
        ),
      ]);
      // Combine movie and event results
      const allResults = [...moviesResponse.data, ...eventsResponse.data];
      setSearchResults(allResults); // Store combined results
    } catch (error) {
      console.error("Error loading all data:", error);
      setSearchResults([]); // Clear results on error
    }
  };

  // Load all movies and events when pathname includes '/'
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname === "/") {
      loadAllData();
    }
  }, []);
  const getApiEndpoint = () => {
    const pathname = window.location.pathname;
    if (pathname.includes("movies")) {
      return "https://notification-service-fydkg2d3b8bxa8d9.canadacentral-01.azurewebsites.net/api/v1/movies/search";
    } else if (pathname.includes("events")) {
      return "https://notification-service-fydkg2d3b8bxa8d9.canadacentral-01.azurewebsites.net/api/v1/event-search/search";
    }
    return null;
  };
  // Handle input changes as the user types
  const handleInputChange = async (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowResults(true); // Show results when typing

    const pathname = window.location.pathname;

    // Call the appropriate API endpoint based on the URL and query
    if (newQuery.length > 0) {
      try {
        if (pathname === "/") {
          // Fetch from both APIs for combined results
          const [moviesResponse, eventsResponse] = await Promise.all([
            axios.get(
              "https://notification-service-fydkg2d3b8bxa8d9.canadacentral-01.azurewebsites.net/api/v1/movies/search",
              {
                params: { q: newQuery }, // query parameter for movies
              }
            ),
            axios.get(
              "https://notification-service-fydkg2d3b8bxa8d9.canadacentral-01.azurewebsites.net/api/v1/event-search/search",
              {
                params: { q: newQuery }, // query parameter for events
              }
            ),
          ]);
          // Combine results
          const allResults = [...moviesResponse.data, ...eventsResponse.data];
          setSearchResults(allResults); // Update results based on the response
        } else {
          // Fetch based on specific page (movies or events)
          const apiEndpoint = getApiEndpoint(); // Get the API endpoint based on the URL
          if (apiEndpoint) {
            const response = await axios.get(apiEndpoint, {
              params: { q: newQuery }, // query parameter
            });
            setSearchResults(response.data); // Update results based on the response
          }
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
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

  // Function to determine the navigation path based on the current URL
  const handleItemClick = (id) => {
    const pathname = window.location.pathname;

    // Navigate based on whether the user is on the movies or events page
    if (pathname.includes("movies")) {
      navigate(`/movie/${id}`); // Navigate to the movie detail page
    } else if (pathname.includes("events")) {
      navigate(`/event/${id}`); // Navigate to the event detail page
    } else {
      navigate(`/movie/${id}`); // Default to movie detail page
    }
    setShowResults(false); // Hide results when an item is selected
  };

  const handleFocus = () => {
    setShowResults(true); // Show results again when clicking the search bar
  };

  // Click outside to hide results
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside of the search bar and results container
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false); // Hide results when clicked outside
      }
    };

    // Add event listener for clicks outside the component
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-bar" ref={searchRef}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search movies or events..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus} // Show results when the search bar is clicked
          className="search-input"
        />
        <SearchIcon className="search-button" />
        {/* <button type="submit" className="search-button">SearchIcon</button> */}
      </form>

      {/* Display search results under the search bar */}
      {showResults && searchResults.length > 0 && (
        <div className="results-container">
          <ul className="search-results">
            {searchResults.map((result) => (
              <li
                key={result._id}
                className="search-result-item"
                onClick={() => handleItemClick(result._id)} // Pass only the ID to handleItemClick
                style={{ cursor: "pointer" }} // Optional: to change the cursor to a pointer when hovering over the item
              >
                <img
                  src={result.poster_path}
                  alt={result.title}
                  width="50"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <strong>{result.title}</strong>
                  <p>{result.main_genre || result.main_category}</p>{" "}
                  {/* Handle genre/category for both movies and events */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
