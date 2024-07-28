import { firestore } from 'app/firebase'
import { doc, DocumentData, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

type Props = {col:string, id:string}

function useGetUpdateDoc({ col, id}: Props) {
    
    const [document, setDoc] = useState<DocumentData | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(firestore, col, id), (snapshot) => {
            if (snapshot.exists()) {
                setDoc(snapshot.data());
            }
        }, () => {
            setDoc(null);
        });

        return () => unsubscribe();
    },[col, id])



  return (
document
  )
}

export default useGetUpdateDoc