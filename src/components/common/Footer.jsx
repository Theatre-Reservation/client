import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/footer.css";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>
            We offer a seamless experience for booking tickets online for the latest
            movies, events, and theater shows. Our mission is to make entertainment
            accessible from anywhere with just a few clicks.
          </p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <NavLink to="/" className="footer-link">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/movies" className="footer-link">
                Movies
              </NavLink>
            </li>
            <li>
              <NavLink to="/events" className="footer-link">
                Events
              </NavLink>
            </li>
            <li>
              <NavLink to="/contactUs" className="footer-link">
                Contact Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/signIn" className="footer-link">
                Sign In
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>
            Email: support@theaterbooking.com
            <br />
            Phone: +94 123 456 789
          </p>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
              <FacebookIcon className="icon" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
              <TwitterIcon className="icon" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
              <InstagramIcon className="icon" />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
              <YouTubeIcon className="icon" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Theater Booking System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
