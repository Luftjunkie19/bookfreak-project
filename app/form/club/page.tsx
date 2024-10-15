'use client';
import React, {
  useMemo,
  useRef,
  useState,
} from 'react';

import emptyImg from '../../../assets/emptyBox.png'
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll"
import AvatarEditor from 'react-avatar-editor';
import { BsStars } from 'react-icons/bs';
import { CgDetailsMore } from 'react-icons/cg';
import {
  FaImage,
  FaWindowClose,
} from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router';
import uniqid from 'uniqid';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import { snackbarActions } from '../../../context/SnackBarContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import LabeledInput from 'components/input/LabeledInput';
import { Avatar, Checkbox, Chip, Select, SelectItem, SharedSelection, tv, useCheckbox, useDisclosure } from '@nextui-org/react';
import { bookCategories } from 'assets/CreateVariables';
import ReactFlagsSelect from 'react-flags-select/build/components/ReactFlagsSelect';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { InputSwitch } from 'primereact/inputswitch';
import Button from 'components/buttons/Button';
import { HiOutlineUpload } from 'react-icons/hi';
import SingleDropDown from 'components/drowdown/SingleDropDown';
import MultipleDropDown from 'components/drowdown/MultipleDropDown';
import ModalComponent from 'components/modal/ModalComponent';
import { IoIosAddCircle } from 'react-icons/io';
import { Requirement, requirementOptions } from '../competition/page';
import { useFieldArray, useForm } from 'react-hook-form';
import RequirementSelect from 'react-tailwindcss-select'
import { Option, SelectValue } from 'react-tailwindcss-select/dist/components/type';
import toast from 'react-hot-toast';
import useStorage from 'hooks/storage/useStorage';

interface Club{
  hasRequirements: boolean,
  clubName: string,
  clubLogo:File,
  description: string,
  isFreeToJoin:boolean,
  requirements:Requirement[]
}


function CreateClub() {
  const { register, reset, getValues, setError, clearErrors, setValue, handleSubmit} = useForm<Club>();
    const { register:registerRequirement, reset:resetRequirement, getValues:getRequirementValues, setError:setRequirementError, clearErrors:clearRequirementErrors, setValue:setRequirementValue, handleSubmit:handleRequirementSubmit} = useForm<Requirement>();
  const [selectedBookType, setselectedBookType] = useState<SelectValue>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useRouter();
    const selectedLanguage = useSelector(
      (state:any) => state.languageSelection.selectedLangugage
    );
    const { user } = useAuthContext();
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  const [previewImage, setPreviewImage] = useState<string>();
    const [selectedType, setSelectedType] = useState<SelectValue>(null);
  const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(new Set([]));
    const [modalRequirementContent, setModalRequirementContent]=useState<Requirement>(null);
     const { isOpen:isAnswerModalOpen, onOpen:onAnswerModalOpen, onOpenChange:onAnswerModalOpenChange, onClose:onAnswerModalClose} = useDisclosure();
  const {uploadImage, uploadImageUrl, getImageUrl}=useStorage();
     const answerModal=(item:Requirement)=>{
      return(<ModalComponent modalSize='sm' isOpen={isAnswerModalOpen} modalTitle='Q&A' modalBodyContent={<div>
        <p className="text-white">{item.requirementQuestion}</p>
        <p className='text-base text-white'>{item!.requirementQuestionPossibleAnswers.join(', ')}</p>
      </div>} onClose={()=>{
          setModalRequirementContent(null);
          onAnswerModalClose();
      }} onOpenChange={()=>{
        onAnswerModalOpenChange();
      }}/>)
     }
    


  // const allMembers = members.map((club) => {
  //   return club.users;
  // }).map((object) => {
  //   return Object.values(object);
  // }).flat();

// let notCurrentUsers = documents
//     .filter((doc) => {
//       return (
//         doc.id !== (user as User).uid &&
//         !attachedUsers.some((member:any) => member.value.id === doc.id)
//       );
//     })
//     .map((user) => {
//       return {
//         label: user.nickname,
//         value: {
//           nickname: user.nickname,
//           id: user.id,
//           photoURL: user.photoURL,
//         },
//       };
//     });


  const submitForm = async (value:Club) => {
      clearErrors();

      const chatId=crypto.randomUUID();
      const clubId = crypto.randomUUID();


      const fetchChat = await fetch('/api/supabase/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data:{ id: chatId, dateOfCreation: new Date() }})
      });

            const { data: chat } = await fetchChat.json();

      const { data: imageData, error: imageError } = await uploadImage(value.clubLogo, 'clubLogo', `${clubId}/${crypto.randomUUID()}`);

      if (!imageData) {
        return;
}

      const { image, error } = await getImageUrl('clubLogo', imageData.fullPath);

      if(!image){
        return;
      }


      
      console.log(chat);

     const fetchClub= await fetch('/api/supabase/club/create', {
       method: 'POST',
       headers:{
        'Content-Type':'application/json',
       },
       body:JSON.stringify({data:{id:clubId, chatId:chat.id, clubName:value.clubName, creationDate:new Date(), hasRequirements:value.hasRequirements, description:value.description, isFreeToJoin:value.isFreeToJoin, clubLogo:image}})
     });


      const { data: club } = await fetchClub.json();


      console.log(club);
      
      const fetchRequirements= await fetch('/api/supabase/requirement/createMany', {
        method:"POST",
          body:JSON.stringify({data:requirements.map((item)=>({...item, clubId}))}),
          headers:{
            'Content-Type':'application/json',
          },
      });



      const fetchMember = await fetch('/api/supabase/member/create', {
       method: 'POST',
       headers:{
        'Content-Type':'application/json',
       },
       body:JSON.stringify({data:{id:crypto.randomUUID(), userId:user!.id, clubId:club.id }})
      });
      
      toast.success('Success !');
      clearErrors();
      reset();

   }

  const handleSelect = (e) => {

    let selected = e.target.files[0];

    setValue('clubLogo', selected);  

    if (selected?.size > 200000) {
      return;
    }

    if (!selected?.type.includes("image")) {
      // setError(
      //   alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]
      // );
     
      return;
    }

    if (selected === null) {
      // setError(
      //   alertMessages.notifications.wrong.selectAnything[selectedLanguage]
      // );

      return;
    }

    if (selected?.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setPreviewImage(fileReader.result as string);
      };
      return;
    }
  };


  const { isOpen, onOpenChange, onOpen , onClose} = useDisclosure();

  
  const checkbox = tv({
  slots: {
    base: "border-default hover:bg-default-200",
    content: "text-default-500"
  },
  variants: {
    isSelected: {
      true: {
        base: "border-primary bg-primary hover:bg-primary-500 hover:border-primary-500",
        content: "text-primary-foreground pl-1"
      }
    },
    isFocusVisible: {
      true: { 
        base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
      }
    }
  }
  })
  
    const {
    children,
    isSelected,
      isFocusVisible,
      isFocused,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    defaultSelected: true,
  })

    const [, scrollerRef] = useInfiniteScroll({
    hasMore: true,
    isEnabled: isFocusVisible,
    shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
  
  });

  return (
    <form onSubmit={handleSubmit(submitForm, (error)=>{})} className={`sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto w-full p-4`}>
      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <p className='text-2xl text-white font-bold'>Read, Absorb, Evolve !</p>
        <p className='text-white'>Are you an author, a book company or someone who wants to compete with other people ? Create the competition now and Read !</p>
     </div>
      
      
      <div className="flex py-4 gap-12">

        <div onClick={() => {
          if(fileInputRef.current){
            fileInputRef.current.click();
          }
        }} className="w-56 cursor-pointer group h-56 rounded-lg bg-white justify-center items-center flex">
          <input ref={fileInputRef} onChange={handleSelect}  type="file" name="" className="hidden" id="" />
          {previewImage ? <div className='w-full h-full rounded-lg relative top-0 left-0 overflow-hidden'>
            <div className="absolute z-10  flex w-full h-full flex-col items-center justify-center gap-2 top-full left-0 bg-dark-gray/40 duration-400 transition-all group-hover:top-0">
            <HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-white'>Upload Different One</p>
            </div>
            <Image src={previewImage} alt='' width={60} height={60} className='w-full h-full object-cover rounded-lg'/>
        </div> :  <div className="flex w-full flex-col items-center gap-2">
<HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-dark-gray'>Upload Club&apos;s Logo</p>
          </div>}
        </div>

        <LabeledInput {...register('clubName', {
          required:'You have to put your club a name',
              onChange(event) {
            setValue('clubName', event.target.value);
              },
            })} containerStyle='max-w-xs w-full self-end' additionalClasses="max-w-xs w-full p-2" label="Club name" type={"dark"}  />
              
  
  </div>
      <Select
        selectedKeys={selectedKeys}
        onChange={(e) => {
          setSelectedKeys(new Set(e.target.value.split(",")));

        }
      }
        className='max-w-xs w-full'
      items={[
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Tech Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Sr. Dev",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "C.M.",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "S. Manager",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
    email: "kristen.cooper@example.com",
  },
  {
    id: 6,
    name: "Brian Kim",
    role: "P. Manager",
    team: "Management",
    age: "29",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png",
    email: "brian.kim@example.com",
    status: "active",
  },
  {
    id: 7,
    name: "Michael Hunt",
    role: "Designer",
    team: "Design",
    status: "paused",
    age: "27",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png",
    email: "michael.hunt@example.com",
  },
  {
    id: 8,
    name: "Samantha Brooks",
    role: "HR Manager",
    team: "HR",
    status: "active",
    age: "31",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
    email: "samantha.brooks@example.com",
  },
  {
    id: 9,
    name: "Frank Harrison",
    role: "F. Manager",
    team: "Finance",
    status: "vacation",
    age: "33",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
    email: "frank.harrison@example.com",
  },
  {
    id: 10,
    name: "Emma Adams",
    role: "Ops Manager",
    team: "Operations",
    status: "active",
    age: "35",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png",
    email: "emma.adams@example.com",
  },
  {
    id: 11,
    name: "Brandon Stevens",
    role: "Jr. Dev",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png",
    email: "brandon.stevens@example.com",
  },
  {
    id: 12,
    name: "Megan Richards",
    role: "P. Manager",
    team: "Product",
    status: "paused",
    age: "28",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png",
    email: "megan.richards@example.com",
  },
  {
    id: 13,
    name: "Oliver Scott",
    role: "S. Manager",
    team: "Security",
    status: "active",
    age: "37",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/8.png",
    email: "oliver.scott@example.com",
  },
  {
    id: 14,
    name: "Grace Allen",
    role: "M. Specialist",
    team: "Marketing",
    status: "active",
    age: "30",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/8.png",
    email: "grace.allen@example.com",
  },
  {
    id: 15,
    name: "Noah Carter",
    role: "IT Specialist",
    team: "I. Technology",
    status: "paused",
    age: "31",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png",
    email: "noah.carter@example.com",
  },
  {
    id: 16,
    name: "Ava Perez",
    role: "Manager",
    team: "Sales",
    status: "active",
    age: "29",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/9.png",
    email: "ava.perez@example.com",
  },
  {
    id: 17,
    name: "Liam Johnson",
    role: "Data Analyst",
    team: "Analysis",
    status: "active",
    age: "28",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/11.png",
    email: "liam.johnson@example.com",
  },
  {
    id: 18,
    name: "Sophia Taylor",
    role: "QA Analyst",
    team: "Testing",
    status: "active",
    age: "27",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/11.png",
    email: "sophia.taylor@example.com",
  },
  {
    id: 19,
    name: "Lucas Harris",
    role: "Administrator",
    team: "Information Technology",
    status: "paused",
    age: "32",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/12.png",
    email: "lucas.harris@example.com",
  },
  {
    id: 20,
    name: "Mia Robinson",
    role: "Coordinator",
    team: "Operations",
    status: "active",
    age: "26",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/12.png",
    email: "mia.robinson@example.com",
  },
]}
      label={<p className='text-white text-base'>Invite Friends</p>}
      selectionMode="multiple"
        placeholder="Select a user"
        labelPlacement='outside'
        scrollRef={scrollerRef}
        data-hover={false}
        aria-checked={'false'}
        classNames={{
      
              'innerWrapper': 'bg-dark-gray text-white py-2',
              'trigger':'bg-dark-gray text-white border-2 border-primary-color py-2',
          'popoverContent': 'bg-dark-gray border-2 border-primary-color text-white',
              'value':'bg-dark-gray',
      }}
      renderValue={(items) => {
        return (
          <div className="flex items-center overflow-x-auto w-fit gap-2">
            {items.map((item) => (
              <Chip key={item.key} classNames={{'content':'flex items-center gap-2 w-fit','base':'bg-primary-color text-white w-fit'}}>
                <Image src={item.data!.avatar} alt='' width={40} height={40} className='w-6 h-6 rounded-full' />
                <p className=' line-clamp-1 text-pretty'>{item.data!.name}</p>
              </Chip>
            ))}
          </div>
        );
      }}
    >
      {(user) => (
          <SelectItem  aria-checked={'false'}
       data-hover={false} data-focus={false} className='hover:bg-primary-color rounded-lg duration-400 transition-all' classNames={{
            'wrapper': 'hover:bg-primary-color rounded-lg duration-400 transition-all',
          'base': 'hover:bg-primary-color rounded-lg duration-400 transition-all',
            
        }} key={user.id} textValue={user.name}>
          <div className="flex gap-2 items-center">
            <Avatar alt={user.name} className="px-1" size="sm" src={user.avatar} />
            <div className="flex flex-col">
              <span className="text-small">{user.name}</span>
              <span className="text-tiny text-default-400">{user.email}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>

      
      <div className="flex items-center gap-6 py-3">
        <div className="flex flex-col gap-2">
          <p className='text-white'>Do you want to have special requirements to join ?</p>
             <div className="flex gap-2 items-center">
            <Checkbox {...register('hasRequirements', {
              onChange(event) {
                setValue('hasRequirements', event.target.value);
              }
            })} color='default' />
            <p className='text-white text-sm'>Yes, I want to have special requirements.</p>
        </div>
</div>             
          
          
        <div className="flex flex-col gap-2">
            <p className='text-white'>Is your club free to join?</p>
          <div className="flex gap-2 items-center">
          <Checkbox data-checked={false} aria-checked={'false'} classNames={{'base':'checked:bg-primary-color checked:text-white'}} {...register('isFreeToJoin', {
              onChange(event) {
                setValue('isFreeToJoin', event.target.value);
              }
            })} color='primary' />
               <p className='text-white text-sm'>Yes, my club is free to join</p>
          </div>
        </div>
          


      </div>

      <div className="flex max-w-6xl w-full gap-2 flex-col pb-2">
        <p className='text-xl text-white font-semibold'>Club Requirements</p>
          <ModalComponent modalSize='xl' modalFooterContent={<div className='flex gap-3 items-center'>
          <Button onClick={handleRequirementSubmit((data) => {
            setRequirements([...requirements, { ...data, id: crypto.randomUUID() }]);
            resetRequirement();
            onClose();
            
            },(err)=>{})} type='blue' additionalClasses="w-fit  px-4 py-2">
        Append
      </Button>
 </div>} modalTitle='Additional Conditions' modalBodyContent={<div className='flex min-h-80 max-h-96 h-full flex-col gap-3'>

   <div className="flex flex-col gap-1">
     <p className='text-white'>Requirement Type</p>
   <RequirementSelect isSearchable isClearable
     classNames={{
       menuButton: () => 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color line-clamp-1  ',
       
         list: "overflow-y-scroll",
       
     }}
     onChange={(values)=>{
      console.log((values as Option).value);
      setSelectedType(values);
     setRequirementValue('requirementType', (values as any).value);
   }} 
   value={selectedType} primaryColor={''} options={requirementOptions}/>
    </div>
   
{getRequirementValues('requirementType') && (getRequirementValues('requirementType') === "rule1" || getRequirementValues('requirementType') === 'rule2') &&  <div className='h-fit flex flex-col gap-1'>
  <p className='text-white'>Book Genre</p>
  <RequirementSelect {...registerRequirement('requiredBookType')} classNames={{
       menuButton: ()=> 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-wrap text-white line-clamp-1 border-primary-color',
     }} value={selectedBookType} onChange={(values) => {
       setselectedBookType(values);
       setRequirementValue('requiredBookType', (values as any).value);
   }} primaryColor='blue' options={bookCategories}/>
</div>}


   {getRequirementValues('requirementType') && (getRequirementValues('requirementType') === "rule1" || getRequirementValues('requirementType') === "rule4") &&
   <LabeledInput {...registerRequirement("requiredPagesRead", {
     onChange(event) {
       setRequirementValue("requiredPagesRead", +(event.target.value as string));
     },
     })} additionalClasses="max-w-sm w-full p-2" label="Pages Amount" type={"dark"} />
   }


   
   {getRequirementValues('requirementType') && (getRequirementValues('requirementType') === "rule2" || getRequirementValues('requirementType') === "rule3") &&
   <LabeledInput {...registerRequirement("requiredBookRead", {
     onChange(event) {
       setRequirementValue('requiredBookRead', +(event.target.value as string));
     },
     })} additionalClasses="max-w-sm w-full p-2" label="Books Amount" type={"dark"} />
}
   


   {getRequirementValues('requirementType') && getRequirementValues('requirementType') === 'rule5' && <>
   
    <LabeledInput {...registerRequirement('requirementQuestion', {
       onChange(event) {
         setRequirementValue('requirementQuestion', event.target.value);
       },
    })} additionalClasses="max-w-sm w-full p-2" label="Question" type={"dark"} />
     

<textarea onBlur={(e) => {
setRequirementValue('requirementQuestionPossibleAnswers', e.target.value.split(', '));
}} placeholder='Enter answers...' className="w-full text-white bg-secondary-color p-2 h-52 overflow-y-auto  resize-none outline-none rounded-md border-2 border-primary-color"  />
   </>
  }
  
  </div> } isOpen={isOpen} onOpenChange={onOpenChange} />

        <div className={`max-w-2xl p-2 min-h-96 max-h-96 h-full w-full flex flex-col  ${requirements.length > 0 ? 'gap-2' : 'items-center justify-center gap-6'} bg-dark-gray rounded-lg border-primary-color border-2`}>
          {requirements.length === 0 ? <>
            <p className='text-3xl text-white font-semibold text-center opacity-75'>No Requirements yet !</p>
          <Image src={emptyImg} className='w-48 h-48' alt="" width={60} height={60} />
          <p className='text-center text-sm font-light opacity-40 text-white'>You haven&lsquo;t set any requirements yet. If you want to set requirements, click the dropdown above.</p>
          </> : <>
              {requirements.map((item) => (<div key={item.id} className='bg-secondary-color flex justify-between items-center p-2 rounded-lg cursor-pointer text-white text-pretty w-full'>
             <div className="flex flex-col gap-1">
                 <p className='text-base font-bold'>{requirementOptions.find((req)=>req.value===item.requirementType) && requirementOptions.find((req)=>req.value===item.requirementType)!.label}</p>
                  <p className='text-sm  font-light'>{item.requiredBookType} {item.requirementQuestion}</p>
                </div>
                
                {item.requiredPagesRead && <LabeledInput defaultValue={item.requiredPagesRead} inputType='number' min={1} additionalClasses="max-w-16 w-full p-2" type={'transparent'} />}
                {item.requiredBookRead && <LabeledInput defaultValue={item.requiredBookRead} inputType='number' min={1} additionalClasses="max-w-16 w-full p-2" type={'transparent'} />}
                {item.requirementQuestionPossibleAnswers && <Button onClick={() => {
                  onAnswerModalOpen();
  setModalRequirementContent(item);
               }} type='blue'>Show Answer</Button>} 
          </div>))}
          </>}
          
        </div>

            {modalRequirementContent && answerModal(modalRequirementContent)}
        
        <Button additionalClasses='w-fit px-4 py-2 flex gap-2 items-center' onClick={onOpen} type='blue'>New Requirement <IoIosAddCircle /></Button>

      </div>
      

         <label className="flex flex-col gap-3">
          <span className="text-xl text-white font-semibold">Description</span>
      <textarea {...register('description', {
        onChange:(e)=>{
          setValue('description', e.target.value);
        }
      })} className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
      </label>

      <Button isSubmit type='blue' additionalClasses="w-fit px-8 py-2 text-lg my-4">
        Insert
      </Button>

    </form>
  );
}

export default CreateClub;
