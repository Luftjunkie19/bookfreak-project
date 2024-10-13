'use client';
import React from 'react'
import SubscriptionPlan from './SubscriptionPlan'
import classes from '../../../stylings/gradient.module.css'
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper'
import { SwiperSlide } from 'swiper/react'

type Props = {}

function SubscriptionRow({}: Props) {
  return (
      <div className='flex self-center flex-col gap-2 items-center w-full justify-center max-w-7xl p-2'>
          <p className={`text-5xl text-white text-center font-bold ${classes['header-gradient']} ${classes['light-blue-gradient']}`}>Subscribtion <span className={`${classes['header-gradient']} ${classes['light-blue-gradient']}`}>Plan</span></p>
          <p className='font-light text-white text-center max-w-3xl w-full'>Browse through the subscribtion plans we offer to you, choose the most appealing to you and explore the world of BookFreak, by means of AI and other special features we offer !</p>


        <BaseSwiper slidesOnSmallScreen={1} slidesOnLargeScreen2={'auto'} slidesOnLargeScreen={'auto'} slidesOnXlScreen={2} slidesOn2XlScreen={3} additionalClasses='w-full max-w-6xl'>
          <SwiperSlide className='sm:mx-auto sm:flex xl:block justify-center items-center xl:mx-0'>
              <SubscriptionPlan subscriptionPeriod='week' bgType='blue' isMonth={false} price={9.99} offerName={'WeekyFreaky Plan'} />
          </SwiperSlide>
          
          <SwiperSlide className='sm:mx-auto sm:flex xl:block justify-center items-center xl:mx-0'>
              <SubscriptionPlan subscriptionPeriod='month' bgType='dark' isMonth={false} price={19.99} offerName={'FOTM Plan'} />
          </SwiperSlide>
          <SwiperSlide className='sm:mx-auto sm:flex xl:block justify-center items-center xl:mx-0'>
                        <SubscriptionPlan subscriptionPeriod='year' bgType='white' isMonth={false} price={199.99} offerName={'FOTY Plan'}/>
              </SwiperSlide>
          
        </BaseSwiper>
        

    </div>
  )
}

export default SubscriptionRow