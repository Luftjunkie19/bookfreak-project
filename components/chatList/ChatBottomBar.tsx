import Button from 'components/buttons/Button'
import { DocumentData } from 'firebase/firestore'
import React from 'react'
import { FaImage, FaMicrophone, FaPaperPlane } from 'react-icons/fa6'

type Props = {isAllowedToType:boolean,}

function ChatBottomBar({ isAllowedToType }: Props) {
  
 

  return (
    <div className="w-full p-2 flex justify-between text-white items-center bg-primary-color ">
    <div className="flex gap-1 items-center text-xl">
      <Button disableState={isAllowedToType} type='transparent'><FaImage /></Button>
      <Button disableState={isAllowedToType} type='transparent'><FaMicrophone /></Button>
    </div>
    <input disabled={isAllowedToType } className='max-w-3xl h-fit overflow-y-auto w-full bg-transparent text-white p-2 outline-none border-none' placeholder='Enter message...' />
    <Button disableState={isAllowedToType } type='transparent' additionalClasses='text-2xl text-white'><FaPaperPlane /></Button>
  </div>
  )
}

export default ChatBottomBar