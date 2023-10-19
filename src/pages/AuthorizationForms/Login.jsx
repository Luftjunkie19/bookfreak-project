import { useState } from 'react';

import {
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaPhoneAlt,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Alert } from '@mui/material';

import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import { useLogin } from '../../hooks/useLogin';

function Login() {
  const {
    signInNormally,
    signInWithGithub,
    signInWithGoogle,
    signInWithFacebook,
    error,
  } = useLogin();

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    signInNormally(email, password);
  };

  return (
    <div className="min-h-screen h-full w-full flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="px-4 py-2 bg-primeColor shadow-lg rounded-lg text-white sm:w-full md:w-4/5 xl:w-3/5 2xl:w-2/5 m-4"
      >
        <h2 className="text-center text-3xl leading-10 my-2 font-bold">
          {formsTranslations.signInForm.topText[selectedLanguage]}
        </h2>
        <div className="flex justify-center items-center flex-wrap gap-3 w-full">
          <label className="flex flex-col sm:w-full lg:w-4/5 2xl:w-2/5">
            <span>Email:</span>
            <input
              className="p-2 rounded-md outline-none text-white w-full"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col sm:w-full lg:w-4/5 2xl:w-2/5">
            <span>
              {formsTranslations.userFields.password[selectedLanguage]}:
            </span>
            <input
              className="p-2 rounded-md outline-none text-white w-full"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        <div className="flex justify-center items-center flex-col my-3">
          <button className="btn sm:w-full lg:w-1/2 bg-accColor text-white">
            {formsTranslations.signUpForm.btnText[selectedLanguage]}
          </button>

          {error && (
            <Alert className="bg-transparent text-red-400" severity="error">
              {error}
            </Alert>
          )}
        </div>

        <div className="flex w-full flex-wrap gap-5 justify-center items-center my-2">
          <Link
            className="btn sm:w-3/4 lg:w-2/5 text-white"
            to="/forgot-password"
          >
            {
              formsTranslations.signingOptions.passwordForgotten[
                selectedLanguage
              ]
            }
          </Link>
          <Link
            className="btn sm:w-3/4 lg:w-2/5 text-white"
            to="/login-with-phone"
          >
            <FaPhoneAlt />{" "}
            {formsTranslations.signingOptions.phone[selectedLanguage]}
          </Link>
        </div>

        <h3 className="text-center text-2xl leading-9 p-2">
          {formsTranslations.signInForm.optionsText[selectedLanguage]}
        </h3>
        <div className="flex w-full flex-wrap justify-center items-center gap-2">
          <button
            className="btn sm:w-full lg:w-3/4 text-white bg-blue-600 border-none hover:bg-blue-500"
            onClick={signInWithGoogle}
          >
            <FaGoogle />
            Google
          </button>
          <button
            className="btn sm:w-full lg:w-3/4 bg-facebook text-white border-none hover:bg-blue-800"
            onClick={signInWithFacebook}
          >
            <FaFacebook />
            Facebook
          </button>
          <button
            className="btn sm:w-full lg:w-3/4 text-white xl:col-span-2 bg-github hover:bg-gray-900"
            onClick={signInWithGithub}
          >
            <FaGithub />
            Github
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
