import { getDatabase, onValue, ref } from "firebase/database";

export default function useRealtimeDocument() {
  const getDocument = async (col, id) => {
    const reference = ref(getDatabase(), `${col}/${id}`);
    const val = await new Promise((resolve, reject) => {
      onValue(reference, (snap) => resolve(snap.val()), { onlyOnce: true });
    });
    return val;
  };

  return { getDocument };
}
