'use client';
import { image } from '@nextui-org/theme';
import Button from 'components/buttons/Button'
import Image from 'next/image';
import React, { useState } from 'react'
import { FaImage, FaMicrophone, FaPaperPlane } from 'react-icons/fa6'

type Props = {}

function Page({ }: Props) {
    
    const [imageResult, setImageResult] = useState<any>(null);
    
    const submitForm = async (formData: FormData) => {
        const prompt = formData.get('prompt');

        const imageFetch = await fetch('/api/ai/image-generator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        const imageResult = await imageFetch.json();

        setImageResult(imageResult.images);
    }


  return (
   <div className='flex flex-col max-h-screen h-full'>
    <div className='overflow-y-auto p-4 space-y-4 sm:h-[calc(100vh-6.25rem)] xl:h-[calc(100vh-7rem)]'>
              {imageResult && <>
                  {imageResult.map((image) => (
    <Image src={image.url} alt='' width={60} height={60} className='w-40 h-40 rounded-lg'/>
))}
              
              </>}
    </div>

          <form 
    action={submitForm}          
        className='flex items-center justify-between border-t-1 border-gray-400 p-2 bg-dark-gray'
          >
              <div className={`gap-3 items-center  opacity-0 -translate-x-full w-auto translate-x-0'} transition-all duration-500`}>
            <div className="flex gap-2 items-center text-primary-color">
                <Button type='transparent'>
                    <FaImage className='text-xl'/>
                </Button>
                <Button type='transparent'>
                    <FaMicrophone className='text-xl'/>
                </Button>
            </div>
        </div>
              

              <input 
                 
                  className='max-w-lg bg-transparent  w-full font-normal transition-all text-white duration-300 p-1 border-none outline-none rounded-md' 
                  placeholder='Enter Your Message...'
            name="prompt"  
        />

        <div className='flex gap-4 items-center w-fit'>
            <Button isSubmit type='transparent'>
                <FaPaperPlane className='text-xl text-primary-color'/>
            </Button>
        </div>
    </form>
</div>
  )
}

export default Page