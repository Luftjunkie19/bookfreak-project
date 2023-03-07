import { doc, getFirestore, updateDoc } from "firebase/firestore";

export function useUpdateDocs() {
  const firestore = getFirestore();

  const updateDocs = (
    collection,
    collectionName,
    nickname,
    email,
    profileImg
  ) => {
    collection.map(async (item) => {
      const document = doc(firestore, collectionName, item.id);

      await updateDoc(document, {
        createdBy: {
          displayName: nickname,
          email,
          photoURL: profileImg,
          createdAt: item.createdBy.createdAt,
          id: item.createdBy.id,
        },
      });
    });
  };

  return { updateDocs };
}
