import 'react-phone-input-2/lib/material.css';
import '../stylings/backgrounds.css';

import { useState } from 'react';

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { Alert } from 'flowbite-react';
import PhoneInput from 'react-phone-input-2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VerificationInput from 'react-verification-input';

import { auth } from '../../';
import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../hooks/useAuthContext';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function LogInWithPhone() {
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();
  const { getDocument } = useRealtimeDocument();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
      window.recaptchaVerifier = recaptchaVerifier;
      const confirmResult = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaVerifier
      );

      setConfirmationResult(confirmResult);
      setShowConfirmation(true);
      setError(null);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await confirmationResult.confirm(verificationCode);

      console.log(result.user);

      const userToAdd = await getDocument("users", result.user.uid);

      console.log(userToAdd);

      if (!userToAdd) {
        toast.error(
          "You cannot login, without creating first the account. Move back and sign up."
        );
        return;
      }
      dispatch({ type: "LOGIN", payload: result.user });
      navigate("/");

      setError(null);
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen h-full flex justify-center items-center flex-col pattern-bg">
  {!showConfirmation && (
    <form
      onSubmit={handleSendVerificationCode}
      className="p-4 lg:shadow-md lg:shadow-primeColor sm:bg-transparent lg:bg-accColor rounded-md gap-4 flex justify-around items-center flex-col sm:w-full max-w-lg"
    >
      <p className={`text-2xl ${isDarkModed ? "text-white" : "text-black"} text-center`}>
        {
          formsTranslations.signingOptions.passwordForgotten.provideNumber[
            selectedLanguage
          ]
        }
      </p>

      <label className={`${isDarkModed ? "text-white" : "text-black"} sm:w-full lg:w-1/2 self-start`}>
        <PhoneInput
          prefix="+"
          inputClass={`text-white bg-primeColor ${isDarkModed ? "text-white" : "text-black"}`}
          country={"pl"}
          inputProps={{ required: true, autoFocus: true }}
          value={phone}
          onChange={(phone) => setPhone(`+${phone}`)}
        />
      </label>

      {error && (
        <Alert className="bg-transparent text-error" severity="error">
          {error}
        </Alert>
      )}

      <button className={`btn ${isDarkModed ? "bg-accColor" : "bg-primeColor"} md:bg-primeColor max-w-md text-white`}>
        {
          formsTranslations.signingOptions.passwordForgotten.verifyBtn[
            selectedLanguage
          ]
        }
      </button>
    </form>
  )}
  <div id="recaptcha-container"></div>
  {showConfirmation && (
    <>
      <form
        onSubmit={handleVerifyCode}
        className="flex flex-col sm:w-full max-w-lg justify-center items-center gap-3 sm:bg-transparent md:bg-accColor shadow-md shadow-primeColor p-4 rounded-md"
      >
        <p className={`text-3xl md:text-white ${isDarkModed ? "text-white" : "text-black"}`}>
          {
            formsTranslations.signingOptions.passwordForgotten
              .verificationText[selectedLanguage]
          }
        </p>

        <label>
          <span className={`md:text-white ${isDarkModed ? "text-white" : "text-black"}`}>
            {
              formsTranslations.signingOptions.passwordForgotten
                .verificationCode[selectedLanguage]
            }
            :
          </span>

          <VerificationInput
            classNames={{
              character: "rounded-md",
              characterSelected: " border-accColor",
            }}
            autoFocus
            validChars="0-9"
            inputProps={{ inputMode: "numeric" }}
            onChange={(value) => setVerificationCode(value)}
          />
        </label>
        <button className={`btn text-white ${isDarkModed ? "bg-accColor" : "bg-primeColor"} md:bg-primeColor`}>
          {
            formsTranslations.signingOptions.passwordForgotten.verifyBtn[
              selectedLanguage
            ]
          }
        </button>
        {error && (
          <Alert className="bg-transparent text-error" severity="error">
            {error}
          </Alert>
        )}
      </form>
    </>
  )}
</div>

  );
}

export default LogInWithPhone;
