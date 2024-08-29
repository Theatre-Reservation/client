import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Load your Stripe publishable key
const stripePromise = loadStripe('pk_test_51PsTIg2LvxXMvsXIlyFzKPofk4EVAXFxgxGgA1CltaVU9HooW9Yx20ZYNiCbqreuINbsmO0umy7AUePt0AaqBGRf00OYVEZqDJ');


const PaymentForm = ({totalAmount}) => {
    const stripe = useStripe();
    const [sessionId, setSessionId] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
   

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        console.log("this is total "+totalAmount);
        // Get the client secret from the backend
        const response = await fetch('http://localhost:3001/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: totalAmount, currency: 'lkr', description: 'Example Product' }),
          }).then((res) => res.json())
          .then((data) => {
            setSessionId(data.session);
            console.log(data.session);
            stripe.redirectToCheckout({ sessionId: data.session });
        });
          
            console.log("this is sessionID"+sessionId)
          
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            {error && <div>{error}</div>}
            <button type="submit" disabled={!stripe || loading}>
                {loading ? 'Processing...' : `Pay LKR ${totalAmount.toFixed(2)}`}
            </button>
        </form>
    ); 
};

const PaymentPage = () => {
    const location=useLocation();
    const [selectedSeats,setSelectedSeats]=useState([]);
    const totalAmount =location.state.totalAmount;


    return (
        <Elements stripe={stripePromise}>
            <h2>Payment Page</h2>
            <PaymentForm totalAmount={totalAmount}  />
        </Elements>
    );
   
};

export default PaymentPage;
