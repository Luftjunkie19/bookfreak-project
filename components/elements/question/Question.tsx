import { Tooltip } from '@nextui-org/react'
import React from 'react'
import { FaPencil, FaTrash } from 'react-icons/fa6'

type Props = {}

function Question({}: Props) {
  return (
      <div className='w-full text-dark-gray rounded-xl p-2 border border-primary-color bg-white flex flex-col gap-2'>
          <div className="self-end flex gap-2 items-center">
              <Tooltip placement='top-start' classNames={{
                  content:"bg-primary-color text-white"
              }} content='Edit'>    
              <button><FaPencil className='text-primary-color' size={20}/> </button>
              </Tooltip>
              <Tooltip placement='top-start' classNames={{
                  content:"bg-red-400 text-white"
              }} content='Remove'>  
                <button> <FaTrash className='text-red-400' size={20}/> </button>
              </Tooltip>
          </div>

          <p className='text-lg font-semibold'>What is your Favourite blah blah blah ?</p>

          <div className="flex flex-col gap-1">      
          <p>Answers</p>
          <div className="flex flex-col gap-2 max-h-24 w-full overflow-y-auto">
                  <div className="p-2 rounded-lg bg-dark-gray border border-primary-color">
                      <p className='text-sm text-white'>A Option 1</p> 
                  </div>
                  <div className="p-2 rounded-lg bg-dark-gray border border-primary-color">
                      <p className='text-sm text-white'>A Option 1</p> 
                  </div>
                  <div className="p-2 rounded-lg bg-dark-gray border border-primary-color">
                      <p className='text-sm text-white'>A Option 1</p> 
                  </div>
                  <div className="p-2 rounded-lg bg-dark-gray border border-primary-color">
                      <p className='text-sm text-white'>A Option 1</p> 
                  </div>
                    <div className="p-2 rounded-lg bg-dark-gray border border-primary-color">
                      <p className='text-sm text-white'>A Option 1</p> 
                  </div>
                  
          </div>
          </div>
          
    </div>
  )
}

export default Question