import "../stylings/sizes.css";

import { useEffect, useRef, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FaCamera, FaPaperPlane } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import uniqid from "uniqid";

import alertsMessages from "../../assets/translations/AlertMessages.json";
import profileTranslations from "../../assets/translations/ProfileTranslations.json";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocument from "../../hooks/useRealtimeDocument";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function MessageArea({ chatId, messagedUser }) {
  const { user } = useAuthContext();
  const [message, setMessage] = useState("");
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { getDocument } = useRealtimeDocument();
  const { addToDataBase } = useRealDatabase();
  const { getDocuments } = useRealtimeDocuments();
  const messagesHolder = useRef();
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [entitledUsers, setEntitledUsers] = useState([]);
  const [users, setUsers] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUsersChat = async () => {
    const existingChat = await getDocument("usersChats", chatId);
    const entitledToChat = await getDocuments("entitledToChat");
    const usersChatMessages = await getDocuments("usersChatMessages");
    const usersObjects = await getDocuments("users");

    const entitledToChatMembers = entitledToChat.map((obj) => {
      const nestedObject = Object.values(obj);
      return nestedObject;
    });

    const chatMessagesArray = usersChatMessages.map((obj) => {
      const nestedObject = Object.values(obj);
      return nestedObject;
    });

    setCurrentChat(existingChat);
    setMessages(chatMessagesArray.flat());
    setEntitledUsers(entitledToChatMembers.flat());
    setUsers(usersObjects);
  };

  useEffect(() => {
    loadUsersChat();
  }, [loadUsersChat]);

  const sendMessage = async () => {
    if (!currentChat) {
      const entitledUsers = chatId.split("-");

      addToDataBase("usersChats", chatId, {
        chatId: chatId,
        createdAt: new Date().getTime(),
      });

      addToDataBase(
        "entitledToChat",
        `${chatId}/${entitledUsers.find((id) => id === user.uid)}`,
        {
          entitledUserId: entitledUsers.find((id) => id === user.uid),
          entitledChatId: chatId,
        }
      );

      addToDataBase(
        "entitledToChat",
        `${chatId}/${entitledUsers.find((id) => id !== user.uid)}`,
        {
          entitledUserId: entitledUsers.find((id) => id !== user.uid),
          entitledChatId: chatId,
        }
      );

      addToDataBase(
        "usersChatMessages",
        `${chatId}/${new Date().getTime()}${uniqid()}`,
        {
          content: message,
          chatId,
          sender: {
            id: user.uid,
          },
          receiver: {
            id: entitledUsers.find((id) => id !== user.uid),
          },
          sentAt: new Date().getTime(),
        }
      );

      setMessage("");
      return;
    }

    if (message.trim() === "") {
      toast.error(
        alertsMessages.notifications.wrong.emptyField[selectedLanguage]
      );
      return;
    }

    if (currentChat) {
      const entitledUsers = chatId.split("-");
      addToDataBase(
        "usersChatMessages",
        `${chatId}/${new Date().getTime()}${uniqid()}`,
        {
          content: message,
          chatId,
          sender: {
            id: user.uid,
          },
          receiver: {
            id: entitledUsers.find((id) => id !== user.uid),
          },
          sentAt: new Date().getTime(),
        }
      );

      setMessage("");
      return;
    }
  };

  const addImageMessage = async (e) => {
    const files = Array.from(e.target.files);

    const inacceptableFiles = files.filter((file) => {
      return file.size > 100000 || !file.type.includes("image");
    });

    const acceptableFiles = files.filter((file) => {
      return file.size <= 100000 && file.type.includes("image");
    });

    if (acceptableFiles.length > 5) {
      toast.error(
        alertsMessages.notifications.wrong.imagesRange[selectedLanguage]
      );
      return;
    }

    if (inacceptableFiles.length > 0) {
      toast.error(
        alertsMessages.notifications.wrong.noFilesAccepted[selectedLanguage]
      );
      return;
    }

    if (inacceptableFiles.length === 0 && acceptableFiles.length === 0) {
      toast.error(
        alertsMessages.notifications.wrong.filesToSend[selectedLanguage]
      );
      return;
    }

    acceptableFiles.map(async (file) => {
      const storage = getStorage();

      const uploadPath = `messages/uid${user.uid}-${messagedUser.id}/${file.name}`;

      const image = ref(storage, uploadPath);

      const snapshot = await uploadBytes(image, file);
      const messagedPhoto = await getDownloadURL(image);

      const entitledUsers = chatId.split("-");
      if (!currentChat) {
        addToDataBase("usersChats", chatId, {
          chatId: chatId,
          createdAt: new Date().getTime(),
        });

        entitledUsers.map((entitledUserId) =>
          addToDataBase(
            "entitledToChat",
            `${chatId}/${entitledUsers.find((id) => id === user.uid)}`,
            {
              entitledUserId: entitledUserId,
              entitledChatId: chatId,
            }
          )
        );

        addToDataBase(
          "usersChatMessages",
          `${chatId}/${new Date().getTime()}${uniqid()}`,
          {
            content: messagedPhoto,
            chatId,
            sender: {
              id: user.uid,
            },
            receiver: {
              id: entitledUsers.find((id) => id !== user.uid),
            },
            sentAt: new Date().getTime(),
          }
        );

        setMessage("");
        return;
      }

      if (currentChat) {
        addToDataBase(
          "usersChatMessages",
          `${chatId}/${new Date().getTime()}${uniqid()}`,
          {
            content: messagedPhoto,
            chatId,
            sender: {
              id: user.uid,
            },
            receiver: {
              id: entitledUsers.find((id) => id !== user.uid),
            },
            sentAt: new Date().getTime(),
          }
        );
      }
    });
  };

  return (
    <>
      <div className="col-span-3 sm:col-span-4 xl:col-span-3 ">
        <div ref={messagesHolder} className="messages-holder">
          {messages.length > 0 &&
            messages
              .filter((message) => message.chatId === chatId)
              .map((message, i) => (
                <>
                  {message.sender.id === user.uid ? (
                    <>
                      <div class="chat chat-start" key={message.sentAt}>
                        <div class="chat-image avatar">
                          <div class="w-10 rounded-full">
                            <img
                              src={
                                users
                                  .filter(
                                    (chatter) =>
                                      chatter.id ===
                                        message.chatId.split("-")[0] ||
                                      chatter.id ===
                                        message.chatId.split("-")[1]
                                  )
                                  .find(
                                    (chatter) =>
                                      chatter.id === message.sender.id &&
                                      chatter.id === user.uid
                                  )?.photoURL
                              }
                              alt=""
                            />
                          </div>
                        </div>
                        <div class="chat-header">
                          {
                            users
                              .filter(
                                (chatter) =>
                                  chatter.id === message.chatId.split("-")[0] ||
                                  chatter.id === message.chatId.split("-")[1]
                              )
                              .find(
                                (chatter) =>
                                  chatter.id === message.sender.id &&
                                  chatter.id === user.uid
                              )?.nickname
                          }
                          ,{" "}
                          <time class="text-xs opacity-50">
                            {formatDistanceToNow(message.sentAt)} ago
                          </time>
                        </div>
                        <div class="chat-bubble bg-accColor text-white">
                          {" "}
                          {message?.content &&
                          message?.content.includes(
                            "https://firebasestorage.googleapis.com/"
                          ) ? (
                            <>
                              <img
                                src={message?.content}
                                alt=""
                                className=" max-w-[10rem] max-h-64 rounded-lg"
                              />
                            </>
                          ) : (
                            <p className="break-words">{message?.content}</p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div class="chat chat-end">
                        <div class="chat-image avatar">
                          <div class="w-10 rounded-full">
                            <img
                              src={
                                users
                                  .filter(
                                    (chatter) =>
                                      chatter.id ===
                                        message.chatId.split("-")[0] ||
                                      chatter.id ===
                                        message.chatId.split("-")[1]
                                  )
                                  .find((chatter) => chatter.id !== user.uid)
                                  ?.photoURL
                              }
                              alt=""
                            />
                          </div>
                        </div>
                        <div class="chat-header">
                          {
                            users
                              .filter(
                                (chatter) =>
                                  chatter.id === message.chatId.split("-")[0] ||
                                  chatter.id === message.chatId.split("-")[1]
                              )
                              .find((chatter) => chatter.id !== user.uid)
                              ?.nickname
                          }
                          ,{" "}
                          <time class="text-xs opacity-50">
                            {formatDistanceToNow(message.sentAt)} ago
                          </time>
                        </div>
                        <div class="chat-bubble bg-primeColor text-white">
                          {" "}
                          {message?.content &&
                          message?.content.includes(
                            "https://firebasestorage.googleapis.com/"
                          ) ? (
                            <>
                              <img
                                src={message?.content}
                                alt=""
                                className="max-h-64 rounded-lg"
                              />
                            </>
                          ) : (
                            <p className=" break-words">{message?.content}</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              ))}
        </div>

        <div className="flex w-full justify-between items-center gap-4 bg-accColor py-3 px-6 sticky bottom-0 left-0 rounded-t-lg">
          <label>
            <input
              type="file"
              onChange={addImageMessage}
              multiple
              className="hidden"
            />
            <FaCamera className=" text-white text-2xl cursor-pointer" />
          </label>

          <label className="flex flex-col">
            <span>{profileTranslations.messageBtn[selectedLanguage]}:</span>
            <textarea
              className="resize-none textarea sm:w-[60vw] md:w-[50vw] outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </label>

          <button onClick={sendMessage}>
            <FaPaperPlane className="text-white text-2xl" />
          </button>
        </div>
      </div>
    </>
  );
}

export default MessageArea;
