import React from 'react';

type Props = { children: React.ReactNode, additionalClasses?: string, onClick?: () => void, isSubmit?: boolean }

function RemoveBtn({ children, onClick, additionalClasses, isSubmit }: Props) {
  return (
    <button type={isSubmit ? 'submit' : 'button'} className={`text-white bg-red-500 p-2 rounded-lg ${additionalClasses}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default RemoveBtn