'use client';

import { SupabaseClient, User } from '@supabase/supabase-js';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import useSupabaseDatabaseActions from 'hooks/database/useSupabaseDatabaseActions';
import { createClient } from 'lib/supabase/client';
/* eslint-disable no-unused-vars */
import {
  createContext,
  useEffect,
  useReducer,
} from 'react';


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

  const { insertToDatabase, retrieveElement } = useSupabaseDatabaseActions();
  const supabase = createClient();
  

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    userIsReady: false,
  });
  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        if (event === 'SIGNED_IN' && session) {
          dispatch({ type: "AUTH_READY", payload: session });
       console.log(session, event);
        }
        
      
     }
    )

    return () => authListener.subscription.unsubscribe();
   }, [])

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
