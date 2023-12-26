import { useEffect, useState } from "react";

import { getDatabase, onValue, ref } from "firebase/database";

const useGetDocuments = (col) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const reference = ref(getDatabase(), col);
    const unsubscribe = onValue(reference, (snap) => {
      const data = snap.val();
      if (data) {
        // Convert object to array
        const dataArray = Object.keys(data).map((key) => ({
          ...data[key],
        }));
        setDocuments(dataArray);
      } else {
        setDocuments([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [col]);

  return { documents };
};

export default useGetDocuments;
