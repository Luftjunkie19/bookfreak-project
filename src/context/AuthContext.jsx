/* eslint-disable no-unused-vars */
import { createContext, useEffect, useReducer } from "react";

import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { ...state, user: null };

    case "AUTH_READY":
      return { ...state, user: action.payload, userIsReady: true };

    default:
      return state;
  }
};

export default function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    userIsReady: false,
  });

  console.log(state);

  const myAuth = getAuth();

  useEffect(() => {
    const unsub = onAuthStateChanged(myAuth, (user) => {
      dispatch({ type: "AUTH_READY", payload: user });

      unsub();
    });
  }, [myAuth, dispatch]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
