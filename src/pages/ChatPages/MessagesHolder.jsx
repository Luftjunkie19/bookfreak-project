import { useParams } from "react-router";

import MessageArea from "../../components/ChatComponents/MessageArea";
import MessagesBar from "../../components/ChatComponents/MessagesBar";
import { useAuthContext } from "../../hooks/useAuthContext";

function MessagesHolder() {
  const { chatId } = useParams();
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen h-full grid grid-cols-4 overflow-x-hidden">
      <div className="sm:hidden xl:block xl:p-2">
        <MessagesBar />
      </div>
      <MessageArea chatId={chatId} messagedUser={""} />
    </div>
  );
}

export default MessagesHolder;
