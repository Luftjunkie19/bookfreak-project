import { useState } from 'react';

import {
    IteratedDataSnapshot,
  onValue,
  ref,
} from 'firebase/database';

import { database } from '../app/firebase';

export default function useRealtimeDocuments() {
  const [loadingDocs, setIsLoading] = useState(false);

  const getDocuments = (col:string) => {
    const documentsAvailable = ref(database, `${col}`);

    return new Promise((resolve, reject) => {
      const array:IteratedDataSnapshot[] = [];
      const unsubscribe = onValue(documentsAvailable, (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            array.push(child.val());
          });
          unsubscribe();
          resolve(array);
        }
      });
    });
  };

  return { getDocuments, loadingDocs };
}