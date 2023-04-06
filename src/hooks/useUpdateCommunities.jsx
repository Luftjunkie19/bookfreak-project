import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

import { useAuthContext } from "./useAuthContext";
import { useCollection } from "./useCollection";
import { useFirestore } from "./useFirestore";
import { useOrderedCollection } from "./useOrderedCollection";

export function useUpdateCommunities() {
  const { user } = useAuthContext();

  const memberPattern = {
    label: user.displayName,
    value: {
      id: user.uid,
      nickname: user.displayName,
      photoURL: user.photoURL,
    },
  };
  const { orderedDocuments } = useOrderedCollection(
    "competitions",
    ["createdBy.createdAt", "desc"],
    ["users", "array-contains", memberPattern]
  );

  const { updateDocument } = useFirestore("clubs");

  const { documents } = useCollection("clubs", [
    "users",
    "array-contains",
    memberPattern,
  ]);

  console.log("competitions", orderedDocuments, "clubs", documents);

  const updateComunities = (updatedUser, ownerUserName, ownerUsePhoto) => {
    documents.map((doc) => {
      doc.messages.map((message) => {
        if (message.sentBy.id === user.uid) {
          message.sentBy.nickname = ownerUserName;
          message.sentBy.photoURL = ownerUsePhoto;

          updateDocument(doc.id, {
            messages: doc.messages,
          });
        }
      });
    });

    orderedDocuments.map((docu) => {
      docu.messages.map((message) => {
        if (message.sentBy.id === user.uid) {
          message.sentBy.nickname = ownerUserName;
          message.sentBy.photoURL = ownerUsePhoto;

          const competition = doc(getFirestore(), "competitions", docu.id);

          updateDoc(competition, {
            messages: docu.messages,
          });
        }
      });
    });

    // eslint-disable-next-line array-callback-return
    documents.map((doc) => {
      if (doc.createdBy.id === user.uid) {
        updateDocument(doc.id, {
          users: arrayRemove(memberPattern),
        });

        updateDocument(doc.id, {
          createdBy: {
            displayName: ownerUserName,
            photoURL: ownerUsePhoto,
            createdAt: doc.createdBy.createdAt,
            id: doc.createdBy.id,
            email: doc.createdBy.email,
          },
          users: [updatedUser, ...doc.users.splice(1, doc.users.length)],
        });
      } else {
        updateDocument(doc.id, {
          users: arrayRemove(memberPattern),
        });

        updateDocument(doc.id, {
          users: arrayUnion(updatedUser),
        });
      }
    });

    orderedDocuments.map((docu) => {
      const competition = doc(getFirestore(), "competitions", docu.id);

      console.log(docu.messages);

      if (docu.createdBy.id === user.uid) {
        updateDoc(competition, {
          users: arrayRemove(memberPattern),
        });

        updateDoc(competition, {
          createdBy: {
            displayName: ownerUserName,
            photoURL: ownerUsePhoto,
            createdAt: docu.createdBy.createdAt,
            id: docu.createdBy.id,
            email: docu.createdBy.email,
          },
          users: [updatedUser, ...docu.users.splice(1, docu.users.length)],
        });
      } else {
        updateDoc(competition, {
          users: arrayRemove(memberPattern),
        });

        updateDoc(competition, {
          users: arrayUnion(updatedUser),
        });
      }
    });
  };

  return { updateComunities };
}
