import {
  useEffect,
  useState,
} from 'react';

import {
  onValue,
  ref,
} from 'firebase/database';

import { database } from '../';

export default function useGetDocument(col, id) {
  const [document, setDocumentData] = useState(null);

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
