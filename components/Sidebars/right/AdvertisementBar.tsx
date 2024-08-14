'use client'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'


function AdvertisementBar() {
    const pathname = usePathname();
  return (
   
      <ins className={`adsbygoogle xl:max-w-52 2xl:max-w-64 w-full bg-dark-gray ${pathname.includes('/form') || pathname.includes('/test/') || pathname.includes('settings') ? 'sm:hidden xl:block' : 'hidden'}`}
     data-ad-format="autorelaxed"
     data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
     data-ad-slot="2270283264"></ins>

  )
}

export default AdvertisementBar