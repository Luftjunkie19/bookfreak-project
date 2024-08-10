'use client';
import useGetCollection from 'hooks/firestore/useGetCollection'
import { useAuthContext } from 'hooks/useAuthContext';
import React, { useMemo } from 'react'

type Props = {}

function ChatBar({ }: Props) {

    const { user } = useAuthContext();
    const { documents: chats } = useGetCollection('userChats');

    const yourChats = useMemo(() => {
        if (chats && user) {
            return chats.filter(chat => chat.participants.includes(user.uid));
        }
    },[])

  return (
      <div className='h-screen max-w-xs w-full bg-dark-gray'>
          {yourChats && <p>{JSON.stringify(yourChats)}</p>}
    </div>
  )
}

export default ChatBar