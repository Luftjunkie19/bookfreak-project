import "../stylings/sizes.css";

import { useRef, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FaArrowLeft, FaCamera, FaPaperPlane } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import alertsMessages from "../../assets/translations/AlertMessages.json";
import profileTranslations from "../../assets/translations/ProfileTranslations.json";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";

function MessageArea({ chatId, messagedUser }) {
  const { user } = useAuthContext();
  const [message, setMessage] = useState("");
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const firestore = getFirestore();

  const { document } = useDocument("chats", chatId);
  const { updateDocument } = useFirestore("chats");

  const messagesHolder = useRef();

  const sendMessage = async () => {
    const chat = doc(firestore, "chats", chatId);

    const chatDocument = await getDoc(chat);

    if (!chatDocument.exists()) {
      await setDoc(chat, {
        users: [
          {
            nickname: user.displayName,
            photoURL: user.photoURL,
            id: user.uid,
          },
          {
            nickname: messagedUser.nickname,
            photoURL: messagedUser.photoURL,
            id: messagedUser.id,
          },
        ],
        messages: [
          {
            content: message,
            sender: {
              nickname: user.displayName,
              photoURL: user.photoURL,
              id: user.uid,
            },
            receiver: {
              nickname: messagedUser.nickname,
              photoURL: messagedUser.photoURL,
              id: messagedUser.id,
            },
            sentAt: Timestamp.fromDate(new Date()),
          },
        ],
        id: `${user.uid}-${messagedUser.id}`,
        createdAt: Timestamp.fromDate(new Date()),
        chatId: chatId,
      });
      setMessage("");

      const messagedUserDoc = doc(getFirestore(), "users", messagedUser.id);
      await updateDoc(messagedUserDoc, {
        notifications: arrayUnion({
          notificationContent: `${user.displayName} has sent you a message`,
          directedTo: messagedUser.id,
          linkTo: `message-to/${chatId}`,
          isRead: false,
          notificationTime: Timestamp.fromDate(new Date()),
          changeConcering: user.photoURL,
        }),
      });
    }

    if (message.trim() === "") {
      toast.error(
        alertsMessages.notifications.wrong.emptyField[selectedLanguage]
      );
      return;
    }
    let newArray;

    if (document) {
      newArray = document.messages;

      newArray.push({
        content: message,
        sender: {
          nickname: user.displayName,
          photoURL: user.photoURL,
          id: user.uid,
        },
        receiver: {
          nickname: messagedUser.nickname,
          photoURL: messagedUser.photoURL,
          id: messagedUser.id,
        },
        sentAt: Timestamp.fromDate(new Date()),
      });

      await updateDocument(chatId, {
        messages: newArray,
      });

      const messagedUserDoc = doc(getFirestore(), "users", messagedUser.id);
      await updateDoc(messagedUserDoc, {
        notifications: arrayUnion({
          notificationContent: `${user.displayName} has sent you a message`,
          directedTo: messagedUser.id,
          linkTo: `message-to/${chatId}`,
          isRead: false,
          notificationTime: Timestamp.fromDate(new Date()),
          changeConcering: user.photoURL,
        }),
      });

      setMessage("");
    }
  };

  const addImageMessage = async (e) => {
    const files = Array.from(e.target.files);

    const chat = doc(firestore, "chats", chatId);

    const chatDocument = await getDoc(chat);

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

      if (!chatDocument.exists()) {
        await setDoc(chat, {
          users: [
            {
              nickname: user.displayName,
              photoURL: user.photoURL,
              id: user.uid,
            },
            {
              nickname: messagedUser.nickname,
              photoURL: messagedUser.photoURL,
              id: messagedUser.id,
            },
          ],
          messages: [
            {
              content: messagedPhoto,
              sender: {
                nickname: user.displayName,
                photoURL: user.photoURL,
                id: user.uid,
              },
              receiver: {
                nickname: messagedUser.nickname,
                photoURL: messagedUser.photoURL,
                id: messagedUser.id,
              },
              sentAt: Timestamp.fromDate(new Date()),
            },
          ],
          id: `${user.uid}-${messagedUser.id}`,
          createdAt: Timestamp.fromDate(new Date()),
          chatId: chatId,
        });

        const messagedUserDoc = doc(getFirestore(), "users", messagedUser.id);
        await updateDoc(messagedUserDoc, {
          notifications: arrayUnion({
            notificationContent: `${user.displayName} has sent you a message`,
            directedTo: messagedUser.id,
            linkTo: `message-to/${chatId}`,
            isRead: false,
            notificationTime: Timestamp.fromDate(new Date()),
          }),
        });
      }

      let newArray;

      if (document) {
        newArray = document.messages;

        newArray.push({
          content: messagedPhoto,
          sender: {
            nickname: user.displayName,
            photoURL: user.photoURL,
            id: user.uid,
          },
          receiver: {
            nickname: messagedUser.nickname,
            photoURL: messagedUser.photoURL,
            id: messagedUser.id,
          },
          sentAt: Timestamp.fromDate(new Date()),
        });
        await updateDocument(chatId, {
          messages: newArray,
        });

        const messagedUserDoc = doc(getFirestore(), "users", messagedUser.id);
        await updateDoc(messagedUserDoc, {
          notifications: arrayUnion({
            notificationContent: `${user.displayName} has sent you a message`,
            directedTo: messagedUser.id,
            linkTo: `message-to/${chatId}`,
            isRead: false,
            notificationTime: Timestamp.fromDate(new Date()),
          }),
        });
      }
    });
  };

  return (
    <>
      <div className="relative top-0 left-0 col-span-3 sm:col-span-4 xl:col-span-3">
        <Link
          to="/your-chats"
          className="m-2 sm:sticky sm:top-0 sm:left-0 z-50 text-white xl:hidden "
        >
          <span className="flex gap-3 ">
            <FaArrowLeft /> Back
          </span>
        </Link>

        <div ref={messagesHolder} className="messages-holder">
          {document &&
            document.messages.map((message, i) => (
              <>
                {message.sender.id === user.uid ? (
                  <>
                    <div class="chat chat-start">
                      <div class="chat-image avatar">
                        <div class="w-10 rounded-full">
                          <img src={message.sender.photoURL} alt="" />
                        </div>
                      </div>
                      <div class="chat-header">
                        {message.sender.nickname},{" "}
                        <time class="text-xs opacity-50">
                          {formatDistanceToNow(message.sentAt.toDate())} ago
                        </time>
                      </div>
                      <div class="chat-bubble bg-accColor text-white">
                        {" "}
                        {message.content &&
                        message.content.includes(
                          "https://firebasestorage.googleapis.com/"
                        ) ? (
                          <>
                            <img
                              src={message.content}
                              alt=""
                              className=" max-w-[16rem] max-h-64 rounded-lg"
                            />
                          </>
                        ) : (
                          <p className="break-words">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div class="chat chat-end">
                      <div class="chat-image avatar">
                        <div class="w-10 rounded-full">
                          <img src={message.sender.photoURL} alt="" />
                        </div>
                      </div>
                      <div class="chat-header">
                        {message.sender.nickname},{" "}
                        <time class="text-xs opacity-50">
                          {formatDistanceToNow(message.sentAt.toDate())} ago
                        </time>
                      </div>
                      <div class="chat-bubble bg-primeColor text-white">
                        {" "}
                        {message.content &&
                        message.content.includes(
                          "https://firebasestorage.googleapis.com/"
                        ) ? (
                          <>
                            <img
                              src={message.content}
                              alt=""
                              className="max-h-64 rounded-lg"
                            />
                          </>
                        ) : (
                          <p className=" break-words">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            ))}
        </div>

        <div className="flex gap-6 justify-around items-center bg-accColor p-2 w-full sticky bottom-0 right-0 rounded-t-md rounded-tr-md z-50">
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
            <FaPaperPlane className=" text-white text-2xl" />
          </button>
        </div>
      </div>
    </>
  );
}

export default MessageArea;
