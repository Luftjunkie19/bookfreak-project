import '../../pages/stylings/backgrounds.css';

import { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { FaPaperPlane } from 'react-icons/fa';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import alertTranslations from '../../assets/translations/AlertMessages.json';
import chatsTranslations from '../../assets/translations/ChatsTranslation.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import Loader from '../Loader';

function CompetitionChat({ collectionName, id }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const dispatch=useDispatch();
  const { addToDataBase } = useRealDatabase();
  const { user } = useAuthContext();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

const {documents:messages}=useGetDocuments(`communityChats/${id}/messages`);
const {document}=useGetDocument(collectionName, id);


  const sendMessage = async () => {
    console.log(messages);
    if (message.trim() === "") {
      dispatch(snackbarActions.showMessage({message:`${alertTranslations.notifications.wrong.emptyMessage[selectedLanguage]}`, alertType:"error"}));

      return;
    }
    setLoading(true);

    addToDataBase(
      "communityChats",
      `${id}/messages/${id}${user.uid}${new Date().getTime()}`,
      {
        content: message,
        communityChatId: id,
        sentBy: {
          nickname: user.displayName,
          photoURL: user.photoURL,
          id: user.uid,
        },
        sentAt: new Date().getTime(),
      }
    );

    [].map(async (member) => {
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

  const isDarkModed = useSelector((state) => state.mode.isDarkMode);

  const competitionExpirationDate =
    document && document.expiresAt
      ? (document.expiresAt - new Date().getTime()) / 86400000
      : false;

  return (
    <>
      <div className={`min-h-screen ${!isDarkModed && "pattern-bg"}`}>
        {document && (
          <>
            {messages.filter((message) => message.communityChatId === id)
              .length > 0 &&
              messages
                .filter((message) => message.communityChatId === id)
                .sort((a, b) => a.sentAt - b.sentAt)
                .map((message) =>
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
                        <span className={`${isDarkModed ? "text-white" : "text-black"}`}>
                          {message.sentBy.displayName}
                          </span>
                        <time className={`${isDarkModed ? "text-white" : "text-black"} text-xs opacity-50`}>
                          {formatDistanceToNow(message.sentAt)} ago
                        </time>
                      </div>
                      <div className="chat-bubble bg-accColor text-white break-all">
                        {message.content}
                      </div>
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
                      <span className={`${isDarkModed ? "text-white" : "text-black"}`}>
                          {message.sentBy.displayName}
                          </span>
                        <time className={`${isDarkModed ? "text-white" : "text-black"} text-xs opacity-50`}>
                          {formatDistanceToNow(message.sentAt)} ago
                        </time>
                      </div>
                      <div className="chat-bubble text-white bg-sky-600 break-all">
                        {message.content}
                      </div>
                    </div>
                  )
                )}
          </>
        )}
      </div>

      <div className="flex w-full justify-between items-center gap-4 bg-accColor py-3 px-6 sticky bottom-0 left-0 rounded-t-lg">
        <textarea
          disabled={
            document?.expiresAt &&
            (document?.expiresAt - new Date().getTime()) / 86400000 <= 0
          }
          className={`resize-none outline-none textarea max-h-16 sm:w-4/5 lg:w-2/3 xl:w-1/2 py-3 px-2 rounded-md ${isDarkModed ? "text-white" : "text-black"}`}
          placeholder={`${reuseableTranslations.messageAreaInput.placeholder[selectedLanguage]}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button
          disabled={
            document?.expiresAt &&
            (document?.expiresAt - new Date().getTime()) / 86400000 <= 0
              ? (document.expiresAt - new Date().getTime()) / 86400000 <= 0
              : false
          }
          onClick={sendMessage}
          className={`btn ${
            competitionExpirationDate <= 0 &&
            "bg-[rgba(109,107,107,0.79)] disabled:text-black "
          }  bg-transparent border-none justify-self-end text-white disabled:cursor-pointer`}
        >
          <FaPaperPlane className="text-white text-2xl disabled:text-black" />
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
