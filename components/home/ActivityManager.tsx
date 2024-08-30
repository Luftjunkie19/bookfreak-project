/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import uniqid from 'uniqid';
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
import { toast } from 'react-hot-toast';
import { useFirestore } from 'hooks/firestore/useFirestore';
import { Timestamp } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, StorageReference, uploadBytes } from 'firebase/storage';
import { storage } from 'app/firebase';

type Props = {}

function ActivityManager({ }: Props) {
  const { user } = useAuthContext();
  const { insertTo} = useFirestore();
  const { getDocument } = useRealtimeDocument();
  const [userDocument, setUserDocument] = useState<any | null>(null);
  const [postImages, setPostImages] = useState<string[] | ArrayBuffer[]>([]);
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
    const files = e.target.files;

    if (!files) { 
         toast.error('Something went wrong with upload.');
      return;
    }
    

    if (files.length === 0) {
      toast.error('No files selected.');
      return
    }

    for (let index = 0; index < files.length; index++) {
      const element = files[index];

      if (element.size > 100000) {
        toast.error(`Something went wrong with upload of file ${element.name}.`);
        return;
      }

      if (element.type.includes('image')) {
        const fileReader = new FileReader();
         fileReader.readAsDataURL(element);
         fileReader.onload = () => {
           setPostImages([...(postImages as string[]), (fileReader.result as string)]);
         };
           return;
      }

      
    }

  }

  useEffect(() => {
    loadUserObj();
  },[loadUserObj])



  const createPost = async (formData:FormData) => {
    const uniqueId = uniqid();
    const postContent = formData.get('postContent');
    console.log(postContent, 'Triggered');
    try {
      
      if (!postContent || postContent.toString().trim().length === 0) {
        throw new Error('No content provided into the textarea.');
      }

      if (!user) {
        throw new Error('You must be logged in to create a post.');
      }

      let postArray:string[] = [];

      if (postImages.length > 0) {

        for (let index = 0; index < postImages.length; index++) {
          const postImg = postImages[index];
          
          const uploadPath = `postImages/${user.uid}/${uniqueId}/${postImg}`;
  
  
     const image = ref(storage, uploadPath);
  
     const snapshot = await uploadBytes(image, postImg as unknown as Blob);
     const fullImage =  await getDownloadURL(snapshot.ref);
  
       console.log(fullImage);
  
       postArray = [...postArray, fullImage];
        }
      
        
        
      }



      await insertTo('posts', {
        id:uniqueId,
        postContent,
        postedBy:user.uid,
        timeOfPosting: Timestamp.now(),
        postImages: postArray,
        likes: [],
        comments: [],
        shares:[],
      }, uniqueId);

  
  
      toast.success('Successfully created a post ✅');
      
    } catch (err) {
      console.log(err);
    }
  }


  return (
      <form action={createPost}  className='xl:max-w-xl 2xl:max-w-3xl my-2 self-center w-full bg-white rounded-xl shadow-md'>
      <div className="w-full shadow-xl px-2 py-1 border-b border-primary-color">
        {userDocument && 
              <div className="flex gap-2 items-center">
                  <Image width={45} height={54} src={userDocument.photoURL} className='w-8 h-8 rounded-full ' alt='' />
            <p>{userDocument.nickname}</p>
              </div>
        }
          </div>
          
          <div className="flex flex-col gap-2 w-full">
              <textarea name='postContent' className='border-none text-sm outline-none p-1 min-h-44 max-h-56 h-full resize-none' placeholder={`What's bookin', my friend ? Describe what you've been doing recently...`}></textarea>
        <div className="flex gap-4 items-center p-2">
          {postImages.map((item)=>(<Image src={item} alt='' width={60} height={60} className='w-16 h-16 relative top-0 left-0 before:absolute before:-top-full before:left-0 before:w-full hover:before:top-0 before:bg-dark-gray/60 duration-400 transition-all before:h-full rounded-lg'/>))}
              </div>
          </div>
          

           <div className="w-full flex justify-between items-center shadow-xl border-t border-dark-gray px-2 py-1">
              <div className="flex gap-2 items-center">
          <Button onClick={openFileInput} type='transparent' additionalClasses='text-primary-color'>
            <FaImage className='text-2xl' />
            <input onChange={selectImages} ref={fileInputRef} type='file' className='sm:hidden'/>
              </Button>
            <Button type='transparent' additionalClasses='text-dark-gray'><FaBookmark className='text-2xl'/></Button>
              </div>
              <Button isSubmit type='blue' additionalClasses='px-6 py-[0.375rem]'>Publish</Button>
        </div>
    </form>
  )
}

export default ActivityManager