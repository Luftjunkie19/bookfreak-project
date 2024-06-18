import React from 'react';

import Link from 'next/link';

type Props = {}

function SignUpBtn({}: Props) {
  return (
    <Link href={'/signup'} className='text-white '>
        Sign Up
    </Link>
  )
}

export default SignUpBtn