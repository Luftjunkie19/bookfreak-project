import React from 'react'

import {SwiperSlide, useSwiperSlide} from 'swiper/react';


type Props = {
    children: React.ReactNode
}

function Slide({children}: Props) {
    const swiperSlide= useSwiperSlide();
    
  return (
    <SwiperSlide>
        {children}
    </SwiperSlide>
  )
}

export default Slide