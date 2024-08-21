import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import BookingPage from "./pages/BookingPage";
import SingleMoviePage from "./pages/SingleMoviePage";
import Headers from "./components/common/Header";

function App() {
  return (
    <Router>
      <div>
        <Headers />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie" element={<MoviePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/movie/:id" element={<SingleMoviePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
