'use client';
import useGetCollection from 'hooks/firestore/useGetCollection';
import { useRealDocument } from 'hooks/firestore/useGetRealDocument';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation'
import { useRouter } from 'next/router';
import React, { Suspense, useMemo } from 'react'

type Props = {}

function CompetitionBar() {
    const { competitionId } = useParams();
    const { documents } = useGetCollection('users');
    const { document } = useRealDocument('competitions', (competitionId as string));
      const pathname = usePathname();
    const usersList = useMemo(() => {
        if (document) {
            return document.members.map((item) => documents.find((obj) => obj.id === item.id));
        }
        
    }, [document]);


    return (
        <div className={`sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] bg-dark-gray ${!pathname.includes('settings') ? 'flex' : 'hidden'} border-l-2 border-primary-color flex-col sm:w-fit 2xl:max-w-xs p-2 2xl:w-full`}>
          {document && usersList.map((userObj) => (<Suspense fallback={<p>Loading....</p>}>
              <div className='text-white flex items-center gap-3'>
              <Image src={userObj.photoURL} alt="" width={60} height={60} className="w-12 h-12 rounded-full" />
<p>{userObj.nickname}</p>
          </div>
          </Suspense>))}

            </div>
  )
}

export default CompetitionBar