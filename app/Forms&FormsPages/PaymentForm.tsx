import '../stylings/backgrounds.css';

import React from 'react';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise= loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);
function PaymentForm() {
  const { paymentId } = useParams();


  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
 
  return (
    <div className={`min-h-screen h-full ${!isDarkModed && "pattern-bg"}`}>
      <div id="checkout" className="h-full">
        {paymentId && (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret: paymentId }}
          >
            <EmbeddedCheckout className="w-screen h-full" />
          </EmbeddedCheckoutProvider>
        )}
      </div>
    </div>
  );
}

export default PaymentForm;
