import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import "../styles/paymentPage.css";
import { useUser } from './UserContext'; // Import useUser

const stripePromise = loadStripe('pk_test_51PsTIg2LvxXMvsXIlyFzKPofk4EVAXFxgxGgA1CltaVU9HooW9Yx20ZYNiCbqreuINbsmO0umy7AUePt0AaqBGRf00OYVEZqDJ');

const PaymentForm = ({ totalAmount, onSucessful, eventId, ticketCount }) => {
    const stripe = useStripe();
    const navigate = useNavigate(); 
    const { user } = useUser(); // Access user data from context
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(sessionStorage.getItem('paymentStatus') || 'untouched');
    const [sessionId, setSessionId] = useState('');
    const paymentWindowRef = useRef(null);

    useEffect(() => {
        sessionStorage.setItem('paymentStatus', paymentStatus);
    }, [paymentStatus]);
    
    const sendTransactionToDatabase = async (sessionId) => {
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        try {
            // Fetch event details using the event ID
            const eventDetailsResponse = await axios.get(`http://localhost:3000/events/single/${eventId}`);
            if (eventDetailsResponse.status === 200) {
                const { title, venue } = eventDetailsResponse.data;  // Adjust based on actual response structure

                const transactionData = {
                    userId: user._id,  // Use the authenticated user's ID
                    eventId,
                    eventTitle: title,
                    venue,
                    totalAmount,
                    ticketCount,
                };

                console.log(transactionData);  // Log for debugging purposes

                // Send event payment transaction to the backend
                await axios.post('http://localhost:3001/transactions/event', transactionData);
            } else {
                console.error("Failed to fetch event details: ", eventDetailsResponse.status);
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
                if (paymentWindowRef.current) {
                    paymentWindowRef.current.close();
                }
            } else if (session.payment_status === 'unpaid' || session.status === 'open') {
                setTimeout(() => checkPaymentStatus(sessionId), 2000); // Check again after 2 seconds
            } else {
                setPaymentStatus('failed');
                if (paymentWindowRef.current) {
                    paymentWindowRef.current.close();
                }
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
            setPaymentStatus('failed');
            if (paymentWindowRef.current) {
                paymentWindowRef.current.close();
            }
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
        console.log(paymentStatus)
        if (paymentStatus === "untouched" || paymentStatus === "failed" || paymentStatus ==="processing") {
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
                console.log(response);
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

const EventPaymentPage = () => {
    const location = useLocation();
    const totalAmount = location.state.totalAmount;
    const ticketCount = location.state.ticketCount;
    const eventId = location.state.eventId;

    const reserveSeats = async (sessionId) => {
        console.log("payment successful " + sessionId);
    };

    return (
        <Elements stripe={stripePromise}>
            <div className="payment-page">
                <h2 className="payment-title">Payment Page</h2>
                <PaymentForm
                    totalAmount={totalAmount}
                    onSucessful={reserveSeats}
                    ticketCount={ticketCount}
                    eventId={eventId}
                />
            </div>
        </Elements>
    );
};

export default EventPaymentPage;
