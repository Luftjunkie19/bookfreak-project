import useGetCollection from 'hooks/firestore/useGetCollection';
import useGetDocument from 'hooks/firestore/useGetDocument'
import { useRealDocument } from 'hooks/firestore/useGetRealDocument';
import { useParams } from 'next/navigation';
import React from 'react'
import Image from 'next/image'
import Button from 'components/buttons/Button';
import { IoVideocam } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import { useAuthContext } from 'hooks/useAuthContext';

type Props = {}

function UserChatTopBar({}: Props) {
  const {chatId}=useParams();
  const {user}=useAuthContext();
  const {document:chatObject}=useRealDocument('userChats', chatId as string);
  const {documents}=useGetCollection('users');
  return (
    <div className=' bg-dark-gray/70 w-full py-2 px-3 flex items-center'>
    <div className="flex-1 flex items-center gap-2">
      {chatObject && user && documents && 
        <Image src={documents.find((item)=> chatObject.chatUsers.find((chatUser)=> chatUser.id !== user.uid)) && documents.find((item)=> chatObject.chatUsers.find((chatUser)=> chatUser.id !== user.uid)).photoURL} alt='' height={50} className='w-8 h-8 rounded-full' width={50}/>
      }
        <div className="flex flex-col text-white">
            <p className='text-sm'>{documents.find((item)=> chatObject.chatUsers.find((chatUser)=> chatUser.id !== user.uid)) && documents.find((item)=> chatObject.chatUsers.find((chatUser)=> chatUser.id !== user.uid)).nickname}</p>
            <p className='text-xs font-light'>Last activity 2 hours ago</p>
        </div>
    </div>
            <div className="flex items-center gap-3">
                <Button additionalClasses='text-white' type='transparent'>
                    <IoVideocam/>
                </Button>
                <Button additionalClasses='text-white' type='transparent'>
                    <BsThreeDots />
                </Button>
            </div>
        </div>
  )
}

export default UserChatTopBar