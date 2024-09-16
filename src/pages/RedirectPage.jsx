import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51PsTIg2LvxXMvsXIlyFzKPofk4EVAXFxgxGgA1CltaVU9HooW9Yx20ZYNiCbqreuINbsmO0umy7AUePt0AaqBGRf00OYVEZqDJ");

const PaymentForm = ({ id }) => {
    const stripe = useStripe();

    useEffect(() => {
        const redirectToCheckout = async () => {
            if (!stripe) {
                // Stripe.js has not yet loaded.
                return;
            }
            
            const { error } = await stripe.redirectToCheckout({
                sessionId: id,
            });

            if (error) {
                console.error("Stripe checkout error:", error);
                // Handle the error accordingly (e.g., show an error message to the user)
            }
        };

        redirectToCheckout();
    }, [stripe, id]);

    return <div><p>Redirecting to payment...</p></div>;
};

const RedirectPage = () => {
    const { sessionId } = useParams();

    return (
        <Elements stripe={stripePromise}>
            <PaymentForm id={sessionId} />
        </Elements>
    );
};

export default RedirectPage;