import BlueDarkGradientButton from 'components/buttons/gradient/BlueDarkGradientButton';
import LightGradientButton from 'components/buttons/gradient/LightGradientButton';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = { clubLogo: string, clubName: string, requiredPages?:number, membersAmount:number, clubData:any}

function Club({clubData, clubLogo, clubName, requiredPages}: Props) {
  return (
    <Link href={'/club/'} className='max-w-xs w-full bg-dark-gray text-white border-primary-color border-2 rounded-lg flex flex-col gap-2'>
      <Image className='w-full object-cover h-36 rounded-t-lg' src={clubLogo} alt={''} width={64} height={64} />
      <div className="flex flex-col gap-1 px-3 py-2">
        <p>{clubName}</p>
        {requiredPages && <p>Required: {requiredPages} read pages</p>}
        <p>Est. {formatDistanceToNow(clubData.createdBy.createdAt)} ago</p>
  <LightGradientButton additionalClasses='self-end mt-2'>Show More</LightGradientButton>
      </div>
    </Link>
  )
}

export default Club