'use client';

import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  testData:any
}

function Test({testData}: Props) {
  return (
    <Link href={`/test/${testData.testId}`} className='rounded-lg bg-white '>
      <Image src={testData.refersToBook.photoURL} alt='' width={60} height={60} className='w-full h-32 object-cover rounded-t-lg'/>
      <div className="p-2">
        
        <p>{testData.testName}</p>
      <p>{Object.values(testData.queries).length} Queries</p>
        <p className=' line-clamp-1'>Created by {testData.createdBy.nickname}</p>
        <p>{formatDistanceToNow(testData.createdAt)} ago</p>
     </div>
    </Link>
  )
}

export default Test