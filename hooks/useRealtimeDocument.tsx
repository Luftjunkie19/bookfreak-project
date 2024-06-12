import { database } from 'app/firebase';
import {
  get,
  ref,
} from 'firebase/database';

export default function useRealtimeDocument() {
  const getDocument = async (col:string, id:string) => {
    const reference = ref(database, `${col}/${id}`);

    try {
      const snapshot = await get(reference);
   if(snapshot.exists()){
    return snapshot.val();
   }else{
    return null
   }
    } catch (error) {
      // Handle errors
      console.error(error);
      throw error;
    }
  };

  return { getDocument };
}