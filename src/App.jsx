import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import BookingPage from "./pages/BookingPage";
import SingleMoviePage from "./pages/SingleMoviePage";
import Headers from "./components/common/Header";
import SignInPage from "./components/user/SignInPage";
import SignUpPage from "./components/user/SignUpPage";
import UserProfile from "./components/user/UserProfile";
import NotificationsPage from "./popups/NotificationsPage";
import ContactUs from "./popups/ContactUs";

function App() {
  return (
    <Router>
      <div>
        <Headers />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie" element={<MoviePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<UserProfile />} />

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/ContactUs" element ={<ContactUs />} />

          <Route path="/movie/:id" element={<SingleMoviePage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
