'use client';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import useGetUserObjectEffected from 'hooks/firestore/useGetCurrentUserDocument'
import React from 'react'
import Cards from 'react-credit-cards-2';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css';

type Props = {}

function Page({ }: Props) {
  
  const { document } = useGetUserObjectEffected();

  return (
    <div className='flex flex-col gap-3'>
      {document && <p className='text-white text-2xl'>Hello, {document.nickname} !</p>}
      
      <p className='text-white'>Financial Data</p>
      <div className="grid gap-4 grid-cols-3 max-w-5xl w-full">
        <LabeledInput label='First Name' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Last Name' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Email' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <div className="flex flex-col gap-1">
        <p className='text-white'>Phone Number</p>
        <PhoneInput buttonClass='bg-dark-gray text-white' dropdownClass='bg-dark-gray text-white' containerClass='max-w-xs w-full text-white' inputClass='bg-dark-gray text-white p-2 ' />
        </div> 
      </div>
      
      <p className='text-white'>Address</p>
       <div className="grid gap-4 grid-cols-3 max-w-5xl w-full">
        <LabeledInput label='Address' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='City' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Zip Code' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-xs w-full' />
      </div>


         <p className='text-white'>Bank Account</p>
       <div className="grid gap-4 grid-cols-3 max-w-5xl w-full">
        <LabeledInput label='IBAN' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Currency' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Confirm IBAN' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-xs w-full' />
      </div>

      <Button type='blue' additionalClasses='w-fit px-4'>Submit</Button>



      <div className=" grid-cols-2 grid items-center">
        <div className="bg-dark-gray max-w-3xl w-full p-4 border-2 border-primary-color rounded-lg flex flex-col gap-2">
      <div className="flex gap-2 items-center max-w-3xl w-full justify-between">
            <div className=" max-w-56 w-full p-2">    
        <Cards
        focused='name'
        number={4901490149014901}
        expiry={1218}
        cvc={412}
        name={'John Smith'}
      />
          </div>
          <div className="flex flex-col gap-4">
            <LabeledInput label='Card Number' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-xs w-full' />
            <div className="flex justify-between gap-2 items-center"
            >
 <LabeledInput placeholder='MM/YY' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-36 w-full' />
             <LabeledInput placeholder='CVC' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-36 w-full' />
            </div>
             <LabeledInput label='Card Holder' setValue={(val) => { }} type='dark' additionalClasses='p-2 max-w-xs w-full' />
          </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type='blue' additionalClasses='w-fit px-4'>Update</Button>
             <Button type='white-blue' additionalClasses='w-fit px-4'>Add Card</Button>
          </div>

        </div>
  

        <div className="bg-dark-gray p-2 flex flex-col justify-between rounded-lg border-2 max-w-xs w-full border-primary-color">
          <div className="">
          <p>Current Plan</p>
          <p className='text-green-400 text-2xl font-bold'>FOTM PLAN</p>
           <p>Next Payment on 25th of December</p>
          </div>
          <div className="">
            <p>Manage Plan</p>
            <div className="flex gap-3 items-center">
              <Button type='blue' additionalClasses='w-fit px-4'>Switch</Button>
              <Button type='black' additionalClasses='w-fit px-4'>Pause</Button>
              <Button type='black' additionalClasses='w-fit px-4'>Cancel</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Page