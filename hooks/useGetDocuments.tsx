'use client';
import {
  useEffect,
  useState,
} from 'react';

import { database } from 'app/firebase';
import {
  onValue,
  ref,
} from 'firebase/database';

const useGetDocuments = (col) => {
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const reference = ref(database, col);
    const unsubscribe = onValue(reference, (snap) => {
      const data = snap.val();
      if (data) {
        // Convert object to array
        const dataArray = Object.keys(data).map((key) => ({
          ...data[key],
        }));
        setDocuments(dataArray);
      } else {
        setDocuments([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [col]);

  return { documents };
};

export default useGetDocuments;
