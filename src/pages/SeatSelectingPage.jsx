import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/seatSelectingPage.css";

const SeatSelectingPage = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [reservedSeats, setReservedSeats] = useState([]);
    const [seatPrice, setSeatPrice] = useState(0); // Store price per seat
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const { showId } = useParams(); // Get show ID from URL

    useEffect(() => {
        // Fetch show data from backend using Axios
        const fetchShowData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/booking/single/${showId}`);
                const data = response.data;
                setReservedSeats(data.reserved_seats); // Set reserved seats from backend
                setSeatPrice(data.price); // Set the price per seat from backend
                setLoading(false);
            } catch (error) {
                console.error("Error fetching show data:", error);
                setError("Failed to fetch show data.");
                setLoading(false);
            }
        };

        fetchShowData();
    }, [showId]);

    const toggleSeatSelection = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleProceed = () => {
        // Reset the payment status stored in local storage
        sessionStorage.removeItem('paymentStatus');
        sessionStorage.removeItem('lastAmount');
        sessionStorage.removeItem('lastSeats');

        // Navigate to the payment page with the current state
        navigate("/payment", { state: { 
            showId,
            selectedSeats, 
            totalAmount: selectedSeats.length * seatPrice
        }});
    };

    const totalAmount = selectedSeats.length * seatPrice; // Calculate total amount

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="seat-selecting-page">
            <h2 className="Message">Select Your Seats</h2>
            <div className="seat-selection-container">
                <div className="seats-container">
                    <h3>Screen</h3>
                    {rows.map((row) => (
                        <div key={row} className="seat-row">
                            {cols.map((col) => {
                                const seat = `${row}${col}`;
                                const isReserved = reservedSeats.includes(seat);
                                return (
                                    <div
                                        key={seat}
                                        className={`seat ${selectedSeats.includes(seat) ? "selected" : ""} ${isReserved ? "reserved" : ""}`}
                                        onClick={() => !isReserved && toggleSeatSelection(seat)}
                                    >
                                        {seat}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="selected-seats-container">
                    <h3 className="message-2">Selected Seats:</h3>
                    {selectedSeats.length > 0 ? (
                        <div className="selected-seats">
                            {selectedSeats.join(", ")}
                        </div>
                    ) : (
                        <span>No seats selected</span>
                    )}
                    <div className="total-amount">
                        <h3>Total Amount:</h3>
                        <span>LKR {totalAmount.toFixed(2)}</span>
                    </div>
                    {selectedSeats.length > 0 && (
                        <button className="proceed-button" onClick={handleProceed}>
                            Proceed
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeatSelectingPage;
