'use client';
import { useRouter } from 'next/navigation';

function MessagesHolder({params}:{params:{chatId:string}}) {
  const router = useRouter();
const {chatId}=params;
  return (
      <div>
      
      <div className="max-h-12 h-full bg-light-blue-gradient w-full">
        {chatId}
      </div>
    </div>
  );
}

export default MessagesHolder;
