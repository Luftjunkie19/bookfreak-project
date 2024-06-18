import '../stylings/backgrounds.css';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  updateEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { motion } from 'framer-motion';
import AvatarEditor from 'react-avatar-editor';
import ReactFlagsSelect from 'react-flags-select';
import { FaWindowClose } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  functions,
  storage,
} from '../../app/firebase';
import alertMessages from '../../assets/translations/AlertMessages.json';
import formsTranslation from '../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
// import BookBucksComponent
//   from '../../components/';
import Loader from '../../components/Loader';
import { modeActions } from '../../context/ModeContext';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFormRealData } from '../../hooks/useFormRealData';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function EditProfile() {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const { document } = useFormRealData("users", (user as User).uid);
  const { getDocuments } = useRealtimeDocuments();
  const { updateDatabase } = useRealDatabase();
  const defaultImg = (user as User).photoURL;
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const createPayout= httpsCallable(functions, 'createPayout');
  const createAccountLink= httpsCallable(functions, 'createAccountLink');
  const [nickname, setNickname] = useState((user as User).displayName);
  const [email, setEmail] = useState((user as User).email);
  const [profileImg, setProfileImg] = useState(defaultImg);
  const [description, setDescription] = useState("");
  const [editProfileImg, setEditProfileImg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [bookReaders, setBookReaders] = useState([]);
  const [selected, setSelected] = useState<any | null>(null);
  const editorRef = useRef<AvatarEditor>(null);
  const [amountToPayout, setAmountToPayout] = useState(0);
  const [balance, setBalance] = useState<number | null>(null);
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const navigate = useNavigate();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadBookReaders = async () => {
    const documents = await getDocuments("bookReaders");

    const realObjects = (documents as any).map((bookReader) => {
      return bookReader.readers;
    });

    const newArray = realObjects.map((obj) => {
      const nestedObject = Object.values(obj)[0];
      return nestedObject;
    });

    setBookReaders(newArray);
  };

  useEffect(() => {
    loadBookReaders();
  }, [loadBookReaders]);

  useEffect(() => {
    if (document) {

      if (document.id === (user as User).uid) {
              setDescription(document.description);
              setBalance(document.creditsAvailable.valueInMoney);
            } else {
              navigate('/');
            }
      }
  }, [document, navigate, user]);

  const handleImg = (e) => {
    setEditProfileImg(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected?.size > 100000) {
      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.tooBigFile[selectedLanguage]}`, alertType:"error"}));
      setEditProfileImg(null);
      return;
    }

    if (!selected?.type.includes("image")) {
      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]}`, alertType:"error"}));
      setEditProfileImg(null);
      return;
    }

    if (selected === null) {
      setProfileImg(document.photoURL);
      setEditProfileImg(null);
      return;
    }

    if (selected?.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditProfileImg(fileReader.result as string);
      };
      return;
    }

  };

  const handleSaveAvatar = async () => {
    if (editorRef.current) {
      const editorImg = editorRef.current.getImageScaledToCanvas()
        .toDataURL("image/jpg");
  
      const byteCharacters = atob(editorImg.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
  
      const storageRef = ref(
        storage,
        `profileImg/uid${(user as User).uid}/${(user as User).displayName}.jpg`
      );
      await uploadBytes(storageRef, byteArray);
      const url = await getDownloadURL(storageRef);
      console.log(url);
  
      setProfileImg(url);
      setEditProfileImg(null);
      
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsPending(true);
    try {
      console.log(nickname, email, profileImg);

      await updateProfile((user as User), {
        displayName: nickname,
        photoURL: profileImg,
      });

      await updateEmail((user as User), email as string);

      updateDatabase(
        {
          ...document,
          nickname: nickname,
          photoURL: profileImg,
          description: description,
          email: email,
          nationality: {
            nationality: selected
              ? selected.toLowerCase()
              : document.nationality.nationality,
            nationalityFlag: selected
              ? `https://flagcdn.com/h40/${selected.toLowerCase()}.png`
              : document.nationality.nationalityFlag,
          },
        },
        "users",
        (user as User).uid
      );

      if (bookReaders.length > 0) {
        const yourObjects = bookReaders.filter(
          (reader:any) => reader.id === (user as User).uid
        );

        yourObjects.map((reader:any) => {
          updateDatabase(
            {
              ...reader,
              displayName: nickname,
              email: email,
              photoURL: profileImg,
            },
            "bookReaders",
            `${reader.bookReadingId}/readers/${(user as User).uid}`
          );
        });
      }

      setIsPending(false);
      navigate(`/profile/${(user as User).uid}`);
      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:"success"}));
    } catch (error) {
      console.log(error);
      setIsPending(false);
    }
    setIsPending(false);
  };

  const payoutAmount = async (e) => {
    e.preventDefault();
    try {
      setIsPending(true);
      await createPayout({
        amount: amountToPayout,
        currentUserId: (user as User).uid,
        userId: document.stripeAccountData.id,
        currency: document.stripeAccountData.default_currency,
        destinationAccount:
          document.stripeAccountData.external_accounts.data["0"].id,
      });
       
    
      setAmountToPayout(0);
      setBalance((prev:number) => {
        return prev - amountToPayout;
      });
      setIsPending(false);
    } catch (err) {
      dispatch(snackbarActions.showMessage({message:err.message, alertType:"error"}));
      setIsPending(false);
    }
  };

  const moveToProvideFinanceData = async (e) => {
    e.preventDefault();
    try {
      const accountLinkResponse = await createAccountLink({ accountId: document.stripeAccountData.id });
      const { accountLinkObject } = (accountLinkResponse.data as any);

      window.location.href = accountLinkObject.url;
      window.location.assign(accountLinkObject.url);
      window.location.replace(accountLinkObject.url);

      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.create[selectedLanguage]}`, alertType:"success"}));
    } catch (error) {
      dispatch(snackbarActions.showMessage({message:error.message, alertType:"error"}));

    }
  };
  return (
    <motion.div
      className={`min-h-screen h-full ${!isDarkModed && "pattern-bg"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {editProfileImg && (
       <div></div>
      )}
      {document && (
     <div></div>
      )}
   

      {isPending && <Loader />}
    </motion.div>
  );
}

export default EditProfile;
