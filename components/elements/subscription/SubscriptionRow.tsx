import React from 'react'
import SubscriptionPlan from './SubscriptionPlan'
import classes from '../../../stylings/gradient.module.css'

type Props = {}

function SubscriptionRow({}: Props) {
  return (
      <div className='flex self-center flex-col gap-2 items-center w-full justify-center max-w-7xl p-4'>
          <p className={`text-5xl text-white font-bold ${classes['header-gradient']} ${classes['light-blue-gradient']}`}>Subscribtion <span className={`${classes['header-gradient']} ${classes['light-blue-gradient']}`}>Plan</span></p>
          <p className='font-light text-white text-center max-w-3xl w-full'>Browse through the subscribtion plans we offer to you, choose the most appealing to you and explore the world of BookFreak, by means of AI and other special features we offer !</p>

          <div className="w-full flex max-w-6xl justify-between gap-4  items-center">
              <SubscriptionPlan subscriptionPeriod='week' bgType='blue' isMonth={false} price={5.99} offerName={'WeekyFreaky Plan'} />
              <SubscriptionPlan subscriptionPeriod='month' bgType='dark' isMonth={false} price={14.99} offerName={'FOTM Plan'} />
                        <SubscriptionPlan subscriptionPeriod='year' bgType='white' isMonth={false} price={149.99} offerName={'FOTY Plan'}/>
</div>
    </div>
  )
}

export default SubscriptionRow