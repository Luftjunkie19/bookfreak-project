/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import React from 'react'
import img from '../../assets/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
import Button from 'components/buttons/Button'
import { FaBookmark, FaImage } from 'react-icons/fa6'
import LabeledInput from 'components/input/LabeledInput'
import { useRealDatabase } from 'hooks/useRealDatabase';
import useRealtimeDocument from 'hooks/useRealtimeDocument';
import useGetDocument from 'hooks/useGetDocument';
import { useAuthContext } from 'hooks/useAuthContext';
import { User } from 'firebase/auth';

type Props = {}

function ActivityManager({ }: Props) {
  const { user } = useAuthContext();
  const { getDocument } = useRealtimeDocument();
  

  const [state, setState] = useState<string>();
  const [userDocument, setUserDocument] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadUserObj = useCallback(async () => {
    if (user) {
      const obj = await getDocument('users', user.uid);
      setUserDocument(obj);
      console.log(obj);
    }
  }, [user]);

  const openFileInput = () => {
    fileInputRef.current?.click();
  }

  const selectImages = (e:React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files)
  }

  useEffect(() => {
    loadUserObj();
  },[loadUserObj])



  const triggerWrite = async () => {

  }


  return (
      <div className=' xl:max-w-xl 2xl:max-w-3xl my-2 self-center w-full bg-white rounded-xl shadow-md'>
      <div className="w-full shadow-xl px-2 py-1 border-b border-primary-color">
        {userDocument && 
              <div className="flex gap-2 items-center">
                  <Image width={45} height={54} src={userDocument.photoURL} className='w-8 h-8 rounded-full ' alt='' />
            <p>{userDocument.nickname}</p>
              </div>
        }
          </div>
          
          <div className="flex flex-col gap-2 w-full">
              <textarea className='border-none text-sm outline-none p-1 min-h-44 max-h-56 h-full resize-none' placeholder={`What's bookin', my friend ? Describe what you've been doing recently...`}></textarea>
              <div className="flex gap-4 items-center"></div>
          </div>
          

           <div className="w-full flex justify-between items-center shadow-xl border-t border-dark-gray px-2 py-1">
              <div className="flex gap-2 items-center">
          <Button onClick={openFileInput} type='transparent' additionalClasses='text-primary-color'>
            <FaImage className='text-2xl' />
            <input onChange={selectImages} ref={fileInputRef} type='file' className='sm:hidden'/>
              </Button>
            <Button type='transparent' additionalClasses='text-dark-gray'><FaBookmark className='text-2xl'/></Button>
              </div>
              <Button type='blue' additionalClasses='px-6 py-[0.375rem]' onClick={triggerWrite}>Publish</Button>
        </div>
    </div>
  )
}

export default ActivityManager