
import { createClient } from 'lib/supabase/client';
import React from 'react'



function useStorage() {
  const supabase = createClient();

  const uploadImage = async (fileObject: File, bucket: string, path: string) => {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(path, fileObject);
  
      if (error) {
        throw new Error(error.message, {
          'cause': error.cause
        });
      }

      console.log(data);
      
    } catch (err) {
      console.error(err);
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

  return {uploadImage, uploadImageUrl}
}

export default useStorage