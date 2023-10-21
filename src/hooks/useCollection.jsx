import { useEffect, useRef, useState } from "react";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { database } from "../index";

export function useCollection(col, _q, _orderedBy) {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  const Query = useRef(_q).current;
  const orderedBy = useRef(_orderedBy).current;

  let ref = collection(database, col);
  if (Query && orderedBy) {
    ref = query(ref, where(...Query), orderBy(...orderedBy));
  }

  if (orderedBy) {
    ref = query(ref, orderBy(...orderedBy));
  }

  if (Query) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ref = query(ref, where(...Query));
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
  }, [error, col, Query, orderedBy, ref]);

  return { documents, error };
}
