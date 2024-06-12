'use client';
import React from 'react';

import { Provider } from 'react-redux';

import stored from './Stored';

type Props = {children:React.ReactNode}

function ReduxProvider({children}: Props) {
  return (
      <Provider store={stored}>{children}</Provider>
  )
}

export default ReduxProvider