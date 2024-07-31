'use client';
import { useState } from 'react'
import Image from 'next/image'
import React from 'react'
import img from '../../assets/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
import Button from 'components/buttons/Button'
import { FaBookmark, FaImage } from 'react-icons/fa6'
import LabeledInput from 'components/input/LabeledInput'

type Props = {}

function AcitivityManager({ }: Props) {
    const [state, setState] = useState<string>();
  return (
      <div className='sm:max-w-xl 2xl:max-w-3xl w-full bg-white rounded-xl shadow-md'>
          <div className="w-full shadow-xl px-2 py-1 border-b border-primary-color">
              <div className="flex gap-2 items-center">
                  <Image src={img} className='w-8 h-8 rounded-full ' alt='' />
                  <p>Username</p>
              </div>
          </div>
          
          <div className="flex flex-col gap-2 w-full">
              <textarea className='border-none outline-none p-1 min-h-44 max-h-56 h-full resize-none' placeholder={`What's bookin', my friend ? Describe what you've been doing recently...`}></textarea>
              <div className="flex gap-4 items-center"></div>
          </div>
          

           <div className="w-full flex justify-between items-center shadow-xl border-t border-dark-gray px-2 py-1">
              <div className="flex gap-2 items-center">
              <Button type='transparent' additionalClasses='text-primary-color'><FaImage /></Button>
            <Button type='transparent' additionalClasses='text-dark-gray'><FaBookmark/></Button>
              </div>
              <Button type='blue' additionalClasses='px-6 py-[0.375rem]'>Publish</Button>
        </div>
    </div>
  )
}

export default AcitivityManager