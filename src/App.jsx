import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShowPage from "./pages/ShowPage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import Header from "./components/common/Header";
// import Footer from "./components/common/Footer";
// import ProtectedRoute from "./components/common/ProtectedRoute";
// import { AuthProvider } from "./context/AuthContext";
import { ShowProvider } from "./context/ShowContext";

function App() {
  return (
    // <AuthProvider>
    //   <ShowProvider>
    //     <Router>
    //       <Header />
    //       <Switch>
    //         <Route path="/" exact component={HomePage} />
    //         <Route path="/shows/:id" component={ShowPage} />
    //         <Route path="/booking/:id" component={BookingPage} />
    //         <ProtectedRoute path="/admin" component={AdminPage} />
    //       </Switch>
    //       <Footer />
    //     </Router>
    //   </ShowProvider>
    // </AuthProvider>
    <div>
      <div>
        <HomePage />
      </div>
    </div>
  );
}

export default App;
