import {
  useEffect,
  useState,
} from 'react';

import {
  doc,
  DocumentData,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';
import { firestore } from 'app/firebase';

export function useRealDocument(col:string, id:string) {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [error, setError] = useState<string | null>(null);


  const ref = doc(firestore, col, id);
  useEffect(() => {
    const unsub = () => {
      onSnapshot(
        ref,
        (snapshot) => {
          if (snapshot.exists()) {
            setDocument({ ...snapshot.data(), id: snapshot.id });
          }
        },
        (error) => {
          setError(error.message);
        }
      );
    };

    return () => unsub();
  }, [col, firestore, id, ref]);

  return { document, error };
}