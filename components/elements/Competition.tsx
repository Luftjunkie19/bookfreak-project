import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Button from 'components/buttons/Button'
type Props = {
    competitionLogo: string,
    competitionName: string,
    membersAmount: number,
  comeptitionRemainingTime: string,
  competitionId: string,
    type: 'transparent' | 'blue' | 'black' | 'dark' | 'white'
}

function Competition({comeptitionRemainingTime, competitionLogo, competitionName, membersAmount, competitionId, type}: Props) {
  return (
    <Link href={`/competition/${competitionId}`} className={`max-w-60 w-full rounded-lg flex flex-col gap-1 ${type === 'transparent' ? 'bg-transparent text-white' : type === 'blue' ? 'bg-primary-color text-white' : type === 'dark' ? 'bg-dark-gray text-white' : type === 'black' ? 'bg-transparent text-dark-gray' : 'bg-white text-dark-gray'}`}>
      <Image src={competitionLogo} alt='' className='w-full max-h-52 h-full rounded-t-lg object-cover' />
      <div className="flex flex-col gap-1 p-2">
        <p className='text-lg font-bold line-clamp-1'>{competitionName}</p>
        <p>{membersAmount} Members</p>
        <p>Expires in <span className='text-red-400 font-semibold'>{comeptitionRemainingTime}</span></p>
        <Button type={`${type === 'transparent' ? 'blue' : type === 'blue' ? 'white-blue' : type === 'dark' ? 'blue' : type === 'black' ? 'white-blue' : 'dark-blue'}`}>Request</Button>
      </div>
    </Link>
  )
}

export default Competition