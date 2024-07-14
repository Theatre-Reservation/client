import React from "react";

import { NavLink } from "react-router-dom";
import "../../styles/header.css";

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
              to="/shows"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Shows
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Booking
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
