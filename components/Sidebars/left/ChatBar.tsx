'use client';
import LabeledInput from 'components/input/LabeledInput';
import { useAuthContext } from 'hooks/useAuthContext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo } from 'react'
import { FaSearch } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';

type Props = {}

function ChatBar({ }: Props) {

    const { user } = useAuthContext();
  const { chatId } = useParams();


  return (
    <div className={`2xl:max-w-xs xl:max-w-60 sm:max-w-52 ${chatId ? "sm:hidden lg:flex" : 'sm:hidden lg:flex'} w-full lg:bg-dark-gray overflow-y-auto h-screen flex-col`}>
      <div className="flex gap-1 items-center w-full p-1">
        <FaSearch className='text-2xl text-white'/>
    <LabeledInput placeholder='Search for people...' additionalClasses='w-full p-2' type="transparent"/>
      </div>
    <div className="flex flex-col max-h-full h-fit overflow-y-auto">
{/* <p>{yourChats && user && yourChats.map((chat)=> (
<Link href={`/chat/${chat.id}`} className="flex transition-all duration-200 hover:bg-secondary-color hover:border-b-white hover:text-dark-gray gap-3 py-2 px-1 w-full border-b-2 border-b-primary-color" key={chat.id}>
  <Image src={chat.chatUsers.find((item)=>item.id !== user.uid)!.photoURL} alt='' width={40} height={40} className='w-10 h-10 rounded-full'/>
 <div className="">
  <p className='text-white'>
    {chat.chatUsers.find((item)=>item.id !== user!.uid).nickname}
    </p>
    <p className=' text-xs text-white line-clamp-1 flex gap-2 items-center'>{chat.chatUsers.find((item)=>  item.id === chat.messages[chat.messages.length - 1].sender.id ).nickname}: {chat.messages[chat.messages.length - 1].content.startsWith('https://') ? <><FaImage/> Image </> : chat.messages[chat.messages.length - 1].content}</p>
 </div>
</Link>
))}</p> */}

    </div>
  </div>
  )
}

export default ChatBar