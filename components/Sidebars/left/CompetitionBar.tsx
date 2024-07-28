import Link from 'next/link'
import React from 'react'
import { FaVideo } from 'react-icons/fa6'
import { GiExitDoor } from 'react-icons/gi'
import { MdEdit, MdSpaceDashboard } from 'react-icons/md'
import { TbListDetails } from 'react-icons/tb'

type Props = {competitionId:string}

function CompetitionBar({competitionId}: Props) {
  return (
    <div className='max-h-screen flex flex-col gap-6 bg-dark-gray p-4 border-r border-primary-color rounded-se-lg text-white'>
          <Link className='flex items-center gap-2' href={`/competitions/${competitionId}/dashboard`}>
          <MdSpaceDashboard size={24} /> 
          </Link>
          <Link className='flex items-center gap-2' href={`/competitions/${competitionId}/details`}>
          <TbListDetails size={24} /> 
          </Link>
          <button className='flex items-center gap-2'>
              <FaVideo size={24} /> 
          </button>
          <button className='flex text-blue-300  items-center gap-2'>
              <MdEdit size={24} /> 
          </button>
          <button className='flex items-center text-red-400 gap-2'>
              <GiExitDoor  size={24} /> 
          </button>
    </div>
  )
}

export default CompetitionBar