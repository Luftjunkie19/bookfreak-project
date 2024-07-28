'use client';

import {
  useRef,
  useState,
} from 'react';
import classes from '../../../stylings/gradient.module.css'
import { useLogin } from 'hooks/useLogin';
import Lottie from 'lottie-react';
import AvatarEditor from 'react-avatar-editor';
import {
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaPhoneAlt,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from 'components/Loader';
import Animation from '../../../assets/lottieAnimations/Reading-Woman.json'
import LabeledInput from 'components/input/LabeledInput';

import { FcGoogle } from 'react-icons/fc';
import Button from 'components/buttons/Button';

function SignUp() {
  const {
    signUpUser,
    signInWithGoogle,
    signInWithFacebook,
    signInWithGithub,
    error,
    isPending,
  } = useLogin();
  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userImg, setUserImg] = useState<any>(null);
  const [userImgError, setUserImgError] = useState(null);
  const [userEditImg, setUserEditImg] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const editorRef = useRef<AvatarEditor>(null);

  const handleSubmit = async () => {
    await signUpUser(email, password, displayName, userImg);
  };

  const handleSelect = (e) => {
    setUserImgError(null);
    setUserImg(null);
    setUserEditImg(null);

    let selected = e.target.files[0];

    // if (!selected) {
    //   setUserImgError(
    //     alertMessages.notifications.wrong.selectAnything[selectedLanguage]
    //   );
    //   return;
    // }

    // if (!selected.type.includes("image")) {
    //   setUserImgError(
    //     alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]
    //   );
    //   return;
    // }

    // if (selected.size > 100000) {
    //   setUserImgError(
    //     alertMessages.notifications.wrong.tooBigFile[selectedLanguage]
    //   );
    //   return;
    // }

    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setUserEditImg(fileReader.result);
      };
      return;
    }

    setUserImgError(null);
  };

  const handleSaveImg = () => {
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

      setUserImg(byteArray);
      setUserEditImg(null);
    }
  };

  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);

  return (
    <div className={`min-h-screen h-full w-full flex `}>
   <Button type='blue' onClick={signInWithGoogle} additionalClasses='px-4 h-fit m-2'>Sign In</Button>
    </div>
  );
}

export default SignUp;
