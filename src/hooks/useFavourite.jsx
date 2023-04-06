import {
  collection,
  getDocs,
  getFirestore,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "./useAuthContext";
import { useCollection } from "./useCollection";
import { useFirestore } from "./useFirestore";

export function useFavourite(collectionName) {
  const { user } = useAuthContext();
  const { documents } = useCollection(collectionName, [
    "starredBy.id",
    "==",
    user.uid,
  ]);
  const { addDocument, deleteDocument } = useFirestore(collectionName);

  const navigate = useNavigate();

  const checkCondition = (id) => {
    return documents
      .map((doc) => {
        console.log(doc);
        return doc.bookId;
      })
      .includes(id);
  };

  const addToFavourite = async (doc) => {
    await addDocument({
      bookCover: doc.photoURL,
      author: doc.author,
      isRecommendable: doc.isRecommendable,
      title: doc.title,
      readPages: doc.readPages,
      pagesAmount: doc.pagesNumber,
      category: doc.category,
      id: doc.id,
      bookId: doc.id,
      starredBy: {
        nickname: user.displayName,
        photoURL: user.photoURL,
        id: user.uid,
        starredAt: Timestamp.fromDate(new Date()),
      },
    });
    console.log("Object added");
  };

  const removeFromFavourite = async (id) => {
    const col = collection(getFirestore(), collectionName);

    const docs = query(
      col,
      where("bookId", "==", id),
      where("starredBy.id", "==", user.uid)
    );

    const docsElements = await getDocs(docs);

    docsElements.forEach(async (doc) => {
      await deleteDocument(doc.id);
      navigate(`/book/${id}`);
    });

    console.log("Object removed");
  };

  return { addToFavourite, removeFromFavourite, checkCondition };
}
