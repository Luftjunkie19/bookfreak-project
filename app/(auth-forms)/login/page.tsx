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
    <div className={`min-h-screen h-full w-full flex `}>
    
    </div>
  );
}

export default Login;
