// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/bundle';
import React from 'react'

import {Swiper} from 'swiper/react';




type Props = {
    children: React.ReactNode
}

function BaseSwiper({children}: Props) {
  return (
    <Swiper className='px-2' spaceBetween={8} slidesPerView={6}>
        {children}
    </Swiper>
  )
}

export default BaseSwiper