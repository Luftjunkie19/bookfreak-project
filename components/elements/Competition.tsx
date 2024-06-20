import BlueButton from 'components/buttons/BlueButton'
import BlueDarkGradientButton from 'components/buttons/gradient/BlueDarkGradientButton'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    competitionLogo: string,
    competitionName: string,
    membersAmount: number,
    comeptitionRemainingTime: string,
}

function Competition({comeptitionRemainingTime, competitionLogo, competitionName, membersAmount}: Props) {
  return (
     <Link href={'/competition/'} className='max-w-xs border-2 border-primary-color w-full rounded-lg flex flex-col gap-2 bg-white'>
      <Image className='w-full object-cover rounded-t-lg h-36' src={competitionLogo} alt={''} width={64} height={64} />
      <div className="flex flex-col gap-1 px-2 py-1">
            <p>{competitionName}</p>
            <p>{membersAmount} Members</p>
        <p>{comeptitionRemainingTime}</p>
  <BlueButton additionalClasses='self-end mt-2'>Show More</BlueButton>
      </div>
    </Link>
  )
}

export default Competition