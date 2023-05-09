import { useEffect, useRef, useState } from "react";

import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export function useOrderedCollection(col, _orderedBy, _q) {
  const [orderedDocuments, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  const myAuth = getFirestore();

  const Query = useRef(_q).current;
  const orderedBy = useRef(_orderedBy).current;

  let ref = collection(myAuth, col);

  if (orderedBy) {
    ref = query(ref, orderBy(...orderedBy));
  }

  if (Query) {
    ref = query(ref, where(...Query), orderBy(...orderedBy));
  }
  useEffect(() => {
    const unsub = () => {
      onSnapshot(
        ref,
        (snapshot) => {
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });
          setDocuments(results);
        },
        (error) => {
          setError(error.message);
        }
      );
    };

    return () => unsub();
  }, [error, myAuth, col, Query, orderedBy, ref]);

  return { orderedDocuments, error };
}
