import { useReducer } from 'react';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router';

let initialState = {
  error: null,
  document: null,
  success: false,
};

const firestoreReducer = (response, action) => {
  switch (action.type) {
    case "ADDED_DOC":
      return { document: action.payload, error: null, success: true };
    case "DELETED_DOC":
      return { document: null, error: null, success: true };
    case "ERROR":
      return { document: null, success: false, error: action.payload };
    case "UPDATED_DOC":
      return { document: action.payload, success: true, error: null };
    default:
      return response;
  }
};

export function useFirestore(col) {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);

  const db = getFirestore();

  const navigate = useNavigate();

  const gathered = collection(db, col);

  const addDocument = async (element) => {
    try {
      await addDoc(gathered, element);

      dispatch({ type: "ADDED_DOC", payload: element });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
      console.log(err.message);
    }
  };

  const updateDocument = async (id, update) => {
    try {
      const document = doc(db, col, id);

      await updateDoc(document, update);
      dispatch({ type: "UPDATED_DOC", payload: document });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
      console.log(err.message);
    }
  };

  const deleteDocument = async (id) => {
    try {
      const document = doc(gathered, id);

      await deleteDoc(document);
      dispatch({ type: "DELETED_DOC" });

      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return { addDocument, updateDocument, deleteDocument, response };
}
