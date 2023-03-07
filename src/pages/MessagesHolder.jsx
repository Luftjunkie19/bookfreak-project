import './MessagesHolder.css';

import { useParams } from 'react-router';

import MessageArea from '../components/MessageArea';
import MessagesBar from '../components/MessagesBar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import { useDocument } from '../hooks/useDocument';

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

  console.log(document);

  console.log(chatId.split("-")[0]);

  return (
    <div className="chat-container">
      <MessagesBar partneredDocs={documents} />
      <MessageArea chatId={chatId} messagedUser={document} />
    </div>
  );
}

export default MessagesHolder;
