import React from "react";
import { useParams } from "react-router-dom";
// import SeatSelection from "../components/booking/SeatSelection";

const BookingPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Book Your Seats</h1>
      {/* <SeatSelection showId={id} /> */}
    </div>
  );
};

export default BookingPage;
