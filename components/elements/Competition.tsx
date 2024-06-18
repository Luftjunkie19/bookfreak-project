import BlueDarkGradientButton from 'components/buttons/gradient/BlueDarkGradientButton'
import Image from 'next/image'
import React from 'react'

type Props = {
    competitionLogo: string,
    competitionName: string,
    membersAmount: number,
    comeptitionRemainingTime: string,
}

function Competition({comeptitionRemainingTime, competitionLogo, competitionName, membersAmount}: Props) {
  return (
     <div className='max-w-60 w-full flex flex-col gap-2'>
      <Image className='w-full h-36' src={competitionLogo} alt={''} width={64} height={64} />
      <div className="flex flex-col gap-1 px-2 py-1">
            <p>{competitionName}</p>
            <p>{membersAmount}</p>
        <p>{comeptitionRemainingTime}</p>
  <BlueDarkGradientButton additionalClasses='self-end'>Show</BlueDarkGradientButton>
      </div>
    </div>
  )
}

export default Competition