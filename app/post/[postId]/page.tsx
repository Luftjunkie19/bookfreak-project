import React from 'react'

type Props = {}

function Page({ params }: { params: { postId: string } }) {
    const { postId } = params;


  return (
      <div>
          <p>{postId}</p>
    </div>
  )
}

export default Page