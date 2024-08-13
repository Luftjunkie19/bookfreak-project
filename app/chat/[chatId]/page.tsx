'use client';
import Button from 'components/buttons/Button';
import ChatList from 'components/chatList/ChatList';
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
 {document && documents && user && <ChatList document={document} documents={documents} user={user}/>}
    <div className="w-full p-2 flex justify-between text-white items-center bg-primary-color ">
      <div className="flex gap-1 items-center text-xl">
        <Button type='transparent'><FaImage /></Button>
        <Button type='transparent'><FaMicrophone /></Button>
      </div>
      <input className='max-w-3xl h-fit overflow-y-auto w-full bg-transparent text-white p-2 outline-none border-none' placeholder='Enter message...' />
      <Button type='transparent' additionalClasses='text-2xl text-white'><FaPaperPlane /></Button>
    </div>
  </div>
</div>

  );
}

export default MessagesHolder;
