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
  children: React.ReactNode,
  slidesOnSmallScreen?: number,
  slidesOnLargeScreen?: number,
  slidesOnLargeScreen2?: number,
  slidesOnXlScreen?: number,
  slidesOn2XlScreen?: number,
  spaceBetween?:number,
    additionalClasses?:string,

}

function BaseSwiper({children,additionalClasses, spaceBetween, slidesOn2XlScreen, slidesOnLargeScreen2, slidesOnLargeScreen, slidesOnSmallScreen, slidesOnXlScreen}: Props) {
  return (
    <Swiper modules={[Pagination]} className={`p-2 ${additionalClasses}`} spaceBetween={spaceBetween || 8} breakpoints={{
      0: {
        slidesPerView: slidesOnSmallScreen ?? 1,
      },
      640: {
        slidesPerView: slidesOnLargeScreen ?? 2
      },
        768: {
        slidesPerView: slidesOnLargeScreen2 ?? 3
      },
         1024: {
        slidesPerView: slidesOnXlScreen ?? 5
      },
          1440: {
        slidesPerView: slidesOn2XlScreen ?? 8
      },
    }}>
        {children}
    </Swiper>
  )
}

export default BaseSwiper