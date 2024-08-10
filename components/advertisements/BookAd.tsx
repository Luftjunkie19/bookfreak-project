import React, { useEffect } from 'react'

type Props = {}

function BookAd({ }: Props) {
    
  useEffect(() => {
    try {

        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      
      
      } catch (err) {
        console.log(err);
      }
    
  }, []);

  return (
   <ins className="adsbygoogle max-w-xs rounded-lg bg-red-100 w-full"
     data-ad-client="ca-pub-9822550861323688"
     data-ad-slot="1448327626"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
  )
}

export default BookAd