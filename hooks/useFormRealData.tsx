import {
  useEffect,
  useState,
} from 'react';

import {
  onValue,
  ref,
} from 'firebase/database';

import { database } from '../app/firebase';

export function useFormRealData(col:string, id:string) {
  const [document, setDocument] = useState<any>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return { document, error, loading }; 
}
