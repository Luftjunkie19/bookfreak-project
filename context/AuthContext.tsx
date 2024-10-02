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
  const supabase = createClient();

  const { retrieveElement } = useSupabaseDatabaseActions();
  

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    userIsReady: false,
  });
  
  useEffect(() => {
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {


        if (event === 'INITIAL_SESSION' && session) {
             const retrievedElement = await retrieveElement('users', session.user.id);

          if (!retrievedElement || retrievedElement.length === 0) {
            const fetchedUser = await fetch('/api/supabase/user/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: session.user.id, nickname: session.user.identities!.length > 0 ?  (session.user.identities as any)[0].identity_data.name : 'Username', description: session.user.created_at, email: session.user.email, photoURL:  session.user.identities!.length > 0 ?  (session.user.identities as any)[0].identity_data.avatar_url : 'Username' }),
            });
            

          }

          dispatch({ type: "AUTH_READY", payload: session.user });

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
