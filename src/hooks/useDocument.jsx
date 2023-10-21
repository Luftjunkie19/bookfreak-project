import { useEffect, useState } from "react";

import { doc, onSnapshot } from "firebase/firestore";

import { database } from "../index";

export function useDocument(col, id) {
  const [document, setDocument] = useState();
  const [error, setError] = useState(null);

  const ref = doc(database, col, id);
  useEffect(() => {
    const unsub = () => {
      onSnapshot(
        ref,
        (snapshot) => {
          if (snapshot.exists()) {
            setDocument({ ...snapshot.data(), id: snapshot.id });
          }
        },
        (error) => {
          setError(error.message);
        }
      );
    };

    return () => unsub();
  }, [col, id, ref]);

  return { document, error };
}
