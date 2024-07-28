import { CardBody, CardContainer, CardItem } from 'components/ui/Card3DEffect'
import React from 'react'
import classes from '../../../stylings/gradient.module.css'
import { MdWorkspacePremium } from 'react-icons/md'
import { RiRobot3Fill } from 'react-icons/ri'
import { SparklesCore } from 'components/ui/Sparkles'
import { Meteors } from 'components/ui/Meteors'

type Props = {gradientName:string, isMonth:boolean, price:number, stripePriceId?:string, offerName:string}

function SubscriptionPlan({ gradientName, isMonth, offerName, price}: Props) {
    return (
        <CardContainer containerClassName='max-w-xs' className={`${classes[gradientName]} border-2 border-white w-full rounded-lg`}>
            <CardBody className='flex flex-col justify-between gap-4'>
  <Meteors />
                <CardItem className='w-full p-1'>
                  <div className="flex p-2 justify-between items-center relative top-0 left-0 before:absolute before:w-4/5 before:h-[2px] before:bottom-0 before:left-0 before:rounded-lg before:ml-1 before:mt-2 before:bg-white  ">
                    
                    <p className='text-white text-2xl'>{offerName}</p>
                    <MdWorkspacePremium size={24} className='text-white' />
                </div>
                
                <div className="flex flex-col gap-2 p-1">
                    <p className='text-xl font-semibold text-white'>Benefits</p>
                    <div className='px-1 text-white flex flex-col gap-2'>
                        <p>No Advertisements</p>
                        <p className='flex gap-1 items-center justify-between max-w-[75%] w-fdivl'>Access To Our AIssistant <RiRobot3Fill /></p>
                        <p>Book Summarizer</p>
                        <p>Ability To Generate Covers</p>
                        <p>Possibility To Add 3D Book Cover</p>
                        {isMonth &&  <p>1 Week Free Trial-Period</p>}
                       
                    </div>
                </div>
                </CardItem>
                    <div className="flex items-center justify-between p-4">
                        <p className='text-white'> <span className=' text-green-600 font-semibold'> {price} $</span> / Week</p>

                       

                    </div>
              </CardBody>
          </CardContainer>
  )
}

export default SubscriptionPlan