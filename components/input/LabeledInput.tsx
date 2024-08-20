'use client';

import React from 'react';

type Props = {
  label?: string,
  name?: string,
  id?: string,
  additionalClasses?: string,
  inputType?: string,
  placeholder?:string,
  minNumber?: number,
  maxNumber?: number,
  containerStyle?:string,
  type: 'dark' | 'light' | 'blue' | 'transparent',
    setValue: (value:string)=>void
}

function LabeledInput({label, minNumber,containerStyle, maxNumber,placeholder, inputType, setValue, name, type, additionalClasses}: Props) {
  return (
    <div className={`flex gap-1 flex-col ${containerStyle}`}>
{label &&          <p className='text-white'>{label}</p>}
            <input min={minNumber} max={maxNumber} placeholder={placeholder} type={inputType ?? 'text'} name={name} onChange={(e)=>setValue(e.target.value)} className={`${additionalClasses} outline-none  rounded-lg  ${type === 'transparent' ? ' bg-transparent text-white' : type === 'dark' ? 'bg-dark-gray border-2 border-primary-color text-white' : type ==='blue' ? 'bg-primary-color text-white border-2 border-white' : 'bg-white text-dark-gray'}`}/>
          </div>
  )
}

export default LabeledInput