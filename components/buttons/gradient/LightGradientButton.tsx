import React from 'react';

import classes from '../../../stylings/gradient.module.css';

type Props = { children: React.ReactNode, additionalClasses?: string, onClick?: () => void, isSubmit?: boolean };

function LightGradientButton({ children, onClick, additionalClasses, isSubmit }: Props) {
  return (
    <button type={isSubmit ? 'submit' : 'button'} className={`text-white p-2 rounded-lg ${classes['light-blue-gradient']} ${additionalClasses}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default LightGradientButton