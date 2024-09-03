import { createClient } from 'lib/supabase/client'
import React from 'react'

type Props = {}

function useSignIn({ }: Props) {
    const supabase = createClient();
 
    const signInWithPassword = async (password: string, email: string) => {
           try {
               const { data, error } = await supabase.auth.signInWithPassword({
                   'email': email,
                   'password': password
               });

               if (data) console.log(data);

               if (error) {
                   throw new Error(error.message);
               }
        
    } catch (error) {
               console.log(error);
    }
    }

    const singUp = async (password: string, email: string) => {
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                'password': password,
            });

            if (data) return console.log(data);

            if (error) {
                throw new Error(error.message)
            }
            
        } catch (error) {
            
        }
    }


  return (
    <div>useSignIn</div>
  )
}

export default useSignIn