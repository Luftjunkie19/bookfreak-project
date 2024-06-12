'use client';
import {
  useEffect,
  useState,
} from 'react';

import {
  onValue,
  ref,
} from 'firebase/database';

import { database } from '../app/firebase';

export default function useGetDocument(col:string, id:string) {
  const [document, setDocumentData] = useState<any>(null);

  useEffect(() => {
    const reference = ref(database, `${col}/${id}`);
    const unsubscribe = onValue(reference, (snap) => {
      setDocumentData(snap.val());
    });

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, [col, id]);

  return { document };
}
