'use client';
import { useQuery } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import { useAuthContext } from 'hooks/useAuthContext';
import React from 'react'
import Card from 'react-credit-cards-2';
import { FaPauseCircle } from 'react-icons/fa';
import { IoMdSwap } from 'react-icons/io';
import { MdCancel } from 'react-icons/md';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css';

function Page() {
  const {user}= useAuthContext();
  
  const { data: document } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id:user!.id, include:{
        'recensions':{'include':{'book':true}},
        'booksInRead':{orderBy:{'readingDate':'desc'}}, 
        'notifications':true,
       }}),
    }).then((res) => res.json())
  });


  return (
    <div className='flex flex-col pb-2 overflow-y-auto sm:h-[calc(100vh-3.5rem)] xl:h-[calc(100vh-4rem)] gap-3'>
      {document && <p className='text-white text-2xl'>Hello, {document.data.nickname} !</p>}
      
      <p className='text-white'>Financial Data</p>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-5xl w-full">
        <LabeledInput label='First Name' type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Last Name' type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Email' type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <div className="flex flex-col gap-1">
        <p className='text-white'>Phone Number</p>
        <PhoneInput buttonClass='bg-dark-gray text-white' dropdownClass='bg-dark-gray text-white' containerClass='max-w-xs w-full text-white' inputClass='bg-dark-gray text-white p-2 ' />
        </div> 
      </div>
      
      <p className='text-white'>Address</p>
       <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-5xl w-full">
        <LabeledInput label='Address'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='City'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Zip Code'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
      </div>


         <p className='text-white'>Bank Account</p>
       <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-5xl w-full">
        <LabeledInput label='IBAN'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Currency'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Confirm IBAN'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
      </div>

      <Button type='blue' additionalClasses='w-fit px-4'>Submit</Button>

       <p className='text-white text-3xl'>Credits Management</p>
      <div className="flex sm:flex-col lg:flex-row gap-4 items-center">
        <div className="bg-dark-gray max-w-md w-full flex flex-col gap-4 p-2 rounded-lg">
          <div className="flex gap-1 flex-col">
            <p className='text-white'>Your Owned Funds</p>
          <p className='text-green-400 font-bold text-3xl'>00.00 PLN</p>
          <p className='text-gray-400 text-xs'>0.00 PLN Pending</p>
          <p className='text-sm text-gray-600'>This amount is ready to payout</p>
          </div>
          
         <LabeledInput placeholder='Enter the amount...' label='Payout Amount' type='transparent' additionalClasses='p-2 border-b-2 rounded-none border-green-400 max-w-xs w-full' />
         <Button type='black' additionalClasses='w-fit bg-green-400 px-4'>Payout</Button>
        </div>

  <div className="bg-dark-gray max-w-md w-full min-h-[16.125rem] flex flex-col gap-4 p-2 rounded-lg">
          <div className="flex gap-1 flex-col">
            <p className='text-white text-xl'>Replenish your account</p>
          <p className='text-sm text-gray-600'>Topup your BookFreak Account and Feel Free to explore a BookFreakish World !</p>
          </div>
          
          <div className="self-center w-full flex flex-col justify-center items-center gap-6">
         <LabeledInput placeholder='Enter the amount...'  type='transparent' additionalClasses='p-2 rounded-none border-b-2 border-green-400 max-w-sm w-full' />
         <Button type='black' additionalClasses='max-w-36 w-full bg-green-400 px-4'>Topup</Button>
          </div>
        </div>
      
      </div>


      <p className='text-white text-3xl'>Subscription Management</p>
      <div className=" flex gap-3 sm:flex-wrap xl:flex-row  items-center w-full ">

    <div className="bg-dark-gray xl:min-h-[20.125rem] sm:max-h-64 h-full p-2 flex flex-col justify-between rounded-lg border-2 max-w-md w-full border-primary-color">
          <div className="">
          <p className='text-white font-thin'>Current Plan</p>
          <p className='text-green-400 text-4xl font-bold'>FOTM PLAN</p>
           <p className='text-white'>Next Payment on 25th of December</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className='text-white'>Manage Plan</p>
            <div className="flex gap-3 items-center">
              <Button type='blue' additionalClasses='w-fit flex gap-2 items-center px-4'>Switch <IoMdSwap /></Button>
              <Button type='black' additionalClasses='w-fit flex gap-2 items-center bg-yellow-600 px-4'>Pause <FaPauseCircle /></Button>
              <Button type='black' additionalClasses='w-fit flex gap-2 items-center bg-red-400 px-4'>Cancel <MdCancel /> </Button>
            </div>
          </div>
        </div>

        <div className="bg-dark-gray max-w-3xl w-full py-6 px-3 border-2 border-primary-color rounded-lg flex flex-col gap-2">
      <div className="flex sm:flex-col lg:flex-wrap 2xl:flex-row gap-2 items-center max-w-3xl w-full justify-between">
            <div className=" max-w-56 w-full p-2">    
        <Card 
        focused='name'
        number={4901490149014901}
        expiry={1218}
        cvc={412}
                name={'John Smith'}
                preview={true}
      />
          </div>
          <div className="flex sm:self-start flex-col gap-4">
            <LabeledInput label='Card Number'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
            <div className="flex justify-between gap-2 items-center"
            >
 <LabeledInput placeholder='MM/YY'  type='dark' additionalClasses='p-2 max-w-36 w-full' />
             <LabeledInput placeholder='CVC'  type='dark' additionalClasses='p-2 max-w-36 w-full' />
            </div>
             <LabeledInput label='Card Holder'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
          </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type='blue' additionalClasses='w-fit px-4'>Update</Button>
             <Button type='white-blue' additionalClasses='w-fit px-4'>Add Card</Button>
          </div>

        </div>
  

    

      </div>
    </div>
  )
}

export default Page