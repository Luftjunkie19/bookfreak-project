import React from 'react';

type Props = {
    label: string,
    setValue: (value:string)=>void
}

function LabeledInput({label, setValue}: Props) {
  return (
<div className="flex gap-1 flex-col">
          <p className='text-white'>{label}</p>
            <input onChange={(e)=>setValue(e.target.value)} className='text-secondary-color outline-none p-2 rounded-lg border-2 border-primary-color'/>
          </div>
  )
}

export default LabeledInput