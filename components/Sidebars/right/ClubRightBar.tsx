'use client';
import useGetCollection from 'hooks/firestore/useGetCollection';
import { useRealDocument } from 'hooks/firestore/useGetRealDocument';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation'
import { useRouter } from 'next/router';
import React, { Suspense, useMemo } from 'react'

type Props = {}

function CompetitionBar() {
    const { clubId } = useParams(); 
    const { documents } = useGetCollection('users');
    const { document } = useRealDocument('clubs', (clubId as string));
    
    const membersList = useMemo(() => {
        if (document) {
            return document.members.map((item) => documents.find((obj) => obj.id === item.id));
        }
        
    }, [document]);


  return (
      <div className="h-screen bg-dark-gray border-l-2 border-primary-color flex flex-col max-w-xs gap-3 p-2 w-full">
          {document && membersList.map((userObj) => (<Suspense fallback={<p>Loading....</p>}>
              <div className='text-white flex items-center gap-3'>
              <Image src={userObj?.photoURL} alt="" width={60} height={60} className="w-12 h-12 rounded-full" />
<p>{userObj?.nickname}</p>
          </div>
          </Suspense>))}

            </div>
  )
}

export default CompetitionBar