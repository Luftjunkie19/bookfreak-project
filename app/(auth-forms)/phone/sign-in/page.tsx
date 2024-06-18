import 'react-phone-input-2/lib/material.css';
import '../stylings/backgrounds.css';

import { useState } from 'react';

import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import PhoneInput from 'react-phone-input-2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VerificationInput from 'react-verification-input';

import { auth } from '../../../firebase';
import formsTranslations
  from '../../../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import useRealtimeDocument from '../../../../hooks/useRealtimeDocument';
import toast from 'react-hot-toast';

function LogInWithPhone() {
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();
  const { getDocument } = useRealtimeDocument();
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
      (window as any).recaptchaVerifier = recaptchaVerifier;
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
      if (confirmationResult) {
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
    }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen h-full">
  {!showConfirmation && (
  <div></div>
  )}
  <div id="recaptcha-container"></div>
  {showConfirmation && (
     <div></div>
  )}
</div>

  );
}

export default LogInWithPhone;
