'use client';
import Button from 'components/buttons/Button';
import ChatBottomBar from 'components/chatList/ChatBottomBar';
import ChatList from 'components/chatList/chat-lists/ChatList';
import LabeledInput from 'components/input/LabeledInput';
import ChatBar from 'components/Sidebars/left/ChatBar';
import { formatDistanceToNow } from 'date-fns';
import useGetCollection from 'hooks/firestore/useGetCollection';
import { useRealDocument } from 'hooks/firestore/useGetRealDocument';
import { useAuthContext } from 'hooks/useAuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaImage } from 'react-icons/fa';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa6';
import UserChatList from 'components/chatList/chat-lists/UserChatList';

function MessagesHolder({params}:{params:{chatId:string}}) {
  const router = useRouter();
const {chatId}=params;

const {user}=useAuthContext();
const {document}=useRealDocument('userChats', chatId);
const {documents}=useGetCollection('users');

  return (
<div className='h-screen w-full flex'>
  <ChatBar />
  <div className="flex flex-col h-screen w-full">
        {document && documents && user && <>
          <UserChatList document={document} documents={documents} user={user} messages={document.messages} isAllowedToSee={document && document.chatUsers.find((item)=>item.id === user.uid)}/>
         {document.chatUsers.find((item)=>item.id === user.uid) && user ? <ChatBottomBar isAllowedToType={true}/> : <ChatBottomBar isAllowedToType={false}/> }
 </> }
  </div>
</div>

  );
}

export default MessagesHolder;
