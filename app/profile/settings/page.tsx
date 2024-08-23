
'use client';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import ProfileDashboardBar from 'components/Sidebars/left/profile/ProfileDashboardBar';
import useGetDocument from 'hooks/firestore/useGetDocument';
import useGetUserObjectEffected from 'hooks/firestore/useGetCurrentUserDocument';
import { useAuthContext } from 'hooks/useAuthContext';
import useRealtimeDocument from 'hooks/useRealtimeDocument';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import { AiOutlineUserDelete } from 'react-icons/ai';
import { FaImage, FaUserFriends } from 'react-icons/fa';

type Props = {}

function Page({ }: Props) {
  const { user } = useAuthContext();
  const { document } = useGetUserObjectEffected();


  return (
 
    <div className='flex w-full'>
      <ProfileDashboardBar/>
      
      <div className="sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] overflow-y-auto w-full">
        {document &&<div className='flex flex-col gap-12'>
          <div className='bg-dark-gray flex min-h-52 justify-center items-center relative top-0 left-0'>
            <div className="flex justify-center items-center flex-col">
              <FaImage className='self-center text-8xl text-primary-color' />
              <p className='text-sm text-center text-gray-500'>Wanna ad or change any img click one of those 2 and change for a better fitting one !</p>
          </div>
          <div className="flex gap-8 items-center absolute -bottom-12 left-4 m-2">
            <Image src={document.photoURL} alt='' width={60} height={60} className='lg:w-48 lg:h-48 sm:w-28 sm:h-28 rounded-full' />
            </div>
            
          </div>


          <div className="flex flex-col p-3 gap-6">
          <div className="flex sm:flex-col lg:flex-row gap-4  lg:items-center w-full">
            <LabeledInput containerStyle='max-w-xs w-full' additionalClasses='p-2 max-w-xs w-full' type='dark' setValue={(value)=>{}}  label="Nickname" />
            <LabeledInput containerStyle='max-w-xs w-full' additionalClasses='p-2 max-w-xs w-full' type='dark' setValue={(value) => { }} label="Email" />
               <div className="flex flex-col gap-2 max-w-xs w-full">
<p className="text-white">Version Language</p>
            <ReactFlagsSelect className='max-w-xs w-full'  searchable showOptionLabel selectButtonClassName='bg-dark-gray text-white border-primary-color font-inherit max-w-xs w-full' selected={"PL"}  onSelect={function (countryCode: string): void {
              console.log(countryCode)
            } }/>
          </div>
            </div>
           <div className="flex flex-col gap-1">
                      <p className='text-white'>Description</p>
                      <textarea placeholder='Enter Description' className="w-full text-white max-w-3xl h-60 p-2 rounded-lg bg-dark-gray outline-none border border-primary-color"/>
                  </div>

            <Button type='blue' additionalClasses='w-fit px-4'>Update</Button>
          </div>
          

          <div className="flex flex-col gap-1 p-2">
            <p className='text-white text-2xl flex gap-2 items-center'>Delete Account <AiOutlineUserDelete className='text-red-400' /></p>
            <p className='text-gray-400 text-sm max-w-3xl'>You can delete your account, if you don't feel comfortable anymore to be a member of BookFreak. Your all data, progress, chats will be removed permanently by clicking this button below.</p>
            <Button type='black' additionalClasses='bg-red-400 my-2 w-fit px-2'>Delete Account</Button>
          </div>

        </div>
         }
    
      </div>
      
    </div>
    
 
  )
}

export default Page