import { storage } from 'app/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React from 'react'



function useStorage() {

    const uploadImage=async(fileObject:File, path:string)=>{
    
     const storageRef = ref(storage, path);
  
     const snapshot = await uploadBytes(storageRef, fileObject);
     const fullImage =  await getDownloadURL(snapshot.ref);
  
       return fullImage;
    }

  return {uploadImage}
}

export default useStorage