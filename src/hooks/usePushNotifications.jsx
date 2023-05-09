import { useFirestore } from "./useFirestore";

export function usePushNotifications() {
  const { addDocument } = useFirestore("notifications");

  const pushNotification = async (notification) => {
    await addDocument(notification);
  };

  return { pushNotification };
}
