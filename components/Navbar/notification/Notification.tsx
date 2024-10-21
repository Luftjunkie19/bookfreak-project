import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'
import FriendshipNotification from './notification-types/FriendshipNotification'
import MessageNotification from './notification-types/MessageNotification'

type Props = {
    image:string | StaticImageData,
    description:string,
    linkPath:string,
    isFriendshipRequest:boolean,
    senderId:string

}

function Notification({image, description, linkPath, isFriendshipRequest, senderId}: Props) {
  return (
   <>
   {isFriendshipRequest && <FriendshipNotification image={image} nickname={'Nickname'} senderId={senderId} />}
   {!isFriendshipRequest && <MessageNotification messageContent='Hello !' senderNickname='Nickname' image={image} senderId={senderId} linkPath={linkPath} isDirectMessage={true} />}
   </>
  )
}

export default Notification