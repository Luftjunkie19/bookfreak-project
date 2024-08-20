'use client';
import React, {
  useRef,
  useState,
} from 'react';

import emptyImg from '../../../assets/emptyBox.png'

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
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



import { storage } from '../../firebase';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import { snackbarActions } from '../../../context/SnackBarContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { User } from 'firebase/auth';
import LabeledInput from 'components/input/LabeledInput';
import { Avatar, Checkbox, Chip, DatePicker, Select, SelectItem, Switch, tv, useCheckbox, useDisclosure } from '@nextui-org/react';
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

function CreateClub() {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();
  const [attachedUsers, setAttachedUsers] = useState([]);
  const [editCover, setEditCover] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [radius, setRadius] = useState(0);
  const editorRef = useRef<AvatarEditor>(null);
  const [readersClub, setReadersClub] = useState({
    clubsName: "",
    clubLogo: null,
    description: "",
    requiredPagesRead: 0,
  });
  const navigate = useRouter();
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const { user } = useAuthContext();
  const { documents } = useGetDocuments("users");
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const { documents: members } = useGetDocuments('communityMembers');
  const allMembers = members.map((club) => {
    return club.users;
  }).map((object) => {
    return Object.values(object);
  }).flat();

let notCurrentUsers = documents
    .filter((doc) => {
      return (
        doc.id !== (user as User).uid &&
        !attachedUsers.some((member:any) => member.value.id === doc.id)
      );
    })
    .map((user) => {
      return {
        label: user.nickname,
        value: {
          nickname: user.nickname,
          id: user.id,
          photoURL: user.photoURL,
        },
      };
    });

  const { addToDataBase } = useRealDatabase();
  const submitForm = (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    if (
      allMembers.find(
        (member:any) =>
          member.value.id === (user as User).uid &&
          member.belongsTo.includes("readersClub")
      )
    ) {
      dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.loyality[selectedLanguage]}` }));

      return;
    }


    if (!readersClub.clubLogo || readersClub.description.trim().length === 0 || readersClub.clubsName.trim().length === 0 || readersClub.requiredPagesRead === 0) {
      dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.someFieldsEmpty[selectedLanguage]}` }));

      return;
    }

    const uniqueId = uniqid("readersClub");

    addToDataBase("readersClubs", uniqueId, {
      clubsName: readersClub.clubsName,
      clubLogo: readersClub.clubLogo,
      description: readersClub.description,
      requiredPagesRead: readersClub.requiredPagesRead,
      createdBy: {
        displayName: (user as User).displayName,
        email: (user as User).email,
        photoURL: (user as User).photoURL,
        createdAt: new Date().getTime(),
        id: (user as User).uid,
      },
      id: uniqueId,
    });

    addToDataBase("communityChats", uniqueId, {
      messages: {},
      chatId: uniqueId,
    });

    addToDataBase("communityMembers", uniqueId, {
      users: {
        [(user as User).uid]: {
          label: (user as User).displayName,
          belongsTo: uniqueId,
          value: {
            nickname: (user as User).displayName,
            id: (user as User).uid,
            photoURL: (user as User).photoURL,
          },
        },
      },
    });

    attachedUsers.map((member:any) =>
      addToDataBase("notifications", member.value.id, {
        notificationContent: `You've been invited by ${(user as User).displayName} to ${readersClub.clubsName} club.`,
        directedTo: member.value.id,
        linkTo: `/readers-club/${uniqueId}`,
        notificationId: uniqueId,
        isRead: false,
        notificationTime: new Date().getTime(),
        addedTo: readersClub.clubsName,
      })
    );
    setIsPending(false);
    dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.successfull.create[selectedLanguage]}` }));
    setError(null);
    navigate.push("/");
  };

  const handleSelect = (e) => {
    setError(null);
    setEditCover(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected?.size > 200000) {
      setError(alertMessages.notifications.wrong.tooBigFile[selectedLanguage]);
      setEditCover(null);
      return;
    }

    if (!selected?.type.includes("image")) {
      setError(
        alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]
      );
      setEditCover(null);
      return;
    }

    if (selected === null) {
      setError(
        alertMessages.notifications.wrong.selectAnything[selectedLanguage]
      );
      setEditCover(null);
      return;
    }

    if (selected?.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditCover(fileReader.result as string);
      };
      setError(null);
      return;
    }
  };

  const handleSaveCover = async () => {
    if (editorRef.current) {
      const editorImg = editorRef.current
        .getImageScaledToCanvas()
        .toDataURL("image/jpg");
  
      const byteCharacters = atob(editorImg.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
  
      const storageRef = ref(
        storage,
        `readersClub-logos/${(user as User).uid}/${readersClub.clubsName ? readersClub.clubsName : `readersClub${uniqid()}`
        }.jpg`
      );
      await uploadBytes(storageRef, byteArray);
      const url = await getDownloadURL(storageRef);
      console.log(url);
  
      setReadersClub((club:any) => {
        club.clubLogo = url;
        return club;
      });
  
      setEditCover(null);
      
    }
  };

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  
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
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    defaultSelected: true,
  })


  return (
   <div className={` h-full w-full p-4`}>
      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <p className='text-2xl text-white font-bold'>Read, Absorb, Evolve !</p>
        <p className='text-white'>Are you an author, a book company or someone who wants to compete with other people ? Create the competition now and Read !</p>
     </div>
      
      
      <div className="flex py-4 gap-12">

        <div className="w-56 cursor-pointer h-56 rounded-lg bg-white justify-center items-center flex">
          <input  type="file" name="" className="hidden" id="" />
          <div className="flex w-full flex-col items-center gap-2">
<HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-dark-gray'>Upload Competition&apos;s Logo</p>
          </div>
        </div>

            <LabeledInput containerStyle='max-w-xs w-full self-end' additionalClasses="max-w-xs w-full p-2" label="Club name" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
               
          

  
  </div>
      <Select
        className='max-w-sm w-full'
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
      label={<p className='text-white'>Invite Friends</p>}
      selectionMode="multiple"
      placeholder="Select a user"
      labelPlacement='outside'
            classNames={{
              'innerWrapper': 'bg-dark-gray text-white focus:bg-dark-gray active:bg-dark-gray hover:bg-dark-gray',
              'trigger':'bg-dark-gray text-white focus:bg-dark-gray active:bg-dark-gray hover:bg-dark-gray border-2 border-primary-color',
              'popoverContent':'bg-dark-gray border-2 border-primary-color text-white'
      }}
      renderValue={(items) => {
        return (
          <div className="flex items-center overflow-auto w-fit gap-2">
            {items.map((item) => (
              <Chip key={item.key} classNames={{'content':'flex items-center gap-2'}}>
                <Image src={item.data!.avatar} alt='' width={40} height={40} className='w-6 h-6 rounded-full' />
                <p>{item.data!.name}</p>
              </Chip>
            ))}
          </div>
        );
      }}
    >
      {(user) => (
        <SelectItem key={user.id} textValue={user.name}>
          <div className="flex gap-2 items-center">
            <Avatar alt={user.name} className="flex-shrink-0" size="sm" src={user.avatar} />
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
            <Checkbox color='default' />
            <p className='text-white text-sm'>Yes, I want to have special requirements.</p>
        </div>
</div>             
          
          
        <div className="flex flex-col gap-2">
            <p className='text-white'>Is your club free to join?</p>
          <div className="flex gap-2 items-center">
          <Checkbox color='default' />
               <p className='text-white text-sm'>Yes, my club is free to join</p>
          </div>
        </div>
          


      </div>

      <div className="flex max-w-6xl w-full gap-2 flex-col pb-2">
        <p className='text-xl text-white font-semibold'>Club Requirements</p>
          <ModalComponent modalSize='xl' modalFooterContent={<div className='flex gap-3 items-center'>
            <Button type='blue' additionalClasses="w-fit  px-4 py-2">
        Append
      </Button>
 </div>} modalTitle='Additional Conditions' modalBodyContent={    <div className='flex flex-col gap-3'>
                                    
          <SingleDropDown label='Type of Rule' selectedArray={[]}>
     <SelectItem key={'rule1'}>Min. Read Pages of Genre</SelectItem>
         <SelectItem key={'rule1'}>Min. Read Books of Genre</SelectItem>
     <SelectItem key={'rule2'}>Min. Read Books Amount</SelectItem>
     <SelectItem key={'rule2'}>Min. Read Pages Amount</SelectItem>
          <SelectItem key={'rule2'}>Peculiar Question</SelectItem>
   </SingleDropDown>

     <LabeledInput additionalClasses="max-w-sm w-full p-2" label="Pages" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />
   
  <LabeledInput additionalClasses="max-w-sm w-full p-2" label="Question" type={"dark"} setValue={(value) => {
              console.log(value);
            }} />


           <SingleDropDown label='Answer Accessment' selectedArray={[]}>
     <SelectItem key={'rule1'}>Manual</SelectItem>
         <SelectItem key={'rule1'}>Expected Answers</SelectItem>
   </SingleDropDown>
   
     <textarea placeholder='Enter answers...' className="w-full text-white bg-secondary-color p-2 h-52 overflow-y-auto  resize-none outline-none rounded-md border-2 border-primary-color"  />

                        
                      </div> } isOpen={isOpen} onOpenChange={onOpenChange} />

        <div className="max-w-2xl p-1 min-h-96 max-h-96 h-full w-full flex flex-col gap-6  items-center justify-center bg-dark-gray rounded-lg border-primary-color border-2">
          <p className='text-3xl text-white font-semibold text-center opacity-75'>No Requirements yet !</p>
          <Image src={emptyImg} className='w-48 h-48' alt="" width={60} height={60} />
          <p className='text-center text-sm font-light opacity-40 text-white'>You haven&lsquo;t set any requirements yet. If you want to set requirements, click the dropdown above.</p>
        </div>
        
        <Button additionalClasses='w-fit px-4 py-2 flex gap-2 items-center' onClick={onOpen} type='blue'>New Requirement <IoIosAddCircle /></Button>

      </div>
      

         <label className="flex flex-col gap-3">
          <span className="text-xl text-white font-semibold">Description</span>
      <textarea className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
      </label>

      <Button type='blue' additionalClasses="w-fit px-8 py-2 text-lg my-4">
        Insert
      </Button>

    </div>
  );
}

export default CreateClub;
