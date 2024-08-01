import { firestore } from 'app/firebase';
import { doc, getDoc } from 'firebase/firestore';
import React from 'react'



function useGetDocument() {
 
    const getDocument = async (col:string, id:string) => {      
        const docRef = doc(firestore, col, id);
        
        try {
            const doc = await getDoc(docRef);
            return doc;

        } catch (err) {
            console.error(err);
            return null;
        }

    }

    return {getDocument}

}

export default useGetDocument