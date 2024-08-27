import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import BookingPage from "./pages/BookingPage";
import SingleMoviePage from "./pages/SingleMoviePage";
import SingleEventPage from "./pages/SingleEventPage";
import SeatSelectingPage from "./pages/SeatSelectingPage";
import Headers from "./components/common/Header";
import SignInPage from "./components/user/SignInPage";
import SignUpPage from "./components/user/SignUpPage";
import UserProfile from "./components/user/UserProfile";

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
          <Route path="/movie/:id" element={<SingleMoviePage />} />
          <Route path="/event/:id" element={<SingleEventPage />} />
          <Route path="/SelectSeats" element={<SeatSelectingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
