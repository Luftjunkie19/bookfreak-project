import '../../pages/stylings/backgrounds.css';

import { useState } from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import alertTranslations from '../../assets/translations/AlertMessages.json';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';

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

        {/* {document && (
          // <>
          //   {messages.filter((message) => message.communityChatId === id)
          //     .length > 0 &&
          //     messages
          //       .filter((message) => message.communityChatId === id)
          //       .sort((a, b) => a.sentAt - b.sentAt)
          //       .map((message) =>
          //         message.sentBy.id === user.uid ? (
          //           <div className="chat chat-start">
          //             <div className="chat-image avatar">
          //               <div className="w-10 rounded-full">
          //                 <img
          //                   referrerPolicy="no-referrer"
          //                   src={message.sentBy.photoURL}
          //                   alt=""
          //                 />
          //               </div>
          //             </div>
          //             <div className="chat-header">
          //               <span className={`${isDarkModed ? "text-white" : "text-black"}`}>
          //                 {message.sentBy.displayName}
          //                 </span>
          //               <time className={`${isDarkModed ? "text-white" : "text-black"} text-xs opacity-50`}>
          //                 {formatDistanceToNow(message.sentAt)} ago
          //               </time>
          //             </div>
          //             <div className="chat-bubble bg-accColor text-white break-all">
          //               {message.content}
          //             </div>
          //           </div>
          //         ) : (
          //           <div className="chat chat-end">
          //             <div className="chat-image avatar">
          //               <div className="w-10 rounded-full">
          //                 <img
          //                   referrerPolicy="no-referrer"
          //                   src={message.sentBy.photoURL}
          //                   alt=""
          //                 />
          //               </div>
          //             </div>
          //             <div className="chat-header">
          //             <span className={`${isDarkModed ? "text-white" : "text-black"}`}>
          //                 {message.sentBy.displayName}
          //                 </span>
          //               <time className={`${isDarkModed ? "text-white" : "text-black"} text-xs opacity-50`}>
          //                 {formatDistanceToNow(message.sentAt)} ago
          //               </time>
          //             </div>
          //             <div className="chat-bubble text-white bg-sky-600 break-all">
          //               {message.content}
          //             </div>
          //           </div>
          //         )
          //       )}
          // </>
        )} */}



    </>
  );
}

export default CompetitionChat;
