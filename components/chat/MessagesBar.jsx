import { formatDistanceToNow } from 'date-fns';
import { BiSolidMessageRoundedDetail } from 'react-icons/bi';
import { FaImage } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import translations from '../../assets/translations/ChatsTranslation.json';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocuments from '../../hooks/useGetDocuments';

function MessagesBar() {
  const { user } = useAuthContext();
  const location = useLocation();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
const {documents}=useGetDocuments('usersChats');
const {documents:users}=useGetDocuments('users');
const {documents:chatMessagesObjects}=useGetDocuments("usersChatMessages");
const chatMessages=chatMessagesObjects.map((obj) => {
  const nestedObject = Object.values(obj);
  return nestedObject;
}).flat();
const {documents:entitledToChatMembers}=useGetDocuments("entitledToChat");
const entitledToChat= entitledToChatMembers.map((obj) => {
  const nestedObject = Object.values(obj);
  return nestedObject;
}).flat();



  const setCurrent = (path) => {
    if (location.pathname === path) {
      return true;
    }
  };

  return (
    <div>
      <h2 className={`p-1 flex gap-2 items-center leading-9 text-2xl font-semibold ${isDarkModed ? "text-white" : "text-black"}`}>
        <BiSolidMessageRoundedDetail />
        {translations.chatsTitle[selectedLanguage]}
      </h2>

      <div className="grid gap-4 p-1 grid-cols-1 sm:justify-items-center md:justify-items-start ">
        {documents.filter(
          (chat) =>
            chat.chatId.split("-")[0] === user.uid ||
            chat.chatId.split("-")[1] === user.uid
        ).length > 0 ? (
          documents
            .filter(
              (chat) =>
                chat.chatId.split("-")[0] === user.uid ||
                chat.chatId.split("-")[1] === user.uid
            )
            .map((doc) => (
                <Link
                key={doc.chatId}
                  to={`/message-to/${doc.chatId}`}
                  className={`sm:w-full ${
                    location.pathname.includes("/message-to") &&
                    "lg:w-full xl:w-full 2xl:w-full"
                  } max-w-lg`}
                >
                  <div
                    className={`w-full p-3 rounded-lg text-white hover:bg-accColor duration-500 transition-all ${
                      setCurrent(`/message-to/${doc.chatId}`)
                        ? "bg-accColor"
                        : "bg-primeColor"
                    }`}
                  >
                    <div className="flex items-center gap-4 py-2">
                      <img
                        className="rounded-full w-16 h-16 object-cover"
                        src={
                          users
                            .filter(
                              (chatter) =>
                                doc.chatId.split("-")[0] === chatter.id ||
                                doc.chatId.split("-")[1] === chatter.id
                            )
                            .find((chatter) => chatter.id !== user.uid)
                            ?.photoURL
                        }
                        alt=""
                      />

                      <p className="font-semibold">
                        {
                          users
                            .filter(
                              (user, i) =>
                                user.id === entitledToChat[i]?.entitledUserId &&
                                entitledToChat[i]?.entitledChatId === doc.chatId
                            )
                            .find((chatter) => chatter.id !== user.uid)
                            ?.nickname
                        }
                      </p>
                    </div>

                    <div className="w-full flex justify-between flex-wrap p-1 gap-2">
                      <p className="flex items-center">
                        {chatMessages.filter(
                          (message) => message.chatId === doc.chatId
                        ).length > 0 &&
                          users.find(
                            (chatter) =>
                              chatter.id ===
                              chatMessages.filter(
                                (message) => message.chatId === doc.chatId
                              )[
                                chatMessages.filter(
                                  (message) => message.chatId === doc.chatId
                                ).length - 1
                              ].sender.id
                          )?.nickname}
                        :{" "}
                        {chatMessages.filter(
                          (message) => message.chatId === doc.chatId
                        ).length > 0 &&
                        chatMessages
                          .filter((message) => message.chatId === doc.chatId)
                          [
                            chatMessages.filter(
                              (message) => message.chatId === doc.chatId
                            ).length - 1
                          ]?.content.includes(
                            "https://firebasestorage.googleapis.com/"
                          ) ? (
                          <>
                            <FaImage className="ml-2" /> Image
                          </>
                        ) : (
                          <>
                            {chatMessages
                              .filter(
                                (message) => message.chatId === doc.chatId
                              )
                              [
                                chatMessages.filter(
                                  (message) => message.chatId === doc.chatId
                                ).length - 1
                              ]?.content.substring(0, 30)}
                          </>
                        )}
                      </p>
                      <p className="time-sent">
                        {chatMessages.filter(
                          (message) => message.chatId === doc.chatId
                        ).length > 0 &&
                          formatDistanceToNow(
                            chatMessages.filter(
                              (message) => message.chatId === doc.chatId
                            )[
                              chatMessages.filter(
                                (message) => message.chatId === doc.chatId
                              ).length - 1
                            ].sentAt
                          )}{" "}
                        ago
                      </p>
                    </div>
                  </div>
                </Link>
            ))
        ) : (
            <h1 className={`text-center ${isDarkModed ? "text-white" : "text-black"}`}>
              {translations.chatsEmpty[selectedLanguage]}.
            </h1>
        )}
      </div>
    </div>
  );
}

export default MessagesBar;
