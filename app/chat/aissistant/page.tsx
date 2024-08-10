'use client';
import { useChat } from 'ai/react';
import Button from 'components/buttons/Button'
import AIChatBubble from 'components/elements/chatBubbles/AIChatBubble';
import LabeledInput from 'components/input/LabeledInput'
import Image from 'next/image';
import React, { useState } from 'react'
import { FaImage, FaMicrophone, FaPaperPlane } from 'react-icons/fa6'



type Props = {}




function Page({ }: Props) {
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        maxToolRoundtrips:0,
    });

    

  return (
      <div className='flex flex-col max-h-screen h-full'>
    <div className='overflow-y-auto p-4 space-y-4 sm:h-[calc(100vh-6.25rem)] xl:h-[calc(100vh-6.5rem)]'>
        {messages.map(message => (
            <AIChatBubble key={message.id} message={message}/>
        ))}
        {isLoading && <p className="text-white">Loading....</p>}
    </div>

    <form 
        onSubmit={handleSubmit} 
        className='flex items-center justify-between border-t-1 border-gray-400 p-2 bg-dark-gray'
          >
              
            
              <div className={`gap-3 items-center ${isFocus ? 'opacity-0 -translate-x-full hidden' : 'opacity-100 w-auto flex translate-x-0'} transition-all duration-500`}>
            <div className="flex gap-2 items-center text-primary-color">
                <Button type='transparent'>
                    <FaImage className='text-xl'/>
                </Button>
                <Button type='transparent'>
                    <FaMicrophone className='text-xl'/>
                </Button>
            </div>
        </div>
              

              <input 
                  onFocus={() => {
                      setIsFocus(true);
                  }}
                  onBlur={() => {
                       setIsFocus(false);
                  }}
                  className='max-w-lg bg-transparent  w-full font-normal transition-all text-white duration-300 p-1 border-none outline-none rounded-md' 
                  placeholder='Enter Your Message...'
            name="prompt"  
            value={input} 
            onChange={handleInputChange} 
        />

        <div className='flex gap-4 items-center w-fit'>
            <Button isSubmit type='transparent'>
                <FaPaperPlane className='text-xl text-primary-color'/>
            </Button>
        </div>
    </form>
</div>
  )
}

export default Page