import Link from 'next/link'
import { useParams } from 'next/navigation';
import React from 'react'
import { GiExitDoor } from 'react-icons/gi';
import { IoChatbubbles } from 'react-icons/io5';
import { MdEdit, MdSpaceDashboard } from 'react-icons/md';
type Props = {isSwiped?:boolean, children?:React.ReactNode, className?:string}

function Drawer({isSwiped, children, className}: Props) {

  return (
    <div className={`${className} sm:h-[calc(100vh-3rem)] justify-between sm:flex flex-col lg:hidden transition-all duration-400 lg:h-[calc(100vh-3.5rem)] z-30 absolute top-0 ${isSwiped ? 'left-0' : '-left-full'} max-w-64  w-full bg-dark-gray p-2`}>
    {children}
    </div>
  )
}

export default Drawer