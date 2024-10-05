import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import SingleMoviePage from "./pages/SingleMoviePage";
import SingleEventPage from "./pages/SingleEventPage";
import SeatSelectingPage from "./pages/SeatSelectingPage";
import SelectShowPage from "./pages/SelectShowPage";
import Headers from "./components/common/Header";
import Footer from "./components/common/Footer";
import SignUpPage from "./components/user/SignUpPage";
import UserProfile from "./components/user/UserProfile";
import ETicketGenerator from "./pages/Eticket";
import AllMoviesPage from './pages/AllMoviesPage';
import AllEventsPage from './pages/AllEventsPage';
import PaymentPage from "./pages/PaymentPage";
import AdminPage from "./components/user/AdminPage";
// import NotificationsPage from "./popups/NotificationsPage";
// import ContactUs from "./popups/ContactUs";
import SearchBar from "./pages/SearchBar";
import RedirectPage from "./pages/RedirectPage";


function App() {
  return (
    <Router>
      <div>
        <Headers />
        <main style={{ paddingBottom: '4rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          {/* <Route path="/signIn" element={<SignInPage />} /> */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/adminPage" element={<AdminPage/>} />
          {/* <Route path="/notifications" element={<NotificationsPage />} /> */}
          {/* <Route path="/ContactUs" element ={<ContactUs />} /> */}
          <Route path="/Etickets" element={<ETicketGenerator />} />
          <Route path="/movie/:id" element={<SingleMoviePage />} />
          <Route path="/event/:id" element={<SingleEventPage />} />
          <Route path="/selectseats/:showId" element={<SeatSelectingPage />} />
          <Route path="/movies" element={<AllMoviesPage />} />
          <Route path="/events" element={<AllEventsPage />} />
          <Route path="/selectshow/:movieTitle" element={<SelectShowPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/search" element={<SearchBar />} />
          <Route path="/payment/redirect/:sessionId" element={<RedirectPage />} />


        </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
