import React from 'react'

import {Swiper} from 'swiper/react';

import 'swiper';


type Props = {
    children: React.ReactNode
}

function BaseSwiper({children}: Props) {
  return (
    <Swiper className='mySwiper' spaceBetween={24} slidesPerView={3}>
        {children}
    </Swiper>
  )
}

export default BaseSwiper