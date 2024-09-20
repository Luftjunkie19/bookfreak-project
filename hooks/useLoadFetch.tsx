import { User } from "@supabase/supabase-js";
import React, { useCallback, useEffect, useState } from 'react'
import { useAuthContext } from "./useAuthContext";



function useLoadFetch() {
    const [element, setElement] = useState<any>(null);
    const { user } = useAuthContext();

    const loadUserElement = useCallback(async () => {
        if (user) {
            const userObj = await fetch('/api/supabase/user/get', {
                method: 'POST',
                body: JSON.stringify({ id: user.id }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const userElement = await userObj.json();
            setElement(userElement);
        }
        console.log('Bolide Noir');
    }, [user]);


    useEffect(() => {
        loadUserElement();
    },[])

    
    return {
        element
    }


}

export default useLoadFetch