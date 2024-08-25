import { formatDistanceToNow } from 'date-fns'
import { User } from 'firebase/auth'
import { DocumentData } from 'firebase/firestore'
import Image from 'next/image'
import React from 'react'
import ChatBubble from '../chat-bubbles/ChatBubble'
import { PiDetectiveFill } from 'react-icons/pi'

type ChatListType ={document:DocumentData | null, messages:any[], documents:DocumentData[], user:User , isAllowedToSee?:DocumentData | null  }
function ChatList({document, messages, documents, user, isAllowedToSee}:ChatListType) {
  return (
    <div className={`${document && isAllowedToSee && user ? 'overflow-y-auto' : 'flex flex-col justify-center items-center'} p-1 w-full sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] text-white`}>
    {document && isAllowedToSee && messages.length >= 0 ? messages.map((item)=>(
       <ChatBubble key={item.sentAt} item={item} usersObjects={documents} user={user} condition={user &&  item.senderId === user.uid} />
   )) : <div className='flex flex-col justify-center items-center gap-2'>
    
    <PiDetectiveFill className='text-6xl text-primary-color' />
    <p className='text-center'>Oops, It seems you are</p>
    <p className='text-center'>Not allowed to chat in this account. Please login on the proper account, if you want to chat.</p>

<p>Error: {JSON.stringify(typeof isAllowedToSee)} User id: {user.uid}</p>

    </div>}

     </div>
  )
}

export default ChatList