import {
  doc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';

import { useAuthContext } from './useAuthContext';
import { useCollection } from './useCollection';
import { useOrderedCollection } from './useOrderedCollection';

export function useUpdateChats() {
  const { user } = useAuthContext();

  const firestore = getFirestore();

  const { orderedDocuments } = useOrderedCollection(
    "chats",
    ["createdAt", "asc"],
    ["users.partner.id", "==", user.uid]
  );

  const { documents } = useCollection("chats", [
    "users.you.id",
    "==",
    user.uid,
  ]);

  let partneredArray = orderedDocuments;
  const ownedArray = documents;

  const updatePartneredMessages = (
    nickname,
    photo,
    chatId,
    updatedPartneredMessages
  ) => {
    partneredArray.forEach((chat) => {
      if (chat.id === chatId && chat.messages.length > 0) {
        chat.messages.forEach((message) => {
          if (message.sender.id === user.uid) {
            message.sender.nickname = nickname;
            message.sender.photoURL = photo;

            updatedPartneredMessages.push(message);
          }

          if (message.receiver.id === user.uid) {
            message.receiver.photoURL = photo;
            message.receiver.nickname = nickname;

            updatedPartneredMessages.push(message);
          }
        });
      }
    });
  };

  const updateOwnedMessages = (
    nickname,
    photo,
    chatId,
    updatedOwnedMessages
  ) => {
    ownedArray.forEach((chat) => {
      if (chat.id === chatId && chat.messages.length > 0) {
        chat.messages.forEach((message) => {
          if (message.sender.id === user.uid) {
            message.sender.nickname = nickname;
            message.sender.photoURL = photo;

            updatedOwnedMessages.push(message);
          }

          if (message.receiver.id === user.uid) {
            message.receiver.photoURL = photo;
            message.receiver.nickname = nickname;

            updatedOwnedMessages.push(message);
          }
        });
      }
    });
  };

  const updatePartneredChats = async (photo, nickname) => {
    for (let i = 0; i < partneredArray.length; i++) {
      const document = partneredArray[i];
      const chat = doc(firestore, "chats", document.id);

      const updatedPartneredMessages = [];

      updatePartneredMessages(
        nickname,
        photo,
        document.id,
        updatedPartneredMessages
      );

      await updateDoc(chat, {
        messages: updatedPartneredMessages,
        users: {
          partner: {
            nickname: nickname,
            photoURL: photo,
            id: document.users.partner.id,
          },
          you: {
            nickname: document.users.you.nickname,
            photoURL: document.users.you.photoURL,
            id: document.users.you.id,
          },
        },
      });

      updatedPartneredMessages.splice(0, updatedPartneredMessages.length);
    }
  };

  const updateOwnedChats = async (photo, nickname) => {
    for (let i = 0; i < ownedArray.length; i++) {
      const document = ownedArray[i];
      const chat = doc(firestore, "chats", document.id);

      const updatedOwnedMessages = [];

      updateOwnedMessages(nickname, photo, document.id, updatedOwnedMessages);

      await updateDoc(chat, {
        messages: updatedOwnedMessages,
        users: {
          you: {
            nickname: nickname,
            photoURL: photo,
            id: document.users.you.id,
          },
          partner: {
            nickname: document.users.partner.nickname,
            photoURL: document.users.partner.photoURL,
            id: document.users.partner.id,
          },
        },
      });

      updatedOwnedMessages.splice(0, updatedOwnedMessages.length);
    }
  };

  return {
    partneredArray,
    ownedArray,
    updatePartneredChats,
    updateOwnedChats,
  };
}
