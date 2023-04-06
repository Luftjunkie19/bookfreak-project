import { useFirestore } from "./useFirestore";

export default function useSendJoinRequest() {
  const { addDocument } = useFirestore("join-request");

  const sendMembershipRequest = async (object) => {
    await addDocument(object);
  };

  return { sendMembershipRequest };
}
