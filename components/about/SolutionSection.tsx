import Lottie from 'lottie-react'
import React from 'react'
import InteractiveRobot from '../../assets/lottieAnimations/Robot-Interactive.json'
type Props = {}

function SolutionSection({}: Props) {
  return (
      <div className='flex justify-between mx-auto m-0 max-w-7xl w-full gap-6'>

  <Lottie className='max-w-xs w-full' animationData={InteractiveRobot} />
        
          <div className="flex flex-col gap-2 max-w-2xl self-center w-full">
              <p className='text-3xl font-bold'>What Issue does <span className='text-primary-color'>B</span>ook<span className='text-primary-color'>F</span>reak solve ?</p>
              <p>
        Discover a world of reading with our innovative app! Our mission is to inspire and empower readers globally, because we believe that reading fosters independence and critical thinking in today&apros;s information-rich world.

Our app offers a comprehensive suite of tools to track your reading progress, including advanced metrics to help you stay motivated and achieve your reading goals. Plus, with the power of AI, we provide personalized book recommendations and support for all your reading needs. Dive into a better reading experience with us!
              </p>
       </div>

    </div>
  )
}

export default SolutionSection