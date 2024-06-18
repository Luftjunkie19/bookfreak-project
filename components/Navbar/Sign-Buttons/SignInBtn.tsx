import React from 'react';

import Link from 'next/link';

type Props = {}

function SignInBtn({}: Props) {
  return (
    <Link href={'/login'} className='text-white'>
        Sign In 
    </Link>
  )
}

export default SignInBtn