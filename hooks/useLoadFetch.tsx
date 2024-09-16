import { User } from "@supabase/supabase-js";
import React from 'react'
import { useAuthContext } from "./useAuthContext";



function useLoadFetch() {

    const { user } = useAuthContext();

 async function loadUserElement() {
        const userObj = await fetch('/api/supabase/user/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: user!.id })
        });

        const userElement = await userObj.json();
        return userElement;
    
    }
    
    return {
        loadUserElement
    }


}

export default useLoadFetch