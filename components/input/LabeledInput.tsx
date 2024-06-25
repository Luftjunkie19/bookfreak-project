import React from 'react';

type Props = {
  label: string,
  name?: string,
  id?: string,
  type?: string,
  additionalClasses?:string,
    setValue: (value:string)=>void
}

function LabeledInput({label, setValue, name, type, additionalClasses}: Props) {
  return (
<div className="flex gap-1 flex-col">
          <p className='text-white'>{label}</p>
            <input type={type ?? 'text'} name={name} onChange={(e)=>setValue(e.target.value)} className={`${additionalClasses} text-secondary-color outline-none p-2 rounded-lg border-2 border-primary-color`}/>
          </div>
  )
}

export default LabeledInput