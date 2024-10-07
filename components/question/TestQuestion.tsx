
import { Answer } from 'app/form/test/page'
import Button from 'components/buttons/Button'
import React from 'react'
import { MdQuestionAnswer } from 'react-icons/md'

type Props = {
    questionContent: string,
    index: number,
  answers: Answer[],
    onClick?:()=>void
}

function TestQuestion({questionContent, index, answers, onClick}: Props) {
  return (
     <div key={index} className="max-w-3xl flex flex-col gap-2 w-full bg-dark-gray text-white p-2 rounded-lg">
          <p className='text-sm font-extralight'>Question {index + 1}</p>
          <p>{questionContent}</p>
            <div className="flex w-full justify-between p-1">
              <p>{answers.length} Answers</p>
                <Button onClick={onClick} type={'transparent'} additionalClasses='text-primary-color flex gap-2 items-center'>Show Answers <MdQuestionAnswer /></Button>
</div>
          </div>
  )
}

export default TestQuestion