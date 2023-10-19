import {
  useEffect,
  useState,
} from 'react';

import {
  doc,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';

export function useFormData(col, id) {
  const [document, setDocument] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Dodajemy stan loading

  const firestore = getFirestore();

  useEffect(() => {
    const ref = doc(firestore, col, id);
    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setLoading(false); // Ustawiamy stan loading na false po załadowaniu danych
        }
      },
      (error) => {
        setError(error.message);
        setLoading(false); // Ustawiamy stan loading na false po błędzie
      }
    );

    return () => unsub();
  }, [col, firestore, id]);

  return { document, error, loading }; // Zwracamy stan loading
}
