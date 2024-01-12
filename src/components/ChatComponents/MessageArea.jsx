import '../stylings/sizes.css';
import '../../pages/stylings/backgrounds.css';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import {
  FaArrowLeft,
  FaCamera,
  FaPaperPlane,
} from 'react-icons/fa';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';

import { storage } from '../../';
import alertsMessages from '../../assets/translations/AlertMessages.json';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function MessageArea({ chatId, messagedUser }) {
  const { user } = useAuthContext();
  const dispatch=useDispatch();
  const [message, setMessage] = useState("");
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const { getDocument } = useRealtimeDocument();
  const { addToDataBase } = useRealDatabase();
  const { getDocuments } = useRealtimeDocuments();
  const messagesHolder = useRef();
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [entitledUsers, setEntitledUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [imageMessages, setImageMessages] = useState([]);

  const updateImageMessage = (index, message) => {
    const updatedImageMessages = [...imageMessages];
    updatedImageMessages[index].message = message;
    setImageMessages(updatedImageMessages);
  };

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
      dispatch(snackbarActions.showMessage({message:`${alertsMessages.notifications.wrong.emptyField[selectedLanguage]}`, alertType:"error"}));
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
      dispatch(snackbarActions.showMessage({message:`${alertsMessages.notifications.wrong.imagesRange[selectedLanguage]}`, alertType:"error"}));
      return;
    }

    if (inacceptableFiles.length > 0) {
      dispatch(snackbarActions.showMessage({message:`${alertsMessages.notifications.wrong.noFilesAccepted[selectedLanguage]}`, alertType:"error"}));
     
      return;
    }

    if (inacceptableFiles.length === 0 && acceptableFiles.length === 0) {
      dispatch(snackbarActions.showMessage({message:`${alertsMessages.notifications.wrong.filesToSend[selectedLanguage]}`, alertType:"error"}));
      return;
    }


    const messagesForImages = acceptableFiles.map((file) => ({
      file,
      message: "", 
    }));

    setImageMessages(messagesForImages);
  };

  const sendAllImages = async () => {
    try {
      for (let i = 0; i < imageMessages.length; i++) {
        const { file, message } = imageMessages[i];

      
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

       

          await addToDataBase(
            "usersChatMessages",
            `${chatId}/${new Date().getTime()}${uniqid()}`,
            {
              content: messagedPhoto,
              message,
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
        } else {
          // ... (similar logic as before)

          await addToDataBase(
            "usersChatMessages",
            `${chatId}/${new Date().getTime()}${uniqid()}`,
            {
              content: messagedPhoto,
              message,
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
      }

      // Clear all messages after sending
      setImageMessages([]);
    } catch (error) {
      console.error("Error sending messages:", error);
      dispatch(snackbarActions.showMessage({message:"Error sending messages. Please try again.", alertType:"error"}));

    }
  };

  return (
    <>
      <div className={`col-span-3 sm:col-span-4 xl:col-span-3 ${isDarkModed && "pattern-bg"}`}>
        <div className="sm:flex xl:hidden w-full bg-primeColor">
          <Link
            to="/your-chats"
            className="btn border-none outline-none bg-transparent text-white"
          >
            <FaArrowLeft /> Back
          </Link>
        </div>
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
                              <span>{message?.message}</span>
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
                              <span>{message?.message}</span>
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
          {imageMessages.length > 0 && (
            <div className="p-3 sticky bottom-0 left-0 sm:grid sm:grid-flow-col snap-always snap-inline sm:auto-cols-[100%] md:auto-cols-[67%] lg:auto-cols-[41%] sm:overflow-x-auto xl:flex w-full gap-5">
              {imageMessages.map((imageMessage, index) => (
                <div
                  key={index}
                  className="bg-accColor border-2 border-accColor max-w-[16rem] max-h-[16rem] relative top-0 left-0"
                >
                  <img
                    className="w-full h-full object-cover"
                    src={URL.createObjectURL(imageMessage.file)}
                    alt=""
                  />
                  <textarea
                    className={`textarea resize-none outline-none w-full rounded-none rounded-t-lg max-h-16 absolute bottom-0 left-0 ${isDarkModed ? "text-white" :"text-black"}`}
                    value={imageMessage.message}
                    onChange={(e) => updateImageMessage(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex w-full justify-around items-center gap-6 bg-accColor py-2 px-4 sticky h-[7.5rem] bottom-0 left-0 rounded-t-lg">
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
            <textarea
              className={`resize-none textarea sm:w-[60vw] md:w-[50vw] outline-none h-12 ${isDarkModed ? "text-white" : "text-black"}`}
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </label>

          <button
            onClick={() => {
              if (imageMessages.length > 0) {
                sendAllImages();
              } else {
                sendMessage();
              }
            }}
          >
            <FaPaperPlane className="text-white text-2xl" />
          </button>
        </div>
      </div>
    </>
  );
}

export default MessageArea;
