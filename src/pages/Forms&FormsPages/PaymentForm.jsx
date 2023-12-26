import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocument from "../../hooks/useRealtimeDocument";

function PaymentForm() {
  const { user } = useAuthContext();
  const [document, setDocument] = useState(null);
  const { paymentId, sessionId } = useParams();
  const { updateDatabase, addToDataBase } = useRealDatabase();
  const { getDocument } = useRealtimeDocument();
  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
  );
  const navigate = useNavigate();

  const loadUserDocument = async () => {
    const docEl = await getDocument("users", user.uid);

    if (docEl) {
      setDocument(docEl);
    }
  };

  useEffect(() => {
    loadUserDocument();
  }, []);

  return (
    <div className="min-h-screen h-full">
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
