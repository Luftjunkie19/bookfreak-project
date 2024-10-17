import Button from 'components/buttons/Button'
import React from 'react'
import { FaImage, FaMicrophone, FaPaperPlane } from 'react-icons/fa6'

type Props = {isAllowedToType:boolean | any,}

function ChatBottomBar({ isAllowedToType }: Props) {
  
 

  return (
    <div className="w-full px-2 py-3 flex justify-between text-white items-center bg-primary-color ">
    <div className="flex gap-1 items-center text-xl">
      <Button disableState={Boolean(isAllowedToType) || typeof isAllowedToType !== 'undefined' ? true : false} type='transparent'><FaImage /></Button>
      <Button disableState={Boolean(isAllowedToType) ? true : false} type='transparent'><FaMicrophone /></Button>
    </div>
    <input disabled={Boolean(isAllowedToType) ? true : false } className='max-w-3xl h-fit overflow-y-auto w-full bg-transparent text-white p-2 outline-none border-none' placeholder='Enter message...' />
    <Button disableState={Boolean(isAllowedToType) ? true : false } type='transparent' additionalClasses='text-2xl text-white'><FaPaperPlane /></Button>
  </div>
  )
}

export default ChatBottomBar