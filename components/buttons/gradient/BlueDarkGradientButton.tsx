import React from 'react';

import classes from '../../../stylings/gradient.module.css';

type Props = { children: React.ReactNode, additionalClasses?: string, onClick?: () => void, isSubmit?: boolean };

function BlueDarkGradientButton({ children, onClick, additionalClasses, isSubmit }: Props) {
  return (
    <button type={isSubmit ? 'submit' : 'button'} className={`text-white ${additionalClasses} p-2 rounded-lg ${classes['dark-blue-gradiented']}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default BlueDarkGradientButton