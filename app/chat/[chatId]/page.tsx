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
import UserChatTopBar from 'components/TopBar/UserChatTopBar';

function MessagesHolder({params}:{params:{chatId:string}}) {
  const router = useRouter();
const {chatId}=params;

const {user}=useAuthContext();
const {document}=useRealDocument('userChats', chatId);
const {documents}=useGetCollection('users');

  return (
<div className='h-screen w-full flex'>
  <ChatBar />
  <div className="flex flex-col sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.25rem)] w-full">
        {document && documents && user && <>
        <UserChatTopBar/>
          <UserChatList document={document} documents={documents} user={user} messages={document.messages} isAllowedToSee={document && document.chatUsers.find((item)=>item.id === user.uid)}/>
         {document.chatUsers.find((item)=>item.id === user.uid) && user ? <ChatBottomBar isAllowedToType={false}/> : <ChatBottomBar isAllowedToType={true}/> }
 </> }
  </div>
</div>

  );
}

export default MessagesHolder;
