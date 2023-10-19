import { useState } from "react";

import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { FaPaperPlane } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import alertTranslations from "../../assets/translations/AlertMessages.json";
import chatsTranslations from "../../assets/translations/ChatsTranslation.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import Loader from "../Loader";

function CompetitionChat({ collectionName, id }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { document } = useDocument(collectionName, id);
  const { user } = useAuthContext();
  const { updateDocument } = useFirestore(collectionName);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const expirationTime =
    document &&
    document.expiresAt &&
    new Date(document.expiresAt.toDate()).getTime();

  let timesDifference = expirationTime - new Date().getTime();

  const notYouUsers =
    document &&
    document.users.filter((doc) => {
      return doc.value.id !== user.uid;
    });

  const sendMessage = async () => {
    if (message.trim() === "") {
      toast.error(
        alertTranslations.notifications.wrong.emptyMessage[selectedLanguage]
      );
      return;
    }
    setLoading(true);
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
      /**({
        notificationContent: `${user.displayName} has sent a message in your ${collectionName}'s chat`,
        directedTo: member.value.id,
        linkTo: `${
          collectionName === "competitions" ? "competition" : "readers-clubs"
        }/${id}/${
          collectionName === "competitions" ? "competition-chat" : "chat"
        }`,
        isRead: false,
        notificationTime: Timestamp.fromDate(new Date()),
        sentTo: id,
      });**/
    });
    setLoading(false);
    setMessage("");
  };

  return (
    <>
      <div className="min-h-screen">
        {document && document.messages.length > 0 ? (
          <>
            {document.messages.map((message) =>
              message.sentBy.id === user.uid ? (
                <div className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        referrerPolicy="no-referrer"
                        src={message.sentBy.photoURL}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {message.sentBy.displayName}
                    <time className="text-xs opacity-50">
                      {formatDistanceToNow(message.sentAt.toDate())} ago
                    </time>
                  </div>
                  <div className="chat-bubble">{message.content}</div>
                </div>
              ) : (
                <div className="chat chat-end">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        referrerPolicy="no-referrer"
                        src={message.sentBy.photoURL}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {message.sentBy.displayName}
                    <time className="text-xs opacity-50">
                      {formatDistanceToNow(message.sentAt.toDate())} ago
                    </time>
                  </div>
                  <div className="chat-bubble">{message.content}</div>
                </div>
              )
            )}
          </>
        ) : (
          <p>{chatsTranslations.chatsEmpty[selectedLanguage]}</p>
        )}
      </div>

      <div className="flex w-full justify-between items-center gap-4 bg-accColor py-3 px-6 sticky bottom-0 left-0 rounded-t-lg">
        <textarea
          className="resize-none outline-none sm:w-4/5 lg:w-2/3 xl:w-1/2 py-3 px-2 rounded-md"
          disabled={
            expirationTime &&
            Math.round(timesDifference / (1000 * 60 * 60 * 24)) <= 0
              ? true
              : false
          }
          placeholder={`${reuseableTranslations.messageAreaInput.placeholder[selectedLanguage]}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button
          onClick={sendMessage}
          className="btn bg-transparent border-none justify-self-end text-white"
        >
          <FaPaperPlane className="text-white text-2xl" />
          <span className="sm:hidden lg:block">
            {" "}
            {chatsTranslations.sendBtn[selectedLanguage]}
          </span>
        </button>
      </div>

      {loading && <Loader />}
    </>
  );
}

export default CompetitionChat;
