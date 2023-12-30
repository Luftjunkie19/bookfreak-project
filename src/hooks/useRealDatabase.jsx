import {
  getDatabase,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';

export const useRealDatabase = () => {
  const addToDataBase = (col, id, object) => {
    set(ref(getDatabase(), `${col}/${id}`), object)
      .then(() => {
        console.log("Added doc");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const removeFromDataBase = (col, id) => {
    const removealRef = ref(getDatabase(), `${col}/${id}`);
    remove(removealRef).then(() => {
      console.log("location removed");
    });
  };

  const updateDatabase = (updateObject, col, id) => {
    const updateDocRef = ref(getDatabase(), `${col}/${id}`);

    update(updateDocRef, updateObject);
  };

  return { addToDataBase, removeFromDataBase, updateDatabase };
};
