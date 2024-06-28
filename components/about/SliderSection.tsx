import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Image from 'next/image'
import React from 'react'
import February from '../../assets/ProjectHistory/February2.png'
import February2 from '../../assets/ProjectHistory/Februrary.png'
import SecondImage from '../../assets/ProjectHistory/March.png'
import ThirdImage from '../../assets/ProjectHistory/September2.png'

type Props = {}

function SliderSection({}: Props) {
    return (
        <div className="flex flex-col gap-2">
    <p className='text-2xl font-semibold text-white'>How BookFreak changed throughout the months ?</p>
            
            <div className="self-center">
<Carousel>
  <CarouselContent>
              <CarouselItem>
                  <Image width={60} height={50} alt='' src={February} className='w-full max-h-80 h-full max-w-lg'/>
              </CarouselItem>
                <CarouselItem>
                  <Image width={60} height={50} alt='' src={February2} className='w-full max-h-80 h-full max-w-lg'/>
    </CarouselItem>
              <CarouselItem>
                                    <Image width={60} height={50} alt='' src={SecondImage} className='max-h-80 h-full w-full max-w-lg'/>
    </CarouselItem>
              <CarouselItem>
                   <Image width={60} height={50} alt='' src={ThirdImage} className='w-full max-h-80 h-full max-w-lg'/>
    </CarouselItem>
  </CarouselContent>

</Carousel>
            </div>
      </div>
  )
}

export default SliderSection