import { useReducer } from "react";

import { doc, getFirestore, updateDoc } from "firebase/firestore";

let initialState = {
  error: null,
  document: null,
  success: false,
};

const firestoreReducer = (response, action) => {
  switch (action.type) {
    case "ERROR":
      return { document: null, success: false, error: action.payload };
    case "UPDATED_DOC":
      return { document: action.payload, success: true, error: null };
    default:
      return response;
  }
};

export function useBook() {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);

  const db = getFirestore();

  const updateBook = async (id, update) => {
    try {
      const document = doc(db, "books", id);

      await updateDoc(document, update);
      dispatch({ type: "UPDATED_DOC", payload: document });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
      console.log(err.message);
    }
  };

  return { updateBook, response };
}
