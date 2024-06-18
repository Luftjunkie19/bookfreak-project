import React from 'react';

type Props = { children: React.ReactNode, additionalClasses?: string, onClick?: () => void, isSubmit?: boolean }

function BlueButton({ children, onClick, additionalClasses, isSubmit }: Props) {
  return (
    <button type={isSubmit ? 'submit' : 'button'} className={`text-white bg-primary-color p-2 rounded-lg ${additionalClasses}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default BlueButton