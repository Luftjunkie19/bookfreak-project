'use client';

import { useEffect } from 'react';



const AdBanner = (props) => {
  useEffect(() => {
    try {

        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      
      
      } catch (err) {
        console.log(err);
      }
    
  }, []);

  return (
    <ins
      className="adsbygoogle adbanner-customize py-2"
      style={{
        display: 'block',
        overflow: 'hidden',
      }}
      {...props}
    />
  );
};
export default AdBanner;