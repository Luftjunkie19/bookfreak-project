import {
  ref,
  remove,
  set,
  update,
} from 'firebase/database';

import { database } from '../app/firebase';

export const useRealDatabase = () => {
  const addToDataBase = (col, id, object) => {
    set(ref(database, `${col}/${id}`), object)
      .then(() => {
        console.log("Added doc");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const removeFromDataBase = (col, id) => {
    const removealRef = ref(database, `${col}/${id}`);
    remove(removealRef).then(() => {
      console.log("location removed");
    });
  };

  const updateDatabase = (updateObject, col, id) => {
    const updateDocRef = ref(database, `${col}/${id}`);

    update(updateDocRef, updateObject);
  };

  return { addToDataBase, removeFromDataBase, updateDatabase };
};
