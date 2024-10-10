import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SingleMoviePage from "./pages/SingleMoviePage";
import SingleEventPage from "./pages/SingleEventPage";
import SeatSelectingPage from "./pages/SeatSelectingPage";
import SelectShowPage from "./pages/SelectShowPage";
import Headers from "./components/common/Header";
import Footer from "./components/common/Footer";
import SignUpPage from "./components/user/SignUpPage";
import SignInPage from "./components/user/SignInPage";
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
import EventPaymentPage from './pages/EventPaymentPage'; // New import for event payment page
import EventRedirectPage from './pages/EventRedirectPage'; // New import for event redirect page
import { UserProvider } from './pages/UserContext';
import PrivateRoute from './pages/PrivateRoute';

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <Headers />
          <main style={{ paddingBottom: '4rem' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/adminPage" element={<AdminPage/>} />
            {/* <Route path="/notifications" element={<NotificationsPage />} /> */}
            {/* <Route path="/ContactUs" element ={<ContactUs />} /> */}
            <Route path="/Etickets" element={<ETicketGenerator />} />
            <Route path="/movie/:id" element={<SingleMoviePage />} />
            <Route path="/event/:id" element={<SingleEventPage />} />
            <Route path="/selectseats/:showId" element={<PrivateRoute><SeatSelectingPage /></PrivateRoute>} />
            <Route path="/movies" element={<AllMoviesPage />} />
            <Route path="/events" element={<AllEventsPage />} />
            <Route path="/selectshow/:movieTitle" element={<SelectShowPage />} />
            <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
            <Route path="/search" element={<SearchBar />} />
            <Route path="/payment/redirect/:sessionId" element={<PrivateRoute><RedirectPage /></PrivateRoute>} />
            <Route path="/event-payment" element={<PrivateRoute><EventPaymentPage /></PrivateRoute>} /> {/* For event payment */}
            <Route path="/event-payment/redirect/:sessionId" element={<PrivateRoute><EventRedirectPage /></PrivateRoute>} /> {/* For event redirect to payment */}
          </Routes>
          </main>
          <Footer/>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
