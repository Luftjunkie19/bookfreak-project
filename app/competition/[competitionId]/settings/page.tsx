'use client';
import React from 'react'
import Link from "next/link";
import { FaInfo, FaUpload, FaUserGear } from "react-icons/fa6";
import { IoGitPullRequestSharp } from 'react-icons/io5';
import { MdAdminPanelSettings, MdDelete } from 'react-icons/md';
import image from '../../../../assets/Logo.png'
import { FaInfoCircle, FaPauseCircle, FaPencilAlt, FaUsers } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri';
import DashboardBar from 'components/Sidebars/left/competition/DashboardBar';
import AdvertisementBar from 'components/Sidebars/right/AdvertisementBar';
import Image from 'next/image';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import { IoMdDocument, IoMdSwap } from 'react-icons/io';
import { DatePicker, SelectItem, useDisclosure } from '@nextui-org/react';
import ModalComponent from 'components/modal/ModalComponent';
import SingleDropDown from 'components/drowdown/SingleDropDown';
import { PiStackPlusFill } from 'react-icons/pi';
import { GiTargetPrize } from 'react-icons/gi';
import ConditionItem from 'components/condition/ConditionItem';

type Props = {}

function Page({ }: Props) {
    const { isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
      <div className='w-full flex'>
          <DashboardBar/>
          <div className="w-full overflow-y-auto sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] overflow-x-hidden px-4 py-2 flex flex-col gap-6">
              <div className="">
              <p className='text-white flex gap-2 text-2xl items-center'><FaInfoCircle className='text-primary-color'/> Competition Info</p>
              <p className='text-sm font-light text-gray-400'>Provide Changes to the competititon if something unexpected popped into your head</p>           
              </div>
              <div className="flex flex-col gap-2">
              <div className="flex gap-6 w-full sm:flex-col 2xl:flex-row 2xl:items-center">
              <div className="flex sm:flex-wrap lg:flex-row gap-3 p-1 items-center">
                  <Image src={image} alt='' className='h-44 w-44 rounded-full' width={60} height={60}/>
                  <div className="flex flex-col gap-1">
                      <p className='text-white font-light text-xs'>Uploaded file can be up to 50MB</p>
                      <Button type='blue' additionalClasses='items-center gap-2 flex w-fit'>Upload <FaUpload/></Button>
                          </div>
              </div>
                                  <LabeledInput  additionalClasses='p-2 min-w-80 max-w-xs w-full' label='Competition Name' type='dark' setValue={(value) => {
                      console.log(value);
                  }}/>
            

              </div>        
              <div className="flex sm:flex-col lg:flex-row items-center w-full gap-6">
                      <DatePicker className='max-w-xs w-full' classNames={{
                       base:"",
   label: "",
   calendar:"",
   selectorButton:"",
   selectorIcon:"",
   popoverContent:"",
   calendarContent : "",
   inputWrapper: "",
   input: "",
   segment: "",
   helperWrapper: "",
   description: "",
   errorMessage: "",
                          
                  }} labelPlacement='outside'  label={<p className='text-white'>Expiration Date</p>} />
                   
                   
                               <SingleDropDown label='Competition Rules' selectedArray={[]}>
            <SelectItem key={'rule1'}>Rule 1</SelectItem>
             <SelectItem key={'rule2'}>Rule 2</SelectItem>
              <SelectItem key={'rule3'}>Rule 3</SelectItem>
     </SingleDropDown>
                   
              
                  </div>

                    <div className="flex flex-col gap-2 pb-2">
        <div className="">
          <p className='text-xl text-white font-semibold'>Additional Conditions</p>
          <p className='text-xs text-gray-400'>You can add additional conditions users have to fullfill in order to join the competition.</p>
        </div>

          <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-64 max-w-3xl  bg-dark-gray py-4 px-2 rounded-lg  h-full">
                             <ConditionItem conditionName={'Condition 2'} conditionValue={3} inputType={'number'} />
                </div> 

        <Button onClick={onOpen} additionalClasses='w-fit px-4 py-2 flex items-center gap-2' type='blue'>New Condition <PiStackPlusFill/></Button>
        <ModalComponent modalSize='xl' modalFooterContent={<div className='flex gap-3 items-center'>
            <Button type='blue' additionalClasses="w-fit  px-4 py-2">
        Append
      </Button>
 </div>} modalTitle='Additional Conditions' modalBodyContent={<div className='flex flex-col gap-3'>
                                    
          <SingleDropDown label='Type of Rule' selectedArray={[]}>
     <SelectItem key={'rule1'}>Min. Read Pages of Genre</SelectItem>
         <SelectItem key={'rule1'}>Min. Read Books of Genre</SelectItem>
     <SelectItem key={'rule2'}>Min. Read Books Amount</SelectItem>
     <SelectItem key={'rule2'}>Min. Read Pages Amount</SelectItem>
          <SelectItem key={'rule2'}>Peculiar Question</SelectItem>
   </SingleDropDown>
   
  <LabeledInput  additionalClasses="max-w-sm w-full p-2" label="Question" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />


           <SingleDropDown label='Answer Accessment' selectedArray={[]}>
     <SelectItem key={'rule1'}>Manual</SelectItem>
         <SelectItem key={'rule1'}>Expected Answers</SelectItem>
   </SingleDropDown>
   
     <textarea placeholder='Enter answers...' className="w-full text-white bg-secondary-color p-2 h-52 overflow-y-auto  resize-none outline-none rounded-md border-2 border-primary-color"  />

                        
                      </div>} isOpen={isOpen} onOpenChange={onOpenChange} />

      </div>
                  
                  <div className="flex flex-col gap-1">
                      <p className='text-white'>Description</p>
                      <textarea placeholder='Enter Description' className="w-full text-white max-w-3xl h-60 p-2 rounded-lg bg-dark-gray outline-none border border-primary-color"/>
                  </div>

                  <Button type="blue" additionalClasses='w-fit px-8'>Update</Button>
              </div>
                 <div className="flex flex-col gap-2">
              <p className='text-white flex gap-2 text-2xl items-center'><GiTargetPrize  className='text-primary-color'/> Competition's Prize</p>
              <p className='text-sm font-light max-w-2xl text-gray-400'>You can handle the competition's prize as you wish ? Want to swap the prize for a different one ? Do it here !</p>           
             
                  <div className="flex overflow-x-auto gap-4 items-center">
                      <Button type="blue" additionalClasses='w-fit px-4 text-nowrap flex gap-2 items-center'>Swap Prize <IoMdSwap/> </Button>
                      <Button type="blue" additionalClasses='w-fit px-4 flex text-nowrap gap-2 items-center'>Change Details <FaPencilAlt /></Button>
                  </div>
             
              </div>
               <div className="flex flex-col gap-2">
              <p className='text-white flex gap-2 text-2xl items-center'><MdDelete   className='text-red-400'/> Competition's Deletion</p>
              <p className='text-sm font-light max-w-2xl text-gray-400'>You can handle the competition's deletion as you wish ? Your situation changed or because of another reasons you have to delete or terminate the competition ? Feel free to do it.</p>           
             
                  <div className="flex gap-4 items-center">
                      <Button type='transparent' additionalClasses='w-fit bg-yellow-600 px-4 flex gap-2 items-center'>Terminate <FaPauseCircle /> </Button>
                      <Button type="black" additionalClasses='w-fit px-4 flex gap-2 bg-red-400 items-center'>Cancel <MdDelete /></Button>
                  </div>
             
              </div>
          </div>
    </div>
  )
}

export default Page