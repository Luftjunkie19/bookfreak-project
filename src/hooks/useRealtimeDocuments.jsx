import { useState } from 'react';

import {
  getDatabase,
  onValue,
  ref,
} from 'firebase/database';

export default function useRealtimeDocuments() {
  const [loadingDocs, setIsLoading] = useState(false);

  const getDocuments = (col) => {
    setIsLoading(true);
    const documentsAvailable = ref(getDatabase(), `${col}`);

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
