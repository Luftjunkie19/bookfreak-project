import { useEffect, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { FaImage } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import translations from "../../assets/translations/ChatsTranslation.json";
import { useAuthContext } from "../../hooks/useAuthContext";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function MessagesBar() {
  const { user } = useAuthContext();
  const location = useLocation();
  const { getDocuments } = useRealtimeDocuments();
  const [documents, setDocuments] = useState([]);
  const [entitledToChat, setEntitledToChat] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadChats = async () => {
    const realObjects = await getDocuments("usersChats");

    if (realObjects) {
      setDocuments(realObjects);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUsers = async () => {
    const usersObjects = await getDocuments("users");

    if (usersObjects) {
      setUsers(usersObjects);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadEntitledToChat = async () => {
    const realEntitled = await getDocuments("entitledToChat");

    const entitledToChatMembers = realEntitled.map((obj) => {
      const nestedObject = Object.values(obj);
      return nestedObject;
    });

    if (entitledToChatMembers) {
      setEntitledToChat(entitledToChatMembers.flat());
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadChatMessages = async () => {
    const chatMessages = await getDocuments("usersChatMessages");

    const chatMessagesArray = chatMessages.map((obj) => {
      const nestedObject = Object.values(obj);
      return nestedObject;
    });

    if (chatMessagesArray) {
      setChatMessages(chatMessagesArray.flat());
    }
  };

  useEffect(() => {
    loadChats();
    loadEntitledToChat();
    loadChatMessages();
    loadUsers();
  }, [loadChatMessages, loadChats, loadEntitledToChat, loadUsers]);

  const setCurrent = (path) => {
    if (location.pathname === path) {
      return true;
    }
  };

  return (
    <div>
      <h2 className="p-1 flex gap-2 items-center leading-9 text-2xl font-semibold text-white">
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
              <>
                <Link
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
              </>
            ))
        ) : (
          <div>
            <h1 className="text-center">
              {translations.chatsEmpty[selectedLanguage]}.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesBar;
