import { useFirestore } from "./useFirestore";

export default function useSendJoinRequest() {
  const { addDocument } = useFirestore("notifications");

  const sendMembershipRequest = async (object) => {
    await addDocument(object);
  };

  return { sendMembershipRequest };
}
