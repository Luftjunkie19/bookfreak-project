'use client';
import { SelectItem } from '@nextui-org/react'
import Button from 'components/buttons/Button';
import SingleDropDown from 'components/drowdown/SingleDropDown'
import LabeledInput from 'components/input/LabeledInput'
import Link from 'next/link';
import React from 'react'
import { FaFacebook } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { IoCloseCircle } from 'react-icons/io5';

type Props = {}

function Page({}: Props) {
  return (
    <div className='w-full sm:h-[calc(100vh-3.5rem)] overflow-y-auto lg:h-[calc(100vh-4rem)] flex flex-col gap-3 p-2'>
      <div className="">
      <p className='text-white text-2xl'>Your Links</p>
       <p className='text-gray-400 text-sm'>In this page, you can link to any outside social-media you would like to.</p>
      </div>

      <div className="flex flex-col gap-2">
        <LabeledInput type='dark' additionalClasses='max-w-xs w-full p-2' label='Link Name'  />
        
        <LabeledInput type='dark' additionalClasses='max-w-xs w-full p-2' label='Link URL' />

      <SingleDropDown label='Link Type'>
            <SelectItem key={'fb'}>Facebook</SelectItem>
            <SelectItem key={'tt'}>Titkok</SelectItem>
        <SelectItem key={'ig'}>Instagram</SelectItem>
        <SelectItem key={'tr'}>Twitter</SelectItem>
        <SelectItem key={'sp'}>Spotify</SelectItem>
         <SelectItem key={'other'}>Others</SelectItem>
        </SingleDropDown>
        
        <Button additionalClasses='w-fit px-3' type='blue'>Append</Button>
</div>

      <div className="flex flex-col gap-1">
      <p className='text-xl text-white'>8 Links, you added to your profile</p>
      <div className="max-w-md w-full h-64 flex flex-col gap-2 rounded-lg bg-dark-gray overflow-y-auto">
        <div className="flex gap-2 items-center p-2">
          <div className="flex gap-2 flex-1 items-center">
            <FaFacebook className='text-primary-color text-3xl'/>
            <div className="flex flex-col">
              <p className="text-white text-sm">Facebook</p>
              <Link href={'https://facebook.com'} className=' text-gray-400 underline'>Link to Facebook</Link>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <Button type="transparent"><FaPencil className='text-primary-color text-xl'/></Button>
              <Button type="transparent"><IoCloseCircle className='text-red-400 text-xl' /></Button>
          </div>
        </div>
          <div className="flex gap-2 items-center p-2">
          <div className="flex gap-2 flex-1 items-center">
            <FaFacebook className='text-primary-color text-3xl'/>
            <div className="flex flex-col">
              <p className="text-white text-sm">Facebook</p>
              <Link href={'https://facebook.com'} className=' text-gray-400 underline'>Link to Facebook</Link>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <Button type="transparent"><FaPencil className='text-primary-color text-xl'/></Button>
              <Button type="transparent"><IoCloseCircle className='text-red-400 text-xl' /></Button>
          </div>
        </div>
          <div className="flex gap-2 items-center p-2">
          <div className="flex gap-2 flex-1 items-center">
            <FaFacebook className='text-primary-color text-3xl'/>
            <div className="flex flex-col">
              <p className="text-white text-sm">Facebook</p>
              <Link href={'https://facebook.com'} className=' text-gray-400 underline'>Link to Facebook</Link>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <Button type="transparent"><FaPencil className='text-primary-color text-xl'/></Button>
              <Button type="transparent"><IoCloseCircle className='text-red-400 text-xl' /></Button>
          </div>
        </div>
          <div className="flex gap-2 items-center p-2">
          <div className="flex gap-2 flex-1 items-center">
            <FaFacebook className='text-primary-color text-3xl'/>
            <div className="flex flex-col">
              <p className="text-white text-sm">Facebook</p>
              <Link href={'https://facebook.com'} className=' text-gray-400 underline'>Link to Facebook</Link>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <Button type="transparent"><FaPencil className='text-primary-color text-xl'/></Button>
              <Button type="transparent"><IoCloseCircle className='text-red-400 text-xl' /></Button>
          </div>
        </div>
          <div className="flex gap-2 items-center p-2">
          <div className="flex gap-2 flex-1 items-center">
            <FaFacebook className='text-primary-color text-3xl'/>
            <div className="flex flex-col">
              <p className="text-white text-sm">Facebook</p>
              <Link href={'https://facebook.com'} className=' text-gray-400 underline'>Link to Facebook</Link>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <Button type="transparent"><FaPencil className='text-primary-color text-xl'/></Button>
              <Button type="transparent"><IoCloseCircle className='text-red-400 text-xl' /></Button>
          </div>
        </div>
          <div className="flex gap-2 items-center p-2">
          <div className="flex gap-2 flex-1 items-center">
            <FaFacebook className='text-primary-color text-3xl'/>
            <div className="flex flex-col">
              <p className="text-white text-sm">Facebook</p>
              <Link href={'https://facebook.com'} className=' text-gray-400 underline'>Link to Facebook</Link>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <Button type="transparent"><FaPencil className='text-primary-color text-xl'/></Button>
              <Button type="transparent"><IoCloseCircle className='text-red-400 text-xl' /></Button>
          </div>
        </div>
          <div className="flex gap-2 items-center p-2">
          <div className="flex gap-2 flex-1 items-center">
            <FaFacebook className='text-primary-color text-3xl'/>
            <div className="flex flex-col">
              <p className="text-white text-sm">Facebook</p>
              <Link href={'https://facebook.com'} className=' text-gray-400 underline'>Link to Facebook</Link>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <Button type="transparent"><FaPencil className='text-primary-color text-xl'/></Button>
              <Button type="transparent"><IoCloseCircle className='text-red-400 text-xl' /></Button>
          </div>
        </div>
      </div>
      </div>

    </div>
  )
}

export default Page