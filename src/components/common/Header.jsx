import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/header.css";
import Person2Icon from '@mui/icons-material/Person2';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const Header = () => {
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
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
            />
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
