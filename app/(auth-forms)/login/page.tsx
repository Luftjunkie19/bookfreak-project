'use client';
import { useState } from 'react';

import LabeledInput from 'components/input/LabeledInput';
import Lottie from 'lottie-react';
import toast from 'react-hot-toast';
import {
  FaBook,
  FaFacebook,
  FaGithub,
  FaGoogle,
} from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { useSelector } from 'react-redux';

import lottieAnimation
  from '../../../assets/lottieAnimations/Planet-With-Readers.json';
import classes from '../../../stylings/gradient.module.css';
import Button from 'components/buttons/Button';

function Login() {


  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (formData: FormData) => {
    try {
      // await signInNormally(email, password);
    } catch (error) {
      toast.error('Something went not correct !');
    }
  };
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);

  return (
    <div className={` w-full flex justify-center items-center min-h-screen `}>

      <div className="flex flex-col gap-3 p-2 m-1">
        <div className="flex flex-col gap-1 p-2 justify-center items-center">
        <p className='text-white text-center text-2xl font-bold'>Welcome to <span className={`${classes['header-gradient']} text-4xl ${classes['light-blue-gradient']}`}>BookFreak</span></p>
        <p className='text-white text-center'>Sign in to access your personalized book recommendations and reading list.</p>
        </div>

      <div className="max-w-md min-h-96 p-3  w-full flex justify-between self-center flex-col gap-3 rounded-lg bg-dark-gray">
          <div className="flex flex-col gap-3 p-1">

        <LabeledInput placeholder='Enter Email...' additionalClasses='p-2' label='Email' type='dark' />
          <LabeledInput placeholder='Enter Password...' additionalClasses='p-2' label='Password' type='dark'  />
          <Button type='blue' additionalClasses='max-w-sm w-full self-center'>Login</Button>
          </div>
          <div className="flex flex-col gap-2 ">
<p className='text-white px-1 text-center'>Or sign in with</p>
          <div className="flex sm:flex-row md:flex-col gap-4 p-2 items-center">
            <Button additionalClasses='flex items-center justify-center gap-6 w-full'  type='white'><FcGoogle className='text-3xl' /> <span className='sm:hidden md:block'>Sign in with Google</span> </Button>
            <Button type='black' additionalClasses=' bg-secondary-color w-full  text-white flex items-center justify-center gap-6'><FaGithub className='text-3xl' /> <span className='sm:hidden md:block'>Sign in with Github</span></Button>
            <Button additionalClasses='flex items-center justify-center w-full gap-6'  type='blue' ><FaFacebook className='text-3xl '  /> <span className='sm:hidden md:block'>Sign in with Facebook</span></Button>
          </div>
          </div>
      </div>
      </div>
      
    </div>
  );
}

export default Login;
