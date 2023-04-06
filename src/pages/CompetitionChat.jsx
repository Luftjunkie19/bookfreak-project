import './CompetitioChat.css';

import { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { FaPaperPlane } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuthContext } from '../hooks/useAuthContext';
import { useDocument } from '../hooks/useDocument';
import { useFirestore } from '../hooks/useFirestore';
import { usePushNotifications } from '../hooks/usePushNotifications';

function CompetitionChat({ collectionName }) {
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const { document } = useDocument(collectionName, id);
  const { user } = useAuthContext();
  const { updateDocument } = useFirestore(collectionName);
  const { pushNotification } = usePushNotifications();

  const notYouUsers =
    document &&
    document.users.filter((doc) => {
      return doc.value.id !== user.uid;
    });
  console.log(notYouUsers);

  const sendMessage = async () => {
    if (message.trim() === "") {
      toast.error("You cannot send empty field mate.");
      return;
    }

    await updateDocument(id, {
      messages: [
        ...document.messages,
        {
          content: message,
          sentBy: {
            nickname: user.displayName,
            photoURL: user.photoURL,
            id: user.uid,
          },
          sentAt: Timestamp.fromDate(new Date()),
        },
      ],
    });

    notYouUsers.map(async (member) => {
      await pushNotification({
        notificationContent: `${user.displayName} has sent a message in your ${collectionName}'s chat`,
        directedTo: member.value.id,
        linkTo: `${
          collectionName === "competitions" ? "competition" : "readers-clubs"
        }/${id}/${
          collectionName === "competitions" ? "competition-chat" : "chat"
        }`,
        isRead: false,
        notificationTime: Timestamp.fromDate(new Date()),
        changeConcering: user.photoURL,
      });
    });

    setMessage("");
  };

  return (
    <div className="messaging-container competition-chat">
      <div className="messages-holder competition-chat">
        {document && document.messages.length > 0 ? (
          <>
            {document.messages.map((message) =>
              message.sentBy.id === user.uid ? (
                <>
                  <small>{formatDistanceToNow(message.sentAt.toDate())}</small>
                  <div key={message.sentAt} className="your-message">
                    <div className="message-content">
                      <p>{message.content}</p>
                    </div>

                    <div className="small-avatar">
                      <img src={message.sentBy.photoURL} alt="" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <small>{formatDistanceToNow(message.sentAt.toDate())}</small>
                  <div key={message.sentAt} className="from-message">
                    <div className="small-avatar">
                      <img src={message.sentBy.photoURL} alt="" />
                    </div>

                    <div className="message-content">
                      <p>{message.content}</p>
                    </div>
                  </div>
                </>
              )
            )}
          </>
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

      <div className="message-managment competition-messages">
        <label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </label>

        <button className="btn send" onClick={sendMessage}>
          <FaPaperPlane /> Send
        </button>
      </div>
    </div>
  );
}

export default CompetitionChat;
