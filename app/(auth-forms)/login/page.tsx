'use client';
import { useState } from 'react';

import BlueButton from 'components/buttons/BlueButton';
import LabeledInput from 'components/input/LabeledInput';
import { useLogin } from 'hooks/useLogin';
import Lottie from 'lottie-react';
import toast from 'react-hot-toast';
import {
  FaFacebook,
  FaGithub,
} from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { useSelector } from 'react-redux';

import lottieAnimation
  from '../../../assets/lottieAnimations/Planet-With-Readers.json';
import classes from '../../../stylings/gradient.module.css';

function Login() {
  const {
    signInNormally,
    signInWithGithub,
    signInWithGoogle,
    signInWithFacebook,
    error,
    isPending
  } = useLogin();

  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (formData: FormData) => {
    try {
      await signInNormally(email, password);
    } catch (error) {
      toast.error('Something went not correct !');
    }
  };
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);

  return (
    <div className={`min-h-screen h-full w-full flex flex-wrap justify-center bg-secondary-color items-center ${classes['dark-blue-gradiented']}`}>
      <div className="flex items-center gap-2 w-full justify-around sm:flex-col lg:flex-row">
        <Lottie className="sm:max-w-60 xl:max-w-sm w-full" animationData={lottieAnimation} />
        <form action={handleSubmit} className="sm:max-w-sm xl:max-w-lg w-full flex flex-col gap-4 bg-dark-gray p-6 rounded-lg border-primary-color border">
          <p className='text-white text-center font-medium text-2xl'>Login and enjoy !</p>
          <LabeledInput label='Email' setValue={setEmail} />
          <LabeledInput label='Password' setValue={setPassword} />
          <BlueButton isSubmit additionalClasses='max-w-xs w-full self-center'>Login</BlueButton>
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

export default Login;
