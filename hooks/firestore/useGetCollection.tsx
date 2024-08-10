import { firestore } from 'app/firebase'
import { collection, doc, DocumentData, onSnapshot, QueryDocumentSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'


function useGetCollection(col: string) {
    
  const [documents, setDocs] = useState<DocumentData[]>([]);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, col), (snapshot) => {
          let array: DocumentData[] = [];
          
          snapshot.forEach((doc) => {
            array.push({...doc.data(), id:doc.id});
          })
          setDocs(array);
        }, (err) => {
          setError(err.message);
            setDocs([]);
        });

        return () => unsubscribe();
    },[col])



  return {
    documents,
    error
  }
}

export default useGetCollection