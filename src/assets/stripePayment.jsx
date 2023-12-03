import { addDoc, collection, doc, getFirestore } from "firebase/firestore";

// Assuming you have initialized Firebase somewhere in your code
import { useAuthContext } from "../hooks/useAuthContext";

export const createCheckoutSession = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useAuthContext();
  const db = getFirestore();

  if (!user) {
    console.error("User not authenticated");
    return;
  }

  const checkoutSessionsRef = collection(
    doc(db, "customers", user.uid),
    "checkout_sessions"
  );

  const newCheckoutSession = {
    mode: "payment",
    price: "price_1GqIC8HYgolSBA35zoTTN2Zl", // One-time price created in Stripe
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  };

  try {
    const docRef = await addDoc(checkoutSessionsRef, newCheckoutSession);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};
