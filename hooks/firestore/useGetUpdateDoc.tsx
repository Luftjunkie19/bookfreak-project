import {
  useEffect,
  useState,
} from 'react';

import {
  doc,
  DocumentData,
  DocumentSnapshot,
  FirestoreError,
  getFirestore,
  onSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

export function useFormData(col:string, id:string) {
  const [document, setDocument] = useState<DocumentData | null>(null);
    const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 

  const firestore = getFirestore();

  useEffect(() => {
    const ref = doc(firestore, col, id);
    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setLoading(false); 
        }
      },
      (error) => {
        setError(error.message);
        setLoading(false); 
      }
    );

    return () => unsub();
  }, [col, firestore, id]);

  return { document, error, loading }; // Zwracamy stan loading
}