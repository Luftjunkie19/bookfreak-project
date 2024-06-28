import React from 'react'

type Props = {}

function WhatIsSection({}: Props) {
  return (
      <div className='flex flex-col gap-2 max-w-5xl w-full'>
          <p className='text-3xl font-semibold'>What is <span className='text-primary-color'>B</span>ook<span className='text-primary-color'>F</span>reak ?</p>
          <p>BookFreak is nothing else as innovative 
    platform, which connects love to books with today’s digitalized standards. It is an platform for every reader to know amazing people with the same interests as you.  With BookFreak you will never loose the courage to read regularly, because of our notifications, we will send if we notice, you haven’t read any page a certain day yet. In our app, you are able to see your progress by means of charts we have implemented. You have no idea what book to read ? No worries !
    Our AIssistant is ready to help you in your need.</p>
    </div>
  )
}

export default WhatIsSection