import { useParams } from "react-router";

import MessageArea from "../../components/ChatComponents/MessageArea";
import MessagesBar from "../../components/ChatComponents/MessagesBar";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { useDocument } from "../../hooks/useDocument";

function MessagesHolder() {
  const { chatId } = useParams();
  const { user } = useAuthContext();

  const userChatId = chatId.split("-")[0];

  const { document } = useDocument(
    "users",
    userChatId === user.uid ? chatId.split("-")[1] : chatId.split("-")[0]
  );

  const { documents } = useCollection("chats", [
    "users.partner.id",
    "==",
    user.uid,
  ]);

  return (
    <div className="min-h-screen h-full grid grid-cols-4">
      <div className="sm:hidden xl:block xl:p-2">
        <MessagesBar partneredDocs={documents} />
      </div>
      <MessageArea chatId={chatId} messagedUser={document} />
    </div>
  );
}

export default MessagesHolder;
