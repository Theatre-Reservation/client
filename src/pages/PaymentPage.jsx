import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import "../styles/paymentPage.css";

// Load Stripe publishable key
const stripePromise = loadStripe('pk_test_51PsTIg2LvxXMvsXIlyFzKPofk4EVAXFxgxGgA1CltaVU9HooW9Yx20ZYNiCbqreuINbsmO0umy7AUePt0AaqBGRf00OYVEZqDJ');

const PaymentForm = ({ totalAmount, onSucessful }) => {
    const stripe = useStripe();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('untouched');
    const [sessionId, setSessionId] = useState('');

    const handlePaymentStatus = async (status) => {
        setSessionId(status);
        console.log('this it hadle' + status);
        setPaymentStatus("processing");
        await refreshPaymentStatus(status);
    };

    const refreshPaymentStatus = async (id) => {
        console.log("this is sessionId: " + id);
        try {
            const response = await axios.post(`http://localhost:3001/stripe/get-session/${id}`);
            const session = response.data.session;
            console.log(session.payment_status);
            if (session.payment_status === 'paid') {
                setPaymentStatus('success');
                onSucessful(id);
            } else if (session.payment_status === 'unpaid' || session.status === 'open') {
                setPaymentStatus('processing');
            } else {
                setPaymentStatus('failed');
            }
        } catch (error) {
            console.error('Error retrieving session status:', error);
            setPaymentStatus('failed');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (paymentStatus === "untouched") {
            const response = await fetch('http://localhost:3001/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: totalAmount, currency: 'lkr', description: 'Example Product' }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data.session);
                    return data.session;
                });
            window.open(window.location.href + "/redirect/" + response, "_blank");
            console.log("this is resposnse" + response);
            setPaymentStatus("Processing");
            handlePaymentStatus(response);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            {error && <div className="error-message">{error}</div>}
            {paymentStatus !== 'success' && (
                <button type="submit" disabled={loading} className="pay-button">
                    {loading ? 'Processing...' : `Pay LKR ${totalAmount.toFixed(2)}`}
                </button>
            )}
            {paymentStatus === 'processing' && <p className="processing-message">Processing your payment...</p>}
            {paymentStatus === 'success' && <p className="success-message">Payment successful! Thank you for your purchase.</p>}
            {paymentStatus === 'failed' && <p className="failed-message">Payment failed. Please try again or use a different payment method.</p>}

            {paymentStatus !== 'untouched' && (
                <button onClick={() => refreshPaymentStatus(sessionId)} className="refresh-button">Refresh Payment Status</button>
            )}
        </form>
    );
};

const PaymentPage = () => {
    const location = useLocation();
    const totalAmount = location.state.totalAmount;
    const selectedSeats = location.state.selectedSeats;
    const showId = location.state.showId;
    const [paymentStatus, setPaymentStatus] = useState('');

    const reserveSeats = async (sessionId) => {
        console.log(selectedSeats, sessionId);
        const response = await fetch(`http://localhost:3000/booking/update-seats/${showId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reservedSeats: selectedSeats }),
        }).then((res) => res.json());
    };

    return (
        <Elements stripe={stripePromise}>
            <div className="payment-page">
                <h2 className="payment-title">Payment Page</h2>
                {paymentStatus === '' && (
                    <PaymentForm
                        totalAmount={totalAmount}
                        onSucessful={reserveSeats} // Pass the callback to PaymentForm
                    />
                )}
            </div>
        </Elements>
    );
};

export default PaymentPage;
