import { Accordion, AccordionItem } from '@nextui-org/react'
import React from 'react'
import classes from '../../stylings/gradient.module.css'
type Props = {}

function AccordionSection({}: Props) {
  return (
      <div className='flex flex-col gap-4'>
          <p className='text-3xl font-semibold text-white'>FAQ About BookFreak Features</p>

          <Accordion className='max-w-5xl self-center w-full' itemClasses={{
              'base': `${classes['button-blue-dark-gradient']} text-white p-1`,
              title:"text-white px-2"
             
    }}>
              <AccordionItem key="1" aria-label="Accordion 1" title="How To Earn Money In BookFreak ?">
                  Accordion 1
      </AccordionItem>
      <AccordionItem key="2" aria-label="Accordion 2" title="Why Can I Join Only One Club And Not Many?">
         Accordion 2
      </AccordionItem>
      <AccordionItem key="3" aria-label="Accordion 3" title="Why is the User Interface Looking SO Weird ?">
 Accordion 3
      </AccordionItem>
    </Accordion>

    </div>
  )
}

export default AccordionSection