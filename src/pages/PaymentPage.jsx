import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import "../styles/paymentPage.css";

const stripePromise = loadStripe('pk_test_51PsTIg2LvxXMvsXIlyFzKPofk4EVAXFxgxGgA1CltaVU9HooW9Yx20ZYNiCbqreuINbsmO0umy7AUePt0AaqBGRf00OYVEZqDJ');

const PaymentForm = ({ totalAmount, onSucessful, showId, selectedSeats }) => {
    const stripe = useStripe();
    const navigate = useNavigate(); // Added this line
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(sessionStorage.getItem('paymentStatus') || 'untouched');
    const [sessionId, setSessionId] = useState('');
    const paymentWindowRef = useRef(null);

    useEffect(() => {
        sessionStorage.setItem('paymentStatus', paymentStatus);
    }, [paymentStatus]);

    const sendTransactionToDatabase = async (sessionId) => {
        try {
            const showDetailsResponse = await axios.get(`http://localhost:3000/booking/single/${showId}`);
            if (showDetailsResponse.status === 200) {
                const { movie, theater } = showDetailsResponse.data;

                const transactionData = {
                    userId: 'user_id_here', // This should be dynamically fetched or stored in your app's context or state
                    showId,
                    movie,
                    theatre: theater,
                    totalAmount,
                    selectedSeats,
                    
                };
                console.log(transactionData);

                await axios.post('http://localhost:3001/transactions', transactionData);
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
