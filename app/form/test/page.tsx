'use client'; 
import '../../../stylings/primereact-custom/dataview.css'

import React, { useState } from 'react';

import {
  FaPlus,
  FaQuestionCircle,
  FaTrashAlt,
} from 'react-icons/fa';
import {
  FaPencil,
  FaTrashCan,
} from 'react-icons/fa6';
import { PiExamFill } from 'react-icons/pi';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router';
import uniqid from 'uniqid';




import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/BookPageTranslations.json';
import formTranslations from '../../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import LabeledInput from 'components/input/LabeledInput';
import { MdNoteAdd, MdQuestionAnswer } from 'react-icons/md';
import Question from 'components/elements/question/Question';
import { DataView } from 'primereact/dataview';
import { Pagination, useDisclosure } from '@nextui-org/react';
import Button from 'components/buttons/Button';
import AdBanner from 'components/advertisements/AdBanner';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { useFieldArray, useForm } from 'react-hook-form';
import TestQuestion from 'components/question/TestQuestion';
import { Checkbox } from '@/components/ui/checkbox';
import ModalComponent from 'components/modal/ModalComponent';
import { isUndefined } from 'util';
import toast from 'react-hot-toast';

const alphabet = require('alphabet');

interface Test {
  name:string,
  description: string,
  questions:Question[],
  bookReferenceId?: string,
   answers:Answer[]
}

export interface Question {
  id:string,
  questionContent: string,
  correctAnswer: string | string[],
  answers:Answer[]
}

export interface Answer {
  answerContent: string,
  isCorrect: boolean,
  id:string,
}

function CreateTests() {
  const { user } = useAuthContext();
  const navigate = useRouter();
const dispatch=useDispatch();
  const { register, setValue, control, getValues, handleSubmit, setError, reset } = useForm<Test>();
  const {register:registerQuestion,setValue:setQuestionValue, control:questionControl, getValues:questionGetValues, handleSubmit:handleQuestionSubmit, setError:setQuestionError, reset:resetQuestion}=useForm<Question>();
  const { fields, insert, append, prepend, update, swap, remove, replace } = useFieldArray({
    name: 'answers', control: questionControl, rules: {
      required: 'The answers are needed for robust work of the app.',
      minLength: 2,
      
     
  } });
  const { fields: queries, insert: insertQuery, append: appendQuery, prepend: prependQuery, update: updateQuery, swap: swapQuery, remove: removeQuery, replace: replaceQuery } = useFieldArray({
    name: 'questions', control, rules: {
      required:true,
      minLength: 2,
      validate: ()=> {
        return queries.filter((item) => item.answers.filter((val) => val.isCorrect)).length >= 2
      }
      
      
     
  }});
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
   const { isOpen:isAnswerModalOpen, onOpen:onAnswerModalOpen, onOpenChange:onAnswerModalOpenChange, onClose:onAnswerModalClose} = useDisclosure();
  const [modalQuestion, setModalQuestion] = useState<Question>();


const answerModal=(item:Question)=>{
      return(<ModalComponent modalSize='sm' isOpen={isAnswerModalOpen} modalTitle='Q&A' modalBodyContent={<div className="w-full h-fit flex flex-col gap-3">
        <p className="text-white text-xl font-bold">{item.questionContent}</p>
        {item.answers.map((item, index) => (<p key={item.id} className={`${item.isCorrect ? 'text-green-400 font-semibold' : 'text-white'}`}>{alphabet[index].toUpperCase()}. {item.answerContent}</p>))}
      </div>} onClose={()=>{
          setModalQuestion(null);
          onAnswerModalClose();
      }} onOpenChange={()=>{
        onAnswerModalOpenChange();
      }}/>)
     }

  return (
    <div className={`min-h-screen h-full flex`}>
      <form onSubmit={handleSubmit(async (data) => {
        const testId = crypto.randomUUID();
        
        console.log(data.answers.filter((item) => item.answerContent !== undefined), fields, queries);
        console.log(data.questions.map((item) => ({ correctAnswer: item.correctAnswer, id: item.id, testId, questionContent: item.questionContent }))); 
        try {
        
          if (!user) {
            toast.error(`You're not logged in`);
            return;
          }

        const fetchTest = await fetch('/api/supabase/test/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              id:testId,
            name: data.name,
            createdAt: new Date(),
            description: data.description,
            creatorId: user.id
           }
          })
        });
          
          const fullFetchedTest = await fetchTest.json();

          const fetchQuestions = await fetch('/api/supabase/test/questions/createMany', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: data.questions.map((item) => ({ correctAnswer: item.correctAnswer, id: item.id, testId, questionContent: item.questionContent })) })
          });
          
          
          const fullFetchedQuestions = await fetchQuestions.json();


          const answers = await fetch('/api/supabase/test/answers/createMany', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: data.questions.
                map((item) => ({ answers: item.answers, id: item.id })).map((obj) => (
                  obj.answers.map((item) => ({ ...item, questionId: obj.id }))
                )).flat(2)
            })
          });

          const fullFetchedAnswers = await answers.json();

          console.log(fullFetchedTest, fullFetchedAnswers, fullFetchedQuestions);

      } catch (error) {
          console.log(error);
      }
        
        


      }, (err) => {
        console.log(queries.filter((item) => item.answers.filter((val) => val.isCorrect)).length);
        console.log(err, fields, queries);
      })} className='xl:bg-dark-gray flex flex-col gap-2 p-2 xl:h-screen max-w-xs w-full'>
        <p className='text-xl font-semibold text-white'>Test Creator</p>
        <LabeledInput {...register('name', {
          required:'You have to name the competition anyhow.',
          onChange: (event) => {
            setValue('name', event.target.value);
          }
                })}  additionalClasses='p-2' label='Test Name' type={'dark'}  />
        <LabeledInput {...registerQuestion('questionContent', {
          required:'You have to enter the content in order to write a question',
          onChange: (e) => {
            setQuestionValue('questionContent', e.target.value);
          }
        })} additionalClasses='p-2' label='Question' type={'dark'}  />
        
        <div className="flex flex-col gap-2">
          <p className='text-lg text-white'>Possible Answers</p>
          <div className={`flex flex-col overflow-y-auto gap-2 ${questionGetValues('answers') && questionGetValues('answers').length > 0 && 'h-52'}`}>
            {fields.length > 0 && fields.map((field, index) => (
              <div className='flex gap-4 w-full items-center'>
                <LabeledInput key={field.id}  {...register(`answers.${index}.answerContent`, {
                onChange(event) {
                    setQuestionValue(`answers.${index}.answerContent`, event.target.value);
                    if (!getValues('answers').find((ans)=>ans.id === field.id)) {
                      setValue('answers', [...getValues('answers'), { ...field, answerContent: event.target.value }]);
                    }
                  },
                
              })}  additionalClasses='p-2 w-full self-end' label={`Answer ${alphabet[index].toUpperCase()}`} type={'dark'} />
              <Checkbox checked={questionGetValues(`answers.${index}.isCorrect`)} onClick={() => {
                  if (fields.find((item) => item.isCorrect === true)) {
                    console.log('Mafie, Służby i loże.');
                    const currentlyCorrectAnswerIndex = fields.findIndex((el) => el.isCorrect);
                    const currentCorrect = fields[currentlyCorrectAnswerIndex];
                  setQuestionValue(`answers.${currentlyCorrectAnswerIndex}.isCorrect`, false);
                    setQuestionValue(`answers.${index}.isCorrect`, true);

                       update(currentlyCorrectAnswerIndex, { ...currentCorrect, isCorrect:false});
                    update(index, { ...field, isCorrect:true});

                  } else {
                         console.log('Condominium Rosyjsko-niemieckie pod żydowskim zarządem powierniczym !');
                    setQuestionValue(`answers.${index}.isCorrect`, true);
                                update(index, { ...field, isCorrect:true});
                 }
              }}  className='data-[state=checked]:bg-primary-color border-primary-color self-end' id={field.id} />
              </div>
    ))}
          </div>
        </div>

        <div className="">
              <p className='text-white text-base'>Description</p>
       <textarea  {...register('description', {
         required:`You have to type the description, otherwise it won't be able to insert the test.`,
          onChange(event) {
            setValue('description', event.target.value)
          },
      })} className=" font-light p-2 max-w-3xl text-sm w-full h-36 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
    </div>

        <div className="flex gap-4 items-center">
          <Button onClick={() => {
            append({ answerContent: '', isCorrect: false, id:crypto.randomUUID() });
            }} type={'white-blue'}>New Answer</Button>
          <Button onClick={handleQuestionSubmit((data) => { 
            console.log(data);
            append([...data.answers]);
            appendQuery({...data, correctAnswer:data.answers.filter((item)=>item.isCorrect).map((item)=>item.id), id:crypto.randomUUID()})
            resetQuestion();
            setQuestionValue('questionContent', '');
            replace([]);
            }, (err) => { 
              console.log(err)
            })} type={'blue'}>New Question</Button>
        </div>

                <Button isSubmit type={'blue'}>Create Test</Button>

      </form>
      
      <div className="w-full flex flex-col gap-2 p-4">
        <div className="text-white">
        <p className='text-3xl font-semibold'>Test , Correct and gain your knowledge </p>
        <p className='text-sm font-light'>No Test about recent book you have read ? Don’t hesitate and create the Test !</p>
      <AdBanner/>
          
       </div>
      
        <p className='text-white flex gap-2 items-center'><BsQuestionCircleFill className='text-primary-color text-2xl' /> {getValues('questions') ? getValues('questions').length > 0 : 0} Questions</p>
        <div className="flex flex-col gap-3 overflow-y-auto">

          {getValues('questions') && getValues('questions').length === 0 && <>
          <p className='text-white'>No questions yet</p>
          </>}

          {getValues('questions') && getValues('questions').length > 0 && getValues('questions').map((item, index) => (<TestQuestion onClick={() => {
            setModalQuestion(item);
            onAnswerModalOpen();
        }} answers={item.answers} questionContent={item.questionContent} index={index} />))}

          {modalQuestion && answerModal(modalQuestion)}

        </div>

      </div>

    </div>
  );
}

export default CreateTests;
