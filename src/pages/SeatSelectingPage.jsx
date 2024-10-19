// SeatSelectingPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/seatSelectingPage.css";
import { useUser } from './UserContext'; // Import useUser to access user data

const SeatSelectingPage = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [reservedSeats, setReservedSeats] = useState([]);
    const [seatPrice, setSeatPrice] = useState(0); // Price per seat
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const { showId } = useParams(); // Get show ID from URL

    const { user, setUser } = useUser(); // Access user data and setUser from context
    const [loyaltyPoints, setLoyaltyPoints] = useState(0); // User's available loyalty points
    const [appliedPoints, setAppliedPoints] = useState(0); // Points the user chooses to apply
    const [adjustedTotal, setAdjustedTotal] = useState(0); // Total after applying discount

    useEffect(() => {
        // Fetch show data from backend using Axios
        const fetchShowData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/booking/single/${showId}`);
                const data = response.data;
                // Combine reserved seats and temporary_reserved_seats
                const allReservedSeats = [...data.reserved_seats, ...data.temporary_reserved_seats];
                setReservedSeats(allReservedSeats);
                setSeatPrice(data.price); // Set the price per seat from backend
                setLoading(false);
            } catch (error) {
                console.error("Error fetching show data:", error);
                setError("Failed to fetch show data.");
                setLoading(false);
            }
        };

        const fetchLoyaltyPoints = async () => {
            if (!user || !user._id) {
                console.error("User not authenticated");
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3000/booking/loyalty-points/${user._id}`);
                if (response.status === 200) {
                    setLoyaltyPoints(response.data.loyaltyPoints);
                } else {
                    console.error("Failed to fetch loyalty points:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching loyalty points:", error);
            }
        };

        fetchShowData();
        fetchLoyaltyPoints();
    }, [showId, user]);

    useEffect(() => {
        // Calculate total amount whenever selectedSeats or seatPrice changes
        const total = selectedSeats.length * seatPrice;
        setAdjustedTotal(total);
    }, [selectedSeats, seatPrice]);

    useEffect(() => {
        if (user) {
            console.log('User ID:', user._id);
            console.log('User Email:', user.Email);
            console.log('User Name:', user.Name);
            console.log('User Loyalty Points:', loyaltyPoints);
        }
    }, [user, loyaltyPoints]);

    const toggleSeatSelection = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleApplyLoyalty = () => {
        const total = selectedSeats.length * seatPrice;
        const maxPossibleDiscount = Math.floor(total * 0.6); // 60% of total amount
        const pointsToApply = Math.min(loyaltyPoints, maxPossibleDiscount);
        setAppliedPoints(pointsToApply);
        setAdjustedTotal(total - pointsToApply);
    };

    const handleRemoveLoyalty = () => {
        setAppliedPoints(0);
        setAdjustedTotal(selectedSeats.length * seatPrice);
    };

    const handleProceed = async () => {
        try {
            // Lock the selected seats temporarily before proceeding
            await axios.patch(`http://localhost:3000/booking/lock-seats/${showId}`, {
                temporaryReservedSeats: selectedSeats,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Reset the payment status stored in session storage
            sessionStorage.removeItem('paymentStatus');
            sessionStorage.removeItem('lastAmount');
            sessionStorage.removeItem('lastSeats');

            // Navigate to the payment page with the current state
            navigate("/payment", {
                state: { 
                    showId, 
                    selectedSeats, 
                    totalAmount: adjustedTotal,
                    appliedPoints: appliedPoints // Pass applied points to payment page
                }
            });
        } catch (error) {
            console.error("Failed to lock seats:", error);
            alert("Failed to proceed with seat reservation. Please try again.");
        }
    };

    const totalAmount = adjustedTotal; // Use the adjusted total amount

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Calculate maximum discount based on 60% of total amount and user's loyalty points
    const calculateMaxDiscount = () => {
        const total = selectedSeats.length * seatPrice;
        const maxByPercentage = Math.floor(total * 0.6); // 60% of total amount
        return Math.min(maxByPercentage, loyaltyPoints);
    };

    const maxDiscount = calculateMaxDiscount();

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
                    {/* Display Loyalty Points and Apply Button */}
                    {selectedSeats.length > 0 && (
                        <div className="loyalty-section">
                            <p>You have <strong>{loyaltyPoints}</strong> loyalty points.</p>
                            {appliedPoints === 0 ? (
                                <>
                                    <p>You can apply up to <strong>LKR {maxDiscount}</strong> using your loyalty points.</p>
                                    <button 
                                        className="apply-button" 
                                        onClick={handleApplyLoyalty} 
                                        disabled={maxDiscount === 0}
                                    >
                                        Apply
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p><strong>LKR {appliedPoints}</strong> has been applied.</p>
                                    <button 
                                        className="remove-button" 
                                        onClick={handleRemoveLoyalty}
                                    >
                                        Remove 
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    {selectedSeats.length > 0 && (
                        <button className="proceed-button" onClick={handleProceed}>
                            Proceed to Payment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeatSelectingPage;
