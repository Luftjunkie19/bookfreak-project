// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/bundle';
import React from 'react'

import {SwiperSlide, useSwiperSlide} from 'swiper/react';


type Props = {
    children: React.ReactNode
}

function Slide({children}: Props) {    
  return (
    <SwiperSlide>
        {children}
    </SwiperSlide>
  )
}

export default Slide