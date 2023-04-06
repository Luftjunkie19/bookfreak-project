import { doc, getFirestore, updateDoc } from "firebase/firestore";

import { useAuthContext } from "./useAuthContext";
import { useCollection } from "./useCollection";
import { useFirestore } from "./useFirestore";

export function usePushNotifications() {
  const { addDocument } = useFirestore("notifications");
  const { user } = useAuthContext();

  const { documents } = useCollection("notifications", [
    "directedTo",
    "==",
    user.uid,
  ]);
  console.log(documents);

  const pushNotification = async (notification) => {
    await addDocument(notification);
  };

  const markAsRead = async (id) => {
    const notficiation = doc(getFirestore(), "notifications", id);

    await updateDoc(notficiation, {
      isRead: true,
    });
  };

  return { pushNotification, markAsRead };
}
