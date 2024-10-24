import Button from 'components/buttons/Button'
import LabeledInput from 'components/input/LabeledInput'
import Comment from 'components/post-components/Comment'
import Image from 'next/image'
import React from 'react'
import { FaComment, FaHeart, FaPaperPlane } from 'react-icons/fa6'

type Props = { comments: any[]}

function PostRightBar({comments}: Props) {
  return (
      <div className='sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] max-w-md flex flex-col justify-between w-full text-white bg-dark-gray'>
          <div className="flex flex-col p-2 w-full gap-2">
              <p className='text-lg'>Comments</p>
              <div className="flex w-full flex-col gap-3">
                  {comments && comments.map((item) => (
                      
                      <Comment imageUrl={item.owner.photoURL} likesNumber={3} commentContent={item.comment} commentNumber={3} username={item.owner.nickname} />
                  ))}

              </div>
          </div>

          <div className="bg-secondary-color border-t-primary-color border-x-primary-color border-t border-x-1 rounded-t-lg justify-between gap-2 w-full p-2 text-white flex items-center">
              <LabeledInput placeholder='Enter a message...' type='transparent' additionalClasses='text-sm' />

              <Button type='transparent'><FaPaperPlane className='text-primary-color text-2xl'/></Button>
          </div>
    </div>
  )
}

export default PostRightBar