import {
  useEffect,
  useState,
} from 'react';

import {
  onValue,
  ref,
} from 'firebase/database';

import { database } from '../';

export function useFormRealData(col, id) {
  const [document, setDocument] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Dodajemy stan loading

  useEffect(() => {
    const reference = ref(database, `${col}/${id}`);
    const unsub = onValue(
      reference,
      (snap) => {
        if (snap.exists()) {
          console.log(snap.val());
          setDocument({ ...snap.val() });
        }
      },
      {
        onlyOnce: true,
      }
    );

    return () => unsub();
  }, [col, id]);

  return { document, error, loading }; // Zwracamy stan loading
}
