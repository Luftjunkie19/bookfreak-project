'use client';
import React, {
  useRef,
  useState,
} from 'react';

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
import { Avatar, DatePicker, Select, SelectItem } from '@nextui-org/react';
import { bookCategories } from 'assets/CreateVariables';
import ReactFlagsSelect from 'react-flags-select/build/components/ReactFlagsSelect';
import BlueDarkGradientButton from 'components/buttons/gradient/BlueDarkGradientButton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { InputSwitch } from 'primereact/inputswitch';

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

  return (
   <div className={`min-h-screen h-full w-full overflow-x-hidden flex flex-col items-center justify-center`}>
      <form action={(formData:FormData)=>console.log(formData)} className=" flex flex-col gap-4 p-4 rounded-xl border bg-dark-gray border-primary-color max-w-7xl w-full">
       <p className='text-white text-2xl font-bold'>Found New Club !</p>
        <div className="flex flex-col gap-2">
          <p className='text-white text-lg font-medium'>General Information</p>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <LabeledInput label='Club Name' setValue={(value) => console.log(value)} />
          <div className="flex flex-col gap-1">
            <p className='text-white'>Club Logo</p>
                      <input
  type="file"
  className="file-input max-w-xs w-full bg-primary-color" />
</div>
            
            <div className="flex self-end flex-col gap-2">
<p className='text-white'>Is Your Club Free To Join ?</p>
           <InputSwitch checked  />
            </div>
          <LabeledInput type='number' label='Required Read Pages' setValue={(value) => console.log(value)} />
      
           
        </div>
       </div>
        <div className="flex flex-col gap-2">
          <p className='text-white text-lg font-medium'>Invite your friends</p>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                   <Select
              className='self-end'
      items={notCurrentUsers}
      selectionMode="multiple"
      placeholder="Select a user"
      labelPlacement='inside'
      classNames={{
        trigger: "min-h-12 py-2",
      }}
      renderValue={(items) => {
        return (
          <div className="flex overflow-x-auto gap-4 ">
            {items.map((item:any, i) => (
              <div onClick={() => console.log(item)} key={item.data.value.id}>
                <Image src={item.data.value.photoURL} alt='' width={32} height={32} className='w-6 h-6 rounded-full'/>
               
              </div>
            ))}
          </div>
        );
      }}
    >
      {(user) => (
        <SelectItem key={user.value.id} textValue={user.label}>
          <div className="flex gap-2 items-center">
            <Avatar alt={user.label} className="flex-shrink-0" size="sm" src={user.value.photoURL} />
            <div className="flex flex-col">
              <span className="text-small text-default-400">{user.value.nickname}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
    
    
         
        </div>
</div>

        <div className="flex flex-col gap-2">
          <p className='text-white text-lg font-medium'>Description</p>
          <textarea placeholder='Type additional requirements or anything about this club...' name="" id="" className='h-48 p-2 rounded-lg border-2 border-primary-color max-w-2xl outline-none w-full resize-none'></textarea>
        </div>


        <BlueDarkGradientButton isSubmit additionalClasses='self-end px-4 py-2 max-w-36 w-full'>
          Create
        </BlueDarkGradientButton>
  </form>
    </div>
  );
}

export default CreateClub;
