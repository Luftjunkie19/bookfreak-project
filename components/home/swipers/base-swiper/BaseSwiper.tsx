// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/bundle';
import 'swiper/css/effect-cards';

import React from 'react';

import { Pagination } from 'swiper/modules';
import { Swiper } from 'swiper/react';

type Props = {
    children: React.ReactNode
}

function BaseSwiper({children}: Props) {
  return (
    <Swiper modules={[Pagination]} className='px-2' spaceBetween={8} breakpoints={{
      0: {
        slidesPerView:1,
      },
      640: {
        slidesPerView:2
      },
        768: {
        slidesPerView:3
      },
         1024: {
        slidesPerView:5
      },
          1440: {
        slidesPerView:8
      },
    }}>
        {children}
    </Swiper>
  )
}

export default BaseSwiper