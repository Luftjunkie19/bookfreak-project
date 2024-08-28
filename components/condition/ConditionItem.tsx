import LabeledInput from 'components/input/LabeledInput';
import React from 'react'

type Props = {conditionName:string, additionalClasses?:string, conditionValue:string | number, inputType: 'text' | 'number'}

function ConditionItem({conditionName, conditionValue, inputType, additionalClasses}: Props) {
  return (
    <div className={`flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full ${additionalClasses}`}>
    <p className='flex-1'>{conditionName}</p>
    <LabeledInput value={conditionValue} inputType={inputType} additionalClasses='max-w-20 w-full p-2' type='transparent' setValue={(value) => {
        console.log(value);
    }}/>
</div>
  )
}

export default ConditionItem