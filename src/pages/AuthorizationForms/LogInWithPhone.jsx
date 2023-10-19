import 'react-phone-input-2/lib/material.css';

import { useState } from 'react';

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
} from 'firebase/firestore';
import { Alert } from 'flowbite-react';
import PhoneInput from 'react-phone-input-2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VerificationInput from 'react-verification-input';

import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../hooks/useAuthContext';

function LogInWithPhone() {
  const firestore = getFirestore();
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();
  const myAuth = getAuth();
  const navigate = useNavigate();

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
        },
        myAuth
      );

      const confirmResult = await signInWithPhoneNumber(
        myAuth,
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

      const document = doc(firestore, "users", result.user.uid);
      const userToAdd = await getDoc(document);

      console.log(userToAdd);

      if (!userToAdd.exists()) {
        toast.error(
          "You cannot login, without creating first the account. Move back and sign up."
        );
        return;
      } else {
        dispatch({ type: "LOGIN", payload: result.user });
      }

      navigate("/");

      setError(null);
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen h-full flex justify-center items-center flex-col">
      {!showConfirmation && (
        <form
          onSubmit={handleSendVerificationCode}
          className="p-4 shadow-md shadow-primeColor bg-accColor rounded-md gap-4 flex justify-around items-center flex-col sm:w-full md:w-4/5 lg:w-3/5 xl:w-2/5 2xl:w-1/3"
        >
          <p className="text-2xl text-white text-center ">
            {
              formsTranslations.signingOptions.passwordForgotten.provideNumber[
                selectedLanguage
              ]
            }
          </p>

          <label className="text-black sm:w-full lg:w-1/2">
            <PhoneInput
              prefix="+"
              inputClass="w-full"
              country={"pl"}
              inputProps={{ required: true, autoFocus: true }}
              value={phone}
              onChange={(phone) => setPhone(`+${phone}`)}
            />
          </label>

          {error && (
            <Alert className="bg-transparent" severity="error">
              {error}
            </Alert>
          )}

          <button className="btn sm:w-full md:w-1/2 lg:w-1/3 m-2">
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
            className="flex flex-col sm:w-full md:w-4/5 xl:w-3/5 2xl:w-1/2 sm:bg-transparent md:bg-accColor shadow-md shadow-primeColor p-4 rounded-md"
          >
            <p className="text-3xl text-white">
              {
                formsTranslations.signingOptions.passwordForgotten
                  .verificationText[selectedLanguage]
              }
            </p>

            <label>
              <span>
                {
                  formsTranslations.signingOptions.passwordForgotten
                    .verificationCode[selectedLanguage]
                }
                :
              </span>

              <VerificationInput
                autoFocus
                validChars="0-9"
                inputProps={{ inputMode: "numeric" }}
                onChange={(value) => setVerificationCode(value)}
              />
            </label>
            <button className="btn sm:bg-accColor md:bg-primeColor">
              {
                formsTranslations.signingOptions.passwordForgotten.verifyBtn[
                  selectedLanguage
                ]
              }
            </button>
            {error && (
              <Alert className="bg-transparent" severity="error">
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
