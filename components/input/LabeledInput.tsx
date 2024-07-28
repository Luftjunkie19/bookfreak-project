import React from 'react';

type Props = {
  label?: string,
  name?: string,
  id?: string,
  additionalClasses?: string,
  type: 'dark' | 'light' | 'blue' | 'transparent',
    setValue: (value:string)=>void
}

function LabeledInput({label, setValue, name, type, additionalClasses}: Props) {
  return (
<div className="flex gap-1 flex-col">
{label &&          <p className='text-white'>{label}</p>}
            <input type={type ?? 'text'} name={name} onChange={(e)=>setValue(e.target.value)} className={`${additionalClasses} outline-none p-2 rounded-lg  ${type === 'transparent' ? ' bg-transparent text-white' : type === 'dark' ? 'bg-dark-gray border-2 border-primary-color text-white' : type ==='blue' ? 'bg-primary-color text-white border-2 border-white' : 'bg-white text-dark-gray'}`}/>
          </div>
  )
}

export default LabeledInput