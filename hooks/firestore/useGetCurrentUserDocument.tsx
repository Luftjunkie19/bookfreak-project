'use client';
import React, { useCallback, useEffect, useState } from 'react'
import useGetDocument from './useGetDocument'
import { DocumentData, getDoc } from 'firebase/firestore';
import { useAuthContext } from 'hooks/useAuthContext';



function useGetUserObjectEffected() {
    const { getDocument } = useGetDocument();
    const { user } = useAuthContext();
    const [document, setDocument] = useState<DocumentData | null>(null);

    const getObject = useCallback(async () => {
        if (user) {       
            const receivedData = await getDocument('users', user.uid);
            if (receivedData) {
                setDocument({ ...receivedData.data() });
            }
        }
    }, [user]);


    useEffect(() => { 
        getObject();
                
    }, [getObject]);


  return {document}
}

export default useGetUserObjectEffected