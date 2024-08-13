import { formatDistanceToNow } from 'date-fns'
import { User } from 'firebase/auth'
import { DocumentData } from 'firebase/firestore'
import Image from 'next/image'
import React from 'react'
import { PiDetectiveFill } from 'react-icons/pi'
import UserChatBubble from '../chat-bubbles/UserChatBubble'

type ChatListType ={document:DocumentData | null, messages:any[], documents:DocumentData[], user:User, isAllowedToSee:DocumentData | null }
function ChatList({document, messages, documents, user, isAllowedToSee}:ChatListType) {
  return (
    <div className={`${isAllowedToSee ? 'overflow-y-auto' : 'flex flex-col justify-center items-center'} p-1 w-full sm:h-[calc(100%-6.5rem)] lg:h-[calc(100%-7rem)] text-white`}>
    {document && isAllowedToSee && messages ? messages.map((item)=>(
       <UserChatBubble key={item.sentAt} item={item} usersObjects={documents} user={user} condition={user &&  item.sender.id === user.uid} />
   )) : <div className='flex flex-col justify-center items-center gap-2'>
    
    <PiDetectiveFill className='text-6xl text-primary-color' />

    <p>Oops, It seems you are</p>
    <p>Not allowed to chat in this account. Please login on the proper account, if you want to chat.</p>


    </div>}

     </div>
  )
}

export default ChatList