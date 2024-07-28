import { firestore } from 'app/firebase'
import { collection, doc, DocumentData, onSnapshot, QueryDocumentSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

type Props = {col:string}

function useGetCollection({ col}: Props) {
    
    const [documents, setDocs] = useState< DocumentData[] | []>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, col), (snapshot) => {
          const array: DocumentData[] = [];
          snapshot.forEach((doc) => {
            array.push(doc.data());
          })
          setDocs(array);
        }, () => {
            setDocs([]);
        });

        return () => unsubscribe();
    },[col])



  return (
documents
  )
}

export default useGetCollection