import { Pagination } from '@nextui-org/react'
import React from 'react'

type Props = {}

function Page({}: Props) {
  return (
    <div>


<Pagination classNames={{
  'wrapper':' self-center mx-auto w-full p-2',
  'cursor':"bg-primary-color",
}} total={10}   showControls loop color='primary' initialPage={1}  />
    </div>
  )
}

export default Page