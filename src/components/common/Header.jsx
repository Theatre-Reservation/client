import React,{ useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/header.css";
import Person2Icon from '@mui/icons-material/Person2';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SearchBar from '../../pages/SearchBar' ;
import axios from '../../axios'; 

const Header = () => { 

  const [searchResults, setSearchResults] = useState([]);
  // This function can be defined to handle the search query submission
  const handleSearch = async (query) => {
    console.log('Searching for:', query);

    try {
      // Make a GET request to the search endpoint with the query parameter
      const response = await axios.get('/search', {
        params: { q: query },
      });
      
      // Update the state with the search results
      setSearchResults(response.data);

      // Handle the search results
      console.log('Search Results:', response.data);

      // Perform further actions with the search results if needed
      // For example, redirect to a search results page or update the UI
      // window.location.href = `/search-results?query=${query}`;
    } catch (error) {
      console.error('Search Error:', error);
      // Handle errors appropriately
      setSearchResults([]); // Clear search results on error
    }
   
  };
  return (
    <header className="header">
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Movies
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Events
            </NavLink>
          </li>

          <li className="nav-item search-item">

            <SearchBar onSearch={handleSearch} />
              {/* Conditionally render search results below the search bar */}
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((result, index) => (
                  <li key={index} className="search-result-item">
                    {result.name} {/* Customize to display relevant data */}
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Notification Icon */}
          <li className="nav-item">
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              <NotificationsActiveIcon className="icon" />
            </NavLink>
          </li>

          {/* Profile Icon
          <li className="nav-item">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              <Person2Icon className="icon" />
            </NavLink>
          </li> */}

          {/* Contact us */}
          <li className="nav-item">
            <NavLink
              to="/ContactUs"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
             Contact Us
            </NavLink>
          </li>



          <li className="nav-item">
            <NavLink
              to="/signIn"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Sign In
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;










