import { useState } from 'react';

import {
  onValue,
  ref,
} from 'firebase/database';

import { database } from '../';

export default function useRealtimeDocuments() {
  const [loadingDocs, setIsLoading] = useState(false);

  const getDocuments = (col) => {
    setIsLoading(true);
    const documentsAvailable = ref(database, `${col}`);

    return new Promise((resolve, reject) => {
      const array = [];
      const unsubscribe = onValue(documentsAvailable, (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            array.push(child.val());
          });
          unsubscribe();
          resolve(array);
          setIsLoading(false); // Move this line inside the if block
        }
      });
    });
  };

  return { getDocuments, loadingDocs };
}
