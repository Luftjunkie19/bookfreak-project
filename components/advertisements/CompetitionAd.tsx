'use client';
import React, { useEffect } from 'react'

type Props = {}

function CompetitionAd({ }: Props) {

  useEffect(() => {
    try {

        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      
      
      } catch (err) {
        console.log(err);
      }
    
  }, []);

  return (
             <ins className="adsbygoogle w-full max-h-52 h-full  rounded-lg bg-dark-gray"
     data-ad-client="ca-pub-9822550861323688"
     data-ad-slot="8396083192"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
  )
}

export default CompetitionAd