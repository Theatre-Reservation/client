import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShowPage from "./pages/ShowPage";
import BookingPage from "./pages/BookingPage";
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
          <Route path="/shows" element={<ShowPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
