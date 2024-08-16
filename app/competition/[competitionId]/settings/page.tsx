'use client';
import React from 'react'
import Link from "next/link";
import { FaInfo, FaUpload, FaUserGear } from "react-icons/fa6";
import { IoGitPullRequestSharp } from 'react-icons/io5';
import { MdAdminPanelSettings } from 'react-icons/md';
import image from '../../../../assets/Logo.png'
import { FaInfoCircle, FaUsers } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri';
import DashboardBar from 'components/Sidebars/left/competition/DashboardBar';
import AdvertisementBar from 'components/Sidebars/right/AdvertisementBar';
import Image from 'next/image';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import { IoMdDocument } from 'react-icons/io';
import { useDisclosure } from '@nextui-org/react';
import ModalComponent from 'components/modal/ModalComponent';

type Props = {}

function Page({ }: Props) {
    const { isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
      <div className='w-full flex h-screen overflow-y-auto overflow-x-hidden'>
          <DashboardBar/>
          <div className="w-full h-screen overflow-y-auto overflow-x-hidden px-4 py-2 flex flex-col gap-2">
              <div className="">
              <p className='text-white flex gap-2 text-2xl items-center'><FaInfoCircle className='text-primary-color'/> Competition Info</p>
              <p className='text-sm font-light text-gray-400'>Provide Changes to the competititon if something unexpected popped into your head</p>           
              </div>
              <div className="flex flex-col gap-2">
              <div className="flex gap-6 p-2 w-full items-center">
              <div className="flex gap-3 p-1 items-center">
                  <Image src={image} alt='' className='h-44 w-44 rounded-full' width={60} height={60}/>
                  <div className="flex flex-col gap-1">
                      <p className='text-white font-light text-xs'>Uploaded file can be up to 50MB</p>
                      <Button type='blue' additionalClasses='items-center gap-2 flex w-fit'>Upload <FaUpload/></Button>
</div>
              </div>
                  <LabeledInput additionalClasses='p-2 min-w-80 max-w-xs w-full' label='Competition Name' type='dark' setValue={(value) => {
                      console.log(value);
              }} />
              </div>        
              <div className="flex items-center w-full gap-6">
                    <LabeledInput additionalClasses='p-2 min-w-80 max-w-xs w-full' label='Expiration Date' type='dark' setValue={(value) => {
                      console.log(value);
                  }} />
                    <LabeledInput additionalClasses='p-2 min-w-80 max-w-xs w-full' label='Competition Rules' type='dark' setValue={(value) => {
                      console.log(value);
                  }}/>
                  </div>

                  <div className="flex flex-col gap-2 max-w-2xl">
                      <p className='text-white text-2xl'>Additional Conditions</p>
                      <p className='text-white'>In this section you can set additional conditions/questions, that users who want to request for membership.</p>

                      <Button onClick={onOpen} type='blue' additionalClasses=" max-w-xs w-full flex gap-2 items-center justify-between">
                          <p >3 <span>Additional Conditions</span></p> <IoMdDocument className='text-2xl'/> 
                      </Button>
                      <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                      <p className='text-white'>Description</p>
                      <textarea placeholder='Enter Description' className="w-full text-white max-w-3xl h-60 p-2 rounded-lg bg-dark-gray outline-none border border-primary-color"/>
                  </div>

                  <Button type="blue" additionalClasses='w-fit px-8'>Update</Button>
              </div>
              
          </div>
    </div>
  )
}

export default Page