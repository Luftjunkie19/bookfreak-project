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
import DarkWhiteGradientButton from 'components/buttons/gradient/DarkWhiteButton';
import WhiteButton from 'components/buttons/WhiteButton';
import BlueButton from 'components/buttons/BlueButton';
import { FcGoogle } from 'react-icons/fc';

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
    <div className={`min-h-screen h-full w-full relative top-0 left-0 flex flex-wrap items-center justify-center `}>
      <div className="max-w-5xl flex sm:flex-col lg:flex-row gap-6 justify-between items-center w-full">
        <Lottie animationData={Animation} className="sm:max-w-60 lg:max-w-xs w-full" />
        <form
          className=' bg-dark-gray rounded-3xl p-4 sm:max-w-sm lg:max-w-md xl:max-w-lg w-full z-10 border-2 border-primary-color flex flex-col gap-3'
          onSubmit={handleSubmit}
        >
          <p className='text-white text-xl text-center font-semibold'>Sign Up And Enjoy Your Time !</p>
          <LabeledInput label='Nickname' setValue={setDisplayName} />
          <LabeledInput label='Email' setValue={setEmail} />
          <LabeledInput label='Password' setValue={setPassword} />

          <BlueButton additionalClasses='max-w-60 w-full self-center' onClick={() => console.log('Log')}>
            Sign Up
          </BlueButton>

          <div className=" justify-between self-center max-w-xs w-full flex gap-2 items-center">
            <button onClick={signInWithGoogle}>
              <FcGoogle size={42} />
            </button>
            <button onClick={signInWithFacebook}>
              <FaFacebook size={42} className="text-white text-lg" />
            </button>
            <button onClick={signInWithGithub}>
              <FaGithub size={42} className="text-white text-lg" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default SignUp;
