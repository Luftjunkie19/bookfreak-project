import './MessagesHolder.css';

import { motion } from 'framer-motion';
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

  // eslint-disable-next-line no-restricted-globals
  const condition = window.outerWidth > 1024;

  return (
    <motion.div
      className="chat-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {condition && <MessagesBar partneredDocs={documents} />}
      <MessageArea chatId={chatId} messagedUser={document} />
    </motion.div>
  );
}

export default MessagesHolder;
