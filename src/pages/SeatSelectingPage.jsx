import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/seatSelectingPage.css";

const SeatSelectingPage = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const [selectedSeats, setSelectedSeats] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    const toggleSeatSelection = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleProceed = () => {
        // Navigate to the payment page
        navigate("/payment", { state: { selectedSeats } });
    };

    return (
        <div className="seat-selecting-page">
            <h2 className="Message">Select Your Seats</h2>
            <h3>Screen</h3>
            <div className="seats-container">
                {rows.map((row) => (
                    <div key={row} className="seat-row">
                        {cols.map((col) => {
                            const seat = `${row}${col}`;
                            return (
                                <div
                                    key={seat}
                                    className={`seat ${selectedSeats.includes(seat) ? "selected" : ""}`}
                                    onClick={() => toggleSeatSelection(seat)}
                                >
                                    {seat}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="selected-seats">
                <h3>Selected Seats:</h3>
                {selectedSeats.length > 0 ? (
                    selectedSeats.join(", ")
                ) : (
                    <span>No seats selected</span>
                )}
            </div>
            {selectedSeats.length > 0 && (
                <button className="proceed-button" onClick={handleProceed}>
                    Proceed
                </button>
            )}
        </div>
    );
};

export default SeatSelectingPage;
