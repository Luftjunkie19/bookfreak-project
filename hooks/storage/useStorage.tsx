
import { createClient } from 'lib/supabase/client';
import React from 'react'



function useStorage() {
  const supabase = createClient();

  const uploadImage = async (fileObject: File, bucket: string, path: string) => {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(path, fileObject);
  
      

    return {error, data}
      
    } catch (err) {
      return {error:err, data:null}
    }
  }

    const uploadImageUrl=async(path:string, bucketName:string)=>{
      try {
  
  const { data } = await supabase.storage.from(bucketName).getPublicUrl(path, {
    'download':true,
  });

  return data.publicUrl;
  
} catch (error) {
        console.log(error);
}
  }
  

  const getImageUrl = async (bucketName:string, path:string) => {
    try {

      const image = supabase.storage.from(bucketName).toBase64(path);

      return {image, error:null}

    } catch (err) {
      return {error:err, image:null}
    }
  }

  return {uploadImage, uploadImageUrl, getImageUrl}
}

export default useStorage