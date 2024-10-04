'use client';
import { Suspense, useCallback, useRef, useState } from 'react';
import React from 'react'

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import uniqid from 'uniqid';

import Select from 'react-tailwindcss-select';

import { bookCategories } from 'assets/CreateVariables';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import { snackbarActions } from '../../../context/SnackBarContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import LabeledInput from 'components/input/LabeledInput';
import { Avatar, Chip, DatePicker, Dropdown, DropdownItem, DropdownSection, DropdownTrigger, Switch, Tooltip, useDisclosure } from '@nextui-org/react';
import { FaInfo } from 'react-icons/fa6';
import { InputSwitch } from 'primereact/inputswitch';
import Image from 'next/image';
import { HiOutlineUpload } from 'react-icons/hi';
import Button from 'components/buttons/Button';
import SingleDropDown from 'components/drowdown/SingleDropDown';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import ModalComponent from 'components/modal/ModalComponent';
import { MdEditDocument } from 'react-icons/md';
import { PiStackPlusFill } from 'react-icons/pi';
import { useForm } from 'react-hook-form';
import { Option, SelectValue } from 'react-tailwindcss-select/dist/components/type';
import { useQuery } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import toast from 'react-hot-toast';

interface Requirement{
  id:string,
  requirementType: 'rule1' | 'rule2' | 'rule3' | 'rule4' | 'rule5' | null,
  requiredBookType?: string,
  requiredBookRead?: number,
  requiredPagesRead?: number,
  requirementQuestion?: string,
  requirementQuestionPossibleAnswers?: string[],
}

type Competition = {
 competitionTitle: string,
  competitionsName: string,
    competitionLogo:File,
    expiresAt:  Date | null ,
    description: string,
    prizeType: 'money' | 'item' | null,
    chargeId: string | null ,
  prizeHandedIn: false,    
    prize: {
      moneyPrize?: {
        amount: number | null,
        currency: string | null,
      },
      itemPrize?: {
        title: string | null,
        typeOfPrize: SelectValue,
        bookReferenceId?: SelectValue,
        voucherFor?: string,
        voucherEventLink?:string
      },
  },
    requirements?:Requirement[]
}




function CreateCompetition() {
  const { user } = useAuthContext();
  const [expirationDate, setExpirationDate] = useState<Date>();
  const competitionLogoFileInputRef = useRef<HTMLInputElement>(null);
  const [requirementType, setRequirementType] = useState<SelectValue>(null);
  const [bookReference, setBookReference] = useState<SelectValue>(null);
  const [previewImage, setPreviewImage] = useState<string>();
  const [competitionName, setCompetitionName] = useState<SelectValue>(null);
  const [modalRequirementContent, setModalRequirementContent]=useState<Requirement>(null);
  const { register, reset, setFocus, setValue, setError, clearErrors, getValues, getFieldState, handleSubmit } = useForm<Competition>();
    const { register:registerRequirement, reset:resetRequirement, setFocus:setRequirementFocus, setValue:setRequirementValue, setError:setRequirementError, clearErrors:clearRequirementErrors, getValues:getRequirementValues, getFieldState:getRequirementFieldState, handleSubmit:handleRequirementSubmit } = useForm<Requirement>();
  const [bookGenreSelect, setBookGenreSelect] = useState<SelectValue>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const dispatch=useDispatch();

   const competitionTypes = [
    { value: "First read, first served", label: translations.competitionTypes.first[selectedLanguage] },
    {
      value: "Lift others, rise",
      label: translations.competitionTypes.second[selectedLanguage],
    },
    { value: "Teach to fish", label: translations.competitionTypes.third[selectedLanguage] },
  ];
  
  
   const allPrizes = [
    { value: "book", label: `${translations.book[selectedLanguage]} 📘` },
    {
      value: "voucher",
      label: "Voucher 🎟️",
    },
     { value: "ticket", label: `${translations.ticket[selectedLanguage]} 🎫` },
     {
      value: "money",
      label: `${translations.money[selectedLanguage]} 🤑`,
    },
  ];


  const requirementOptions=[
    { value: 'rule1', label: 'Min. Read Pages of Genre' },
    { value: 'rule2', label: 'Min. Read Books of Genre' },
    { value: 'rule3', label: 'Min. Read Books Amount' },
    { value: 'rule4', label: 'Min. Read Pages Amount' },
    { value: 'rule5', label: 'Peculiar Question' }
    ]

  const [chosenPrize, setChosenPrize]=useState<SelectValue>(null);

  const navigate = useRouter();

  const { data, error } = useQuery({
    queryKey: ["books"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch("/api/supabase/book/getAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          take: undefined,
          where: undefined,
          skip: undefined,
          include: undefined,
          select:undefined
        })
      });
      const fetchedRes = await response.json();

      return fetchedRes;
      },
  });


  const manageRequiredNumber = useCallback((e, item:Requirement, propertyName:string) => {
    const foundRequirement = requirements.find((el) => el.id === item.id);
    const foundRequirementIndex= requirements.findIndex((el) => el.id === item.id);
    if(foundRequirementIndex === -1){
      toast.error('Upsi !')
      return;
    }
  requirements[foundRequirementIndex][propertyName]= +e.target.value;
}, [requirements])


  const finalizeAll = () => {
    const uniqueId = uniqid();
    // addToDataBase("competitions", uniqueId, {
    //   competitionTitle: competition.competitionTitle,
    //   competitionsName: competition.competitionsName,
    //   expiresAt: new Date((competition.expiresAt as Date)).getTime(),
    //   description: competition.description,
    //   prizeHandedIn: false,
    //   chargeId: competition.chargeId,
    //   prize: competition.prize,
    //   createdBy: {
    //     displayName: (user as User).displayName,
    //     email: (user as User).email,
    //     photoURL: (user as User).photoURL,
    //     createdAt: new Date().getTime(),
    //     id: (user as User).uid,
    //   },
    //   id: uniqueId,
    // });

    // addToDataBase("communityChats", uniqueId, {
    //   messages: {},
    //   chatId: uniqueId,
    // });

    // addToDataBase("communityMembers", uniqueId, {
    //   users: {
    //     [(user as User).uid]: {
    //       label: (user as User).displayName,
    //       belongsTo: uniqueId,
    //       value: {
    //         nickname: (user as User).displayName,
    //         id: (user as User).uid,
    //         photoURL: (user as User).photoURL,
    //       },
    //     },
    //   },
    // });

    // attachedUsers.map((member:any) =>
    //   addToDataBase("notifications", `${uniqueId}-${new Date().getTime()}`, {
    //     notificationContent: `You've been invited by ${(user as User).displayName} to join the ${competition.competitionsName} competition.`,
    //     directedTo: member.value.id,
    //     linkTo: `/competition/${uniqueId}`,
    //     isRead: false,
    //     notificationId: uniqueId,
    //     notificationTime: new Date().getTime(),
    //     addedTo: competition.competitionsName,
    //   })
    // );

    navigate.push("/");
  };

const handleSelect = (e) => {
    clearErrors('competitionLogo');

    let selected = e.target.files[0];

    if (selected?.size > 200000) {
      return;
    }

    if (!selected.type.includes("image")) {
      //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]}`, alertType: "error" }));
      return;
    }

    if (selected === null) {
      //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.selectAnything[selectedLanguage]}`, alertType: "error" }));
      return;
    }

        setValue('competitionLogo', selected);  
      
    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setPreviewImage(fileReader.result as string);
      };
          clearErrors('competitionLogo');
      return;
    }
  };


  const submitForm = async (formData: Competition) => {
       clearErrors();
    const competitionId = uniqid();
    const competitionChatId = uniqid();
    console.log(formData)
    try {
      const fetchCompetitionObject = await fetch('/api/supabase/competition/create', {
        body: JSON.stringify({
          competitionName: formData['competitionTitle'],
          competitionType: formData['competitionsName'],
          startDate: new Date(),
          endDate: formData['expiresAt'],
          id: competitionId,
          chatId: competitionChatId,
          rules: requirements,
          competitionLogo: formData['competitionLogo']
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const fullResponse = await fetchCompetitionObject.json();

      console.log(fullResponse);

      toast.success('Yeah, you did it !');
      
      clearErrors();
      reset();
      setPreviewImage(null);

    } catch (err) {
      console.log(err);
    }
  };

     const { isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
     const { isOpen:isAnswerModalOpen, onOpen:onAnswerModalOpen, onOpenChange:onAnswerModalOpenChange, onClose:onAnswerModalClose} = useDisclosure();

     const answerModal=(item:Requirement)=>{
      return(<ModalComponent modalSize='sm' isOpen={isAnswerModalOpen} modalTitle='Q&A' modalBodyContent={<div>
        <p className="text-white">{item.requirementQuestion}</p>
        <p className='text-base text-white'>{item.requirementQuestionPossibleAnswers.join(', ')}</p>
      </div>} onClose={()=>{
          setModalRequirementContent(null);
          onAnswerModalClose();
      }} onOpenChange={()=>{
        onAnswerModalOpenChange();
      }}/>)
     }
  
  return (
    <form onSubmit={handleSubmit(submitForm, (errors) => {
      if (errors) {
        toast.error('ERROR !')
        console.log(errors)
      }
    })} className={`w-full sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden p-4`}>


      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <p className='text-2xl text-white font-bold'>Read, Absorb, Evolve !</p>
        <p className='text-white'>Are you an author, a book company or someone who wants to compete with other people ? Create the competition now and Read !</p>
     </div>

      <div className="flex py-4 gap-12">

        <div onClick={() => {
          competitionLogoFileInputRef!.current!.click();
        }} className="w-56 cursor-pointer h-56 rounded-lg bg-white justify-center items-center flex">
          <input onChange={handleSelect} ref={competitionLogoFileInputRef} type="file" name="" className="hidden" id="" />
          {previewImage ? <div className='relative group top-0 left-0 h-full w-full rounded-lg overflow-hidden'>
            <div className="absolute z-10 top-full left-0 w-full h-full bg-dark-gray/50 group-hover:top-0 duration-400 transition-all  flex justify-center items-center flex-col gap-2">
              <HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-center text-white'>Upload Different Logo</p>
            </div>
            <Image width={50} height={35} className='w-full h-full rounded-lg object-cover' src={previewImage} alt='' />
          </div> : 
          
          <div className="flex w-full flex-col items-center gap-2">
<HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-center text-dark-gray'>Upload Competition&apos;s Logo</p>
          </div>
          }
        </div>

        
<div className="grid max-w-2xl h-fit self-center w-full gap-4 grid-flow-dense xl:grid-cols-2">
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Competition Name" type={"dark"} />
          
          <div className="flex flex-col gap-1">
            <p className='text-white'>Competition Type</p>
            <Select classNames={{
              menuButton: (value) => 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color',
          }} primaryColor=''  value={competitionName} {...register('competitionsName')} onChange={(value) => {
            setCompetitionName((value as any));
            setValue('competitionsName', (value as any).value);
}} options={competitionTypes} />
          </div>

             <div className="flex flex-col gap-1">
              <p className="text-white text-base">Expiration Date</p>
            <Popover>
      <PopoverTrigger asChild>
        <div className="flex gap-2 cursor-pointer items-center text-white bg-dark-gray py-2 px-4 h-fit max-w-xs w-full rounded-lg border-2 border-primary-color"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {expirationDate ? format(expirationDate, "PPP") : <span>Pick a date</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
                <Calendar classNames={{
                  'day_selected': 'bg-primary-color text-white',
            
                  }}
                     {...register('expiresAt', {
                       valueAsDate: true,
                       validate: {
                         noValue: (value) => {
                           if (!value) {
                             return 'No appropriate Date has been passed !';
                           }
                         },
                         todaysDate: (value) => {
                           if (value && value.getTime() < new Date().getTime()) { 
                             return `You cannot select dates earlier than today's date.`
                           }
                         },
                       },
            })}
          mode="single"
          selected={expirationDate}
                  onSelect={(day, selectedDate) => {
                    if (selectedDate.getTime() < new Date().getTime()) {
                      toast.error(`You cannot select dates earlier than today's date.`);
                      return;
                      }
                      setExpirationDate(selectedDate);
                      setValue('expiresAt', selectedDate);
          }}
                
                  
        />
      </PopoverContent>
            </Popover>
</div>
                       
</div>
      


      </div>

      <div className="flex gap-2 flex-col pb-2">
        <p className='text-xl text-white font-semibold'>Detailed Prize</p>

        <div className="grid xl:grid-cols-2 2xl:grid-cols-3 items-center gap-2 max-w-6xl">
        <div className="flex flex-col gap-1">
          <p className='text-white'>Winner Prize</p>
          <Select  {...register('prize.itemPrize.typeOfPrize', {
          required:'Error !'
        })} isMultiple={false} onChange={(values) => {
            console.log(values);
            setChosenPrize(values);
            setValue('prize.itemPrize.typeOfPrize', values);
          }} classNames={{
            menuButton: (value) => 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color',
           tagItemText: '',
          tagItemIconContainer: '',
                
            }} value={chosenPrize} options={allPrizes}  primaryColor='blue' />
          </div>
          {chosenPrize && (chosenPrize as any).value === 'book' &&
            <>
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Book Title" type={"dark"} />
            {data && data.data && 
            <div className="flex flex-col gap-1">
              <p className='text-white'>BookFreak&#39;s DB Reference</p>
              <Select classNames={{
                menuButton: () =>'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2  text-white border-primary-color'
              }} {...register('prize.itemPrize.bookReferenceId')} options={data.data.map((item) => ({ label: item.title, value: item.id}))} onChange={(values) => {
                setBookReference(values);
                setValue('prize.itemPrize.bookReferenceId', values);
              }} value={bookReference} primaryColor=''/>

            </div>
     }
      
            </>
          }

          {chosenPrize && (chosenPrize as any).value === 'voucher' &&
            <>
          <LabeledInput additionalClasses="max-w-xs w-full p-2" label="What is the Voucher for" type={"dark"} />
          <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Link to the Voucher's Prize" type={"dark"}  />
            </>
          }

          {chosenPrize && (chosenPrize as any).value === 'ticket' && <>
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Ticket's Event Name" type={"dark"}  />
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Ticket's Event Type" type={"dark"} />
          </>}

                        

          {
            chosenPrize && (chosenPrize as any).value === 'money' &&  <LabeledInput additionalClasses="max-w-xs w-full p-2 outline-none" label='Money Prize' type={'dark'} min={0.5} step={0.5} max={10} inputType='number' />
          }
                       
          {chosenPrize && (chosenPrize as any).value !== 'money' &&
          <div className="flex gap-1 flex-col col-span-full">
             <span className="text-lg text-white font-semibold">Other Prize&#39;s Description</span>
      <textarea className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
          </div>
       }   

        </div> 
      </div>

      <div className="flex flex-col gap-2 pb-2">
        <div className="">
          <p className='text-xl text-white font-semibold'>Additional Conditions</p>
          <p className='text-xs text-gray-400'>You can add additional conditions users have to fullfill in order to join the competition.</p>
        </div>

        <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-52 max-w-2xl min-h-48  bg-dark-gray py-4 px-2 rounded-lg  h-full">
          {requirements.map((item)=>( <div onDoubleClick={()=>{
            setRequirements(requirements.filter((element)=>element.id !== item.id));
          }} key={item.id} className="flex cursor-pointer hover:bg-primary-color/40 transition-all duration-400 gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
            <div onClick={()=>{console.log(item)}} className='flex-1 flex flex-col gap-1 text-white'>
              <p>{requirementOptions.find((el)=>el.value === item.requirementType) && requirementOptions.find((el)=>el.value === item.requirementType)!.label}</p>
              <p className='text-xs'>{item.requiredBookType} {item.requirementQuestion}</p>
            </div>

{item.requirementQuestionPossibleAnswers && <>
<Button onClick={()=>{
  onAnswerModalOpen();
  setModalRequirementContent(item);
}} type='blue'>Answers</Button>
</>
}


{item.requiredBookRead &&  
<LabeledInput defaultValue={item.requiredBookRead} onChange={(e)=>{
                manageRequiredNumber(e, item, 'requiredBookRead');
              }} inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />}

            {item.requiredPagesRead && 
              <LabeledInput defaultValue={item.requiredPagesRead} onChange={(e)=>{
                manageRequiredNumber(e, item, 'requiredPagesRead');
              }} inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />
            }
                              </div>))}
                             
                             
</div> 

        <Button onClick={onOpen} additionalClasses='w-fit px-4 py-2 flex items-center gap-2' type='blue'>New Condition <PiStackPlusFill /></Button>
        <ModalComponent modalSize='xl' modalFooterContent={<div className='flex gap-3 items-center'>
            <Button onClick={handleRequirementSubmit((formData: Requirement) => {
          console.log(formData);

          setRequirements([...requirements, {
              id:uniqid('req'),
              requirementType: formData.requirementType,
              requiredBookRead: formData.requiredBookRead,
              requiredPagesRead: formData.requiredPagesRead,
              requiredBookType: formData.requiredBookType,
              requirementQuestionPossibleAnswers: formData.requirementQuestionPossibleAnswers,
              requirementQuestion: formData.requirementQuestion
            }])
            
            toast.success('Requirement Successfully inserted !');
            resetRequirement();
            setRequirementType(null);
            setBookGenreSelect(null);

            onClose()

         }, (err) => {
          console.log(err);
 })} type='blue' additionalClasses="w-fit  px-4 py-2">
        Append
      </Button>
        </div>} modalTitle='Additional Condition' modalBodyContent={<div  className='flex flex-col min-h-80 gap-3'>


   <Select {...registerRequirement('requirementType')}  placeholder='Requirement Type' classNames={{
          menuButton:()=>'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color'
        }} onChange={(value) => {
          setRequirementType(value);
          setRequirementValue('requirementType', (value as any).value);
   } } options={requirementOptions} value={requirementType} primaryColor={''} />
   

{requirementType && ((requirementType as Option).value === 'rule1' || (requirementType as Option).value === 'rule2') &&  <div className='h-fit flex flex-col gap-1'>
  <p className='text-white'>Book Genre</p>
  <Select {...registerRequirement('requiredBookType')} classNames={{
       menuButton(value) {
         return 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color'
       },
     }} value={bookGenreSelect} onChange={(values) => {
       setBookGenreSelect((values as Option));
       setRequirementValue('requiredBookType', (values as any).value);
   }} primaryColor='blue' options={bookCategories}/>
</div>}

   {requirementType && ((requirementType as Option).value === 'rule1' || (requirementType as Option).value === 'rule4') &&
   <>
   <LabeledInput {...registerRequirement('requiredPagesRead', {
    onChange:(event)=>{
      setRequirementValue('requiredPagesRead', +event.target.value);
    }
   })}  min={'0'}  inputType='number' additionalClasses="max-w-sm w-full p-2" label="Pages Number" type={"dark"} />
   </>
   }

   {requirementType && ((requirementType as Option).value === 'rule2' || (requirementType as Option).value === 'rule3') &&
            <LabeledInput  {...registerRequirement('requiredBookRead', {
              onChange: (e) => {
                 setRequirementValue('requiredBookRead', +e.target.value);
       }
     })} min={'0'} inputType='number' additionalClasses="max-w-sm w-full p-2" label="Books Number" type={"dark"} />
   }
   
   {requirementType && (requirementType as Option).value === 'rule5' && 
     <>     
     <LabeledInput  {...registerRequirement('requirementQuestion', {
      onChange(event) {
        setRequirementValue('requirementQuestion', event.target.value);
      },
     })} additionalClasses="max-w-sm w-full p-2" label="Question" type={"dark"} />
            <textarea {...registerRequirement('requirementQuestionPossibleAnswers', {
              onBlur: (e) => {
                setRequirementValue('requirementQuestionPossibleAnswers', e.target.value.split(', '))
              }
            })}  placeholder='Enter answers, separating the with commas (, )' className="w-full text-white bg-secondary-color p-2 h-52 overflow-y-auto  resize-none outline-none rounded-md border-2 border-primary-color"  />
     </>
   }                 
                      </div>} isOpen={isOpen} onOpenChange={onOpenChange} />

      </div>




         <label className="flex flex-col gap-3">
          <span className="text-xl text-white font-semibold">Description</span>
        <textarea {...register('description', {
         required:'Hello ?!',
          onChange(event) {
            setValue('description', event.target.value)
          },
      })} className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
      </label>

      {modalRequirementContent && answerModal(modalRequirementContent)}

      <Button isSubmit type='blue' additionalClasses="w-fit px-8 py-2 text-lg my-4">
        Insert
      </Button>

    </form>
  );
}

export default CreateCompetition;
