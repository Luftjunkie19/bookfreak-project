'use client';

import Button from 'components/buttons/Button'
import LabeledInput from 'components/input/LabeledInput'
import React, { useState } from 'react'
import { FaImage, FaMicrophone, FaPaperPlane } from 'react-icons/fa6'



type Props = {}




function Page({ }: Props) {
    
    const [state, setState] = useState<string>('');

  return (
      <> 
          <div className='h-[calc(100vh-7.5rem)] overflow-y-auto w-full'></div>
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
                  <LabeledInput additionalClasses='p-2 max-w-xl w-full' type={'light'} setValue={(val) => {
                      setState(val);
                  }} />
              <Button type='transparent'>
                  <FaPaperPlane className='text-xl'/>
              </Button>
          </div>
    </>
  )
}

export default Page