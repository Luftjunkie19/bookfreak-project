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
 <div className={`min-h-screen w-full flex justify-center items-center `}>

      <div className="flex flex-col gap-3 m-1">
        <div className="flex flex-col gap-1 p-2 justify-center items-center">
        <p className='text-white text-center text-2xl font-bold'>Welcome to <span className={`${classes['header-gradient']} text-4xl ${classes['light-blue-gradient']}`}>BookFreak</span></p>
        <p className='text-white text-center'>Sign up to access your personalized book recommendations and reading list.</p>
        </div>

      <div className="max-w-md min-h-96 p-2  w-full flex justify-between self-center flex-col gap-3 rounded-lg bg-dark-gray">
          <div className="flex flex-col gap-3 p-1">
<LabeledInput placeholder='Enter Nickname...' additionalClasses='p-2' label='Nickname' type='dark' setValue={(value)=>{}}/>
        <LabeledInput placeholder='Enter Email...' additionalClasses='p-2' label='Email' type='dark' setValue={(value)=>{}}/>
          <LabeledInput placeholder='Enter Password...' additionalClasses='p-2' label='Password' type='dark' setValue={(value) => { }} />
          <Button type='blue' additionalClasses='max-w-sm w-full self-center'>Login</Button>
          </div>
          <div className="flex flex-col gap-2 ">
<p className='text-white px-1 text-center'>Or sign in with</p>
          <div className="flex sm:flex-row md:flex-col gap-4 p-2 items-center">
            <Button additionalClasses='flex items-center justify-center gap-6 w-full' onClick={signInWithGoogle} type='white'><FcGoogle className='text-3xl' /> <span className='sm:hidden md:block'>Sign in with Google</span> </Button>
            <Button onClick={signInWithGithub} type='black' additionalClasses=' bg-secondary-color w-full  text-white flex items-center justify-center gap-6'><FaGithub className='text-3xl' /> <span className='sm:hidden md:block'>Sign in with Github</span></Button>
            <Button additionalClasses='flex items-center justify-center w-full gap-6' onClick={signInWithFacebook} type='blue' ><FaFacebook className='text-3xl '  /> <span className='sm:hidden md:block'>Sign in with Facebook</span></Button>
          </div>
          </div>
      </div>
      </div>
      
    </div>
  );
}

export default SignUp;
