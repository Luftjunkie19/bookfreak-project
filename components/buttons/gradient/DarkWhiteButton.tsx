import React from 'react';

import classes from '../../../stylings/gradient.module.css';

type Props<T = any> = { buttonText: string, onClick: () => void | (() => Promise<T>) };

function DarkWhiteGradientButton<T = any>({ buttonText, onClick }: Props<T>) {
  return (
    <button className={`text-white p-2 rounded-lg ${classes['dark-white-gradient']}`} onClick={onClick}>
      {buttonText}
    </button>
  )
}

export default DarkWhiteGradientButton;