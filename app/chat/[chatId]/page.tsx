'use client';
import ChatBar from 'components/Sidebars/left/ChatBar';
import { useRealDocument } from 'hooks/firestore/useGetRealDocument';
import { useRouter } from 'next/navigation';

function MessagesHolder({params}:{params:{chatId:string}}) {
  const router = useRouter();
const {chatId}=params;


const {document}=useRealDocument('usersChats', chatId);

  return (
      <div className="flex h-screen">
      <ChatBar/>
      <div className="flex flex-col w-full">
        <div className="overflow-y-auto h-fit"></div>
        <div className="max-h-12 p-1 bg-primary-color text-white w-full"></div>
      </div>
    </div>
  );
}

export default MessagesHolder;
