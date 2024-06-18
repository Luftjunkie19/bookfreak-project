import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { motion } from 'framer-motion';
import AvatarEditor from 'react-avatar-editor';
import {
  FaBookOpen,
  FaWindowClose,
} from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';


import { storage } from '../../../firebase';
import alertMessages from '../../../../assets/translations/AlertMessages.json';
import translations from '../../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../../assets/translations/ReusableTranslations.json';
import Loader from '../../../../components/Loader';
import { modalActions } from '../../../../context/ModalContext';
import { snackbarActions } from '../../../../context/SnackBarContext';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useFormRealData } from '../../../../hooks/useFormRealData';
import { useRealDatabase } from '../../../../hooks/useRealDatabase';
import { User } from 'firebase/auth';

function EditBook() {
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  
  const { document } = useFormRealData("books", id);
  const { updateDatabase } = useRealDatabase();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pagesNumber, setPagesNumber] = useState(1);
  const [erro, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [photoImg, setPhotoImg] = useState<string | null>(null);
  const [editPhotoImg, setEditPhotoImg] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const { user } = useAuthContext();
  const editorRef = useRef<AvatarEditor>(null);
  const navigate = useNavigate();
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setAuthor(document.author);
      setPagesNumber(document.pagesNumber);
      setPhotoImg(document.photoURL);
    }
  }, [document]);

  const dispatch = useDispatch();

  const changeLogo = (e) => {
    setError(null);
    setEditPhotoImg(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected === null) {
      setEditPhotoImg(null);
      setPhotoImg(document.photoURL);
      return;
    }
    if (selected?.size > 100000) {
      setError(alertMessages.notifications.wrong.tooBigFile[selectedLanguage]);
      setEditPhotoImg(null);
      return;
    }

    if (!selected?.type.includes("image")) {
      setError(
        alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]
      );
      setEditPhotoImg(null);
      return;
    }

    if (selected?.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditPhotoImg(fileReader.result as string);
      };
      return;
    }

    setError(null);
  };

  const handleSaveAvatar = async () => {
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
      `profileImg/uid${(user as User).uid}/${(user as User).displayName}.jpg`
    );
    await uploadBytes(storageRef, byteArray);
    const url = await getDownloadURL(storageRef);
    console.log(url);

    setPhotoImg(url);
    setEditPhotoImg(null);
  };

  const handleUpdate = () => {
    setError(null);
    setIsPending(true);
    try {
      setError(null);
      setIsPending(false);
      dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:"success"}))
      

      updateDatabase(
        {
          ...document,
          title: title,
          author: author,
          pagesNumber: pagesNumber,
          photoURL: photoImg,
        },
        "books",
        id
      );

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <motion.div
        className="loader-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
     
      </motion.div>

      {isPending && <Loader />}
    </>
  );
}

export default EditBook;
