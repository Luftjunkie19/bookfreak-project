import {
  onValue,
  ref,
} from 'firebase/database';

import { database } from '../';

export default function useRealtimeDocument() {
  const getDocument = async (col, id) => {
    const reference = ref(database, `${col}/${id}`);
    const val = await new Promise((resolve, reject) => {
      onValue(reference, (snap) => resolve(snap.val()), { onlyOnce: true });
    });
    return val;
  };

  return { getDocument };
}
