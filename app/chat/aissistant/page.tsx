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

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

    

  return (
      <> 
          <div className='h-[calc(100vh-7.5rem)] p-2 overflow-y-auto w-full'>
              
                  {messages.map(message => (
                      <AIChatBubble message={message}/>
                    ))}
                    {isLoading && <p>Loading....</p>}
          </div>
          <div className='h-16 flex items-center justify-between p-2 bg-primary-color w-full'>
              <div className="flex gap-3 items-center">
                  <div className="flex  gap-2 items-center">
                      <Button type='transparent'>
                          <FaImage className='text-xl'/>
                      </Button>
                      <Button  type='transparent'>
                          <FaMicrophone className='text-xl'/>
                      </Button>
                  </div>
              </div>

      <form onSubmit={handleSubmit} className='flex gap-4 items-center w-fit'>
        <input className='max-w-xl w-full p-1 border-none outline-none rounded-lg' name="prompt"  value={input} onChange={handleInputChange} />
       <Button isSubmit type='transparent'>
                  <FaPaperPlane className='text-xl'/>
              </Button>
      </form>
                  
          </div>
    </>
  )
}

export default Page