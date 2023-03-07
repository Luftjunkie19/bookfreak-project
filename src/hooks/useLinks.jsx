import { useEffect, useState } from "react";

import { collection, getFirestore, onSnapshot } from "firebase/firestore";

export function useLinks() {
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);

  const myStorage = getFirestore();

  useEffect(() => {
    const ref = collection(myStorage, "links");

    const unsub = () => {
      onSnapshot(
        ref,
        (snapshot) => {
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });
          setLinks(results);
        },
        (error) => {
          setError(error.message);
        }
      );
    };

    return () => unsub();
  }, [error, myStorage]);

  return { links, error };
}
