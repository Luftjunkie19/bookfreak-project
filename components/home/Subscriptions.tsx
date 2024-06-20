import SubscriptionPlan from 'components/elements/subscription/SubscriptionPlan'
import { CardBody, CardContainer } from 'components/ui/Card3DEffect'
import { Meteors } from 'components/ui/Meteors'
import React from 'react'

type Props = {}

function Subscriptions({}: Props) {
    return (
      <>
            <div className="flex flex-col gap-2 p-2 text-white max-w-5xl w-full">
                <p className='text-4xl font-semibold'>Subscription Plans</p>
                <p className='text-lg '>Take your user experience to the next level with our premium subscription, designed to enhance your interactions and provide personalized recommendations. By subscribing, you&apos;ll gain access to powerful extra features, including our AIssistant. This intelligent tool can assist you with a variety of tasks, such as helping you choose your next book to read based on your preferences. Discover a more tailored and efficient way to explore content, making your journey enjoyable and seamless. Don&apos;t miss out on the opportunity to unlock the full potential of our platform.</p>
            </div>      
      <div className='max-w-screen-2xl w-full mx-auto m-0 sm:flex-col lg:flex-row overflow-x-auto  lg:justify-around flex gap-4 items-center'>
     
          <SubscriptionPlan gradientName='dark-blue-gradiented' isMonth={false} price={5.99} offerName={'Week Premium Plan '} />
          <SubscriptionPlan gradientName='light-blue-gradient' isMonth={true} price={14.99} offerName={'Month Premium Plan '} />
          <SubscriptionPlan gradientName='dark-white-gradient' isMonth={false} price={149.99} offerName={'Annual Premium Plan '} />
    </div>
      </>
  )
}

export default Subscriptions