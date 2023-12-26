import { useEffect, useState } from "react";

import { getDatabase, onValue, ref } from "firebase/database";

export default function useGetDocument(col, id) {
  const [documentData, setDocumentData] = useState(null);

  useEffect(() => {
    const reference = ref(getDatabase(), `${col}/${id}`);
    const unsubscribe = onValue(reference, (snap) => {
      setDocumentData(snap.val());
    });

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, [col, id]);

  return { documentData };
}
