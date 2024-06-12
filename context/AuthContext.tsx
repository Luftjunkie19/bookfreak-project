'use client';

/* eslint-disable no-unused-vars */
import {
  createContext,
  useEffect,
  useReducer,
} from 'react';

import { auth } from 'app/firebase';
import {
  onAuthStateChanged,
  User,
} from 'firebase/auth';

const initalState: { user: User | null, userIsReady: boolean, dispatch: (p0: unknown) => null } = { user: null,
  userIsReady: false,
  dispatch: (p0: unknown) => null,}

export const AuthContext = createContext(initalState);

export const authReducer = (state: any, action: { type: any; payload: any; }) => {
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

  

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user:User) => {
      dispatch({ type: "AUTH_READY", payload: user });

      unsub();
    });
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
