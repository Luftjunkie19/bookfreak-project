import { CardBody, CardContainer, CardItem } from 'components/ui/Card3DEffect'
import React from 'react'
import classes from '../../../stylings/gradient.module.css'
import { MdWorkspacePremium } from 'react-icons/md'
import { RiRobot3Fill } from 'react-icons/ri'
import { SparklesCore } from 'components/ui/Sparkles'
import { Meteors } from 'components/ui/Meteors'
import Button from 'components/buttons/Button'
import { BiSolidHappyHeartEyes } from 'react-icons/bi'
import { FaUpload } from 'react-icons/fa6'
import { BsStars } from 'react-icons/bs'
import { GiBrainFreeze } from 'react-icons/gi'

type Props = { bgType: 'blue' | 'white' | 'dark', subscriptionPeriod: 'week' | 'month' | 'year', isMonth:boolean, price:number, stripePriceId?:string, offerName:string}

function SubscriptionPlan({ bgType, isMonth, offerName, price, subscriptionPeriod}: Props) {
    return (
        <CardContainer containerClassName='max-w-xs' className={`w-full h-[32rem]  ${bgType === 'blue' ? 'bg-primary-color border-2 border-white': bgType === 'white' ? 'bg-white border-2 border-primary-color' : 'bg-dark-gray border-2 border-primary-color'} ${bgType=== 'white' ? 'text-dark-gray' : 'text-white'}  shadow-white  shadow-small  rounded-lg`}>
            <CardBody className={`flex flex-col h-full justify-between gap-6`}>
                <CardItem className='w-full flex flex-col gap-4 px-2 py-1'>
                    <p className='text-xl font-semibold'>{offerName}</p>

                    <p className={`text-sm text-center ${bgType === 'white' ? 'text-primary-color' : 'text-white'}`}><span className={`text-5xl font-bold ${bgType === 'white' || bgType === 'blue' ? 'text-dark-gray' : 'text-primary-color'} `}>{price}$</span>/{subscriptionPeriod}</p>
                    
                    <div className="flex flex-col gap-2 mt-2">
                        <p className='text-lg font-semibold'>What do you get ?</p>
                        <ul className='flex flex-col gap-2'>
                            <li className='flex items-center gap-2'><BsStars /> AI Features</li>
                            <li className='flex items-center gap-2'><BiSolidHappyHeartEyes /> No Advertisements</li>
                            <li className='flex items-center gap-2'><GiBrainFreeze /> AI Test Creator</li>
                            <li className='flex items-center gap-2'><FaUpload /> Upload 1GB File</li>
</ul>

                    </div>

                </CardItem>
                <Button additionalClasses='text-lg max-w-72 w-full self-center font-semibold m-3' type={`${bgType === 'blue' ? 'dark-blue' : bgType === 'white' ? 'blue' : 'white-blue'}`}>Get Started</Button>
              
              </CardBody>
          </CardContainer>
  )
}

export default SubscriptionPlan