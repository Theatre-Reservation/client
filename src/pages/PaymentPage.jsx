import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import "../styles/paymentPage.css";
import { useUser } from './UserContext'; // Import useUser

const stripePromise = loadStripe('pk_test_51PsTIg2LvxXMvsXIlyFzKPofk4EVAXFxgxGgA1CltaVU9HooW9Yx20ZYNiCbqreuINbsmO0umy7AUePt0AaqBGRf00OYVEZqDJ');

const PaymentForm = ({ totalAmount, onSucessful, showId, selectedSeats }) => {
    const stripe = useStripe();
    const navigate = useNavigate(); 
    const { user } = useUser(); // Access user data from context
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(sessionStorage.getItem('paymentStatus') || 'untouched');
    const [sessionId, setSessionId] = useState('');
    const paymentWindowRef = useRef(null);
    const paymentTimeoutRef = useRef(null); //for timer

    useEffect(() => {
        sessionStorage.setItem('paymentStatus', paymentStatus);
    }, [paymentStatus]);

    useEffect(() => {
        // Set a 10-minute timer (600,000 milliseconds)
        paymentTimeoutRef.current = setTimeout(() => {
            if (paymentStatus !== 'success') {
                handlePaymentFailure(); // Fail payment if not completed in 10 minutes
            }
        }, 600000); // 10 minutes

        // Clean up timer on component unmount or payment success
        return () => clearTimeout(paymentTimeoutRef.current);
    }, [paymentStatus]);

    useEffect(() => {
        if (user) {
          console.log('User ID:', user._id);
          console.log('User Email:', user.Email);
          console.log('User Name:', user.Name);
        }
      }, [user]);

    const sendTransactionToDatabase = async (sessionId) => {
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        try {
            const showDetailsResponse = await axios.get(`http://localhost:3000/booking/single/${showId}`);
            if (showDetailsResponse.status === 200) {
                const { movie, theater } = showDetailsResponse.data;

                const transactionData = {
                    userId: user._id, // Use the user ID from context
                    showId,
                    movie,
                    theatre: theater,
                    totalAmount,
                    selectedSeats,
                };
                console.log(transactionData);

                await axios.post('http://localhost:3001/transactions', transactionData);

                navigate('/etickets', {
                    state: {
                        userName: user.Name,
                        userEmail: user.Email,
                        movieName: movie,
                        theatreName: theater,
                        selectedSeats: selectedSeats,
                    },
                });
            } else {
                console.error("Failed to fetch show details: ", showDetailsResponse.status);
            }
        } catch (error) {
            console.error('Error in sending transaction data to the database:', error);
        }
    };

    const checkPaymentStatus = async (sessionId) => {
        try {
            const response = await axios.post(`http://localhost:3001/stripe/get-session/${sessionId}`);
            const session = response.data.session;
            if (session.payment_status === 'paid') {
                setPaymentStatus('success');
                onSucessful(sessionId);
                sendTransactionToDatabase(sessionId);
                clearTimeout(paymentTimeoutRef.current); // Clear the timer if payment succeeds
                if (paymentWindowRef.current) {
                    paymentWindowRef.current.close();
                }
            } else if (session.payment_status === 'unpaid' || session.status === 'open') {
                setTimeout(() => checkPaymentStatus(sessionId), 3000); // Check again after 3 seconds
            } else {
                handlePaymentFailure(); // Handle payment failure if payment status is 'failed'
                if (paymentWindowRef.current) {
                    paymentWindowRef.current.close();
                }
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
            handlePaymentFailure();
            if (paymentWindowRef.current) {
                paymentWindowRef.current.close();
            }
        }
    };

    const handlePaymentFailure = async () => {
        setPaymentStatus('failed');
        try {
            // Release only the user's selected seats
            await axios.patch(`http://localhost:3000/booking/release-seats/${showId}`, {
                seatsToRelease: selectedSeats,
            });

            // Notify the RedirectPage to close if it is open
            if (paymentWindowRef.current) {
                paymentWindowRef.current.postMessage('payment-failed', '*');
                paymentWindowRef.current.close();
            }

            // Navigate back to the seat selection page with a message
            navigate(`/selectseats/${showId}`, {
                state: { message: 'Payment failed. Your selected seats have been released.' }
            });
        } catch (error) {
            console.error('Error releasing seats:', error);
        }
    };

    const handlePaymentStatus = async (status) => {
        setSessionId(status);
        setPaymentStatus("processing");
        setTimeout(() => checkPaymentStatus(status), 5000); // Start checking for payment status
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (paymentStatus === "untouched" || paymentStatus === "failed") {
            const response = await fetch('http://localhost:3001/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: totalAmount, currency: 'lkr', description: 'Example Product' }),
            }).then(res => res.json())
                .then(data => {
                    return data.session;
                });
            const paymentWindow = window.open(window.location.href + "/redirect/" + response, "_blank");
            paymentWindowRef.current = paymentWindow;
            setPaymentStatus("Processing");
            handlePaymentStatus(response);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            {error && <div className="error-message">{error}</div>}
            {paymentStatus !== 'success' && (
                <button type="submit" disabled={loading || paymentStatus === 'success'} className="pay-button">
                    {loading ? 'Processing...' : `Pay LKR ${totalAmount.toFixed(2)}`}
                </button>
            )}
            {paymentStatus === 'processing' && <p className="processing-message">Processing your payment...</p>}
            {paymentStatus === 'success' && (
                <>
                    <p className="success-message">Payment successful! Thank you for your purchase.</p>
                    <button className="get-etickets-button" onClick={() => navigate('/etickets')}>
                        Get E-tickets
                    </button>
                </>
            )}
            {paymentStatus === 'failed' && <p className="failed-message">Payment failed. Please try again or use a different payment method.</p>}
        </form>
    );
};

const PaymentPage = () => {
    const location = useLocation();
    const totalAmount = location.state.totalAmount;
    const selectedSeats = location.state.selectedSeats;
    const showId = location.state.showId;

    const reserveSeats = async (sessionId) => {
        const response = await fetch(`http://localhost:3000/booking/update-seats/${showId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reservedSeats: selectedSeats }),
        }).then(res => res.json());
    };

    return (
        <Elements stripe={stripePromise}>
            <div className="payment-page">
                <h2 className="payment-title">Payment Page</h2>
                <PaymentForm
                    totalAmount={totalAmount}
                    onSucessful={reserveSeats}
                    showId={showId}
                    selectedSeats={selectedSeats}
                />
            </div>
        </Elements>
    );
};

export default PaymentPage;
