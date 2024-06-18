import BlueDarkGradientButton from 'components/buttons/gradient/BlueDarkGradientButton';
import Image from 'next/image';
import React from 'react';

type Props = { clubLogo: string, clubName: string, membersAmount:number, clubData:any}

function Club({clubData, clubLogo, clubName}: Props) {
  return (
    <div className='max-w-60 w-full flex flex-col gap-2'>
      <Image className='w-full h-36' src={clubLogo} alt={''} width={64} height={64} />
      <div className="flex flex-col gap-1 px-2 py-1">
        <p>{clubName}</p>
        <p>{JSON.stringify(clubData)}</p>
  <BlueDarkGradientButton additionalClasses='self-end'>Show</BlueDarkGradientButton>
      </div>
    </div>
  )
}

export default Club