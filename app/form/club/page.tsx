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
   <div className={`min-h-screen h-full w-full `}>
     
    </div>
  );
}

export default CreateClub;
