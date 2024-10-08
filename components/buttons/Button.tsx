import React from 'react'

type Props = {
  children: React.ReactNode, id?:string, additionalClasses?: string, onClick?:(() => void | Promise<void> )| ((e)=> void | Promise<void>), isSubmit?: boolean, disableState?:boolean, type: 'blue' | 'white' | 'black' | 'white-blue' | 'dark-blue' | 'transparent' }

function Button({children,id, type, disableState, additionalClasses, onClick, isSubmit, ...props}: Props) {
    return (
        <button {...props} id={id} disabled={disableState} onClick={onClick} type={isSubmit ? 'submit' : 'button'} className={`${type === 'blue' ? 'bg-primary-color text-white' : type === 'white' ? 'text-dark-gray bg-white' : type === 'black' ? ' bg-dark-gray text-white' : type === 'dark-blue' ? 'bg-dark-gray text-primary-color' : type==='white-blue' ? 'bg-white text-primary-color' : 'bg-transparent'} p-2 rounded-lg ${additionalClasses}`}>
          {children}
    </button>
  )
}

export default Button