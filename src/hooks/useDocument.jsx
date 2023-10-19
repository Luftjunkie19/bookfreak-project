import {
  useEffect,
  useState,
} from 'react';

import {
  doc,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';

export function useDocument(col, id) {
  const [document, setDocument] = useState();
  const [error, setError] = useState(null);

  const firestore = getFirestore();

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
