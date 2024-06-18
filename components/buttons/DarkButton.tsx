import React from 'react';

type Props = { children: React.ReactNode, additionalClasses?: string, onClick?: () => void, isSubmit?: boolean };

function DarkButton({ children, onClick, isSubmit, additionalClasses }: Props) {
  return (
    <button type={isSubmit ? 'submit' : 'button'} className={`${additionalClasses} text-white bg-secondary-color p-2 rounded-lg`} onClick={onClick}>
      {children}
    </button>
  )
}

export default DarkButton