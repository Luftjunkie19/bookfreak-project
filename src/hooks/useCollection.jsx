import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

export function useCollection(col, _q, _orderedBy) {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  const myAuth = getFirestore();

  const Query = useRef(_q).current;
  const orderedBy = useRef(_orderedBy).current;

  useEffect(() => {
    let ref = collection(myAuth, col);

    if (Query) {
      ref = query(ref, where(...Query));
    }

    if (orderedBy) {
      ref = query(ref, orderedBy(...orderedBy));
    }

    if (Query && orderedBy) {
      ref = query(ref, where(...Query), orderedBy(...orderedBy));
    }

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
  }, [error, myAuth, col, Query, orderedBy]);

  return { documents, error };
}
