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
import PhoneInput from 'react-phone-input-2';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuthContext } from '../hooks/useAuthContext';

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
      setError(error);
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
      setError(error);
      console.log(error);
    }
  };

  return (
    <>
      {!showConfirmation && (
        <form onSubmit={handleSendVerificationCode}>
          <label>
            <PhoneInput
              country={"pl"}
              value={phone}
              onChange={(phone) => setPhone(`+${phone}`)}
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button className="btn">Go to verify</button>
        </form>
      )}
      <div id="recaptcha-container"></div>
      {showConfirmation && (
        <>
          <form onSubmit={handleVerifyCode}>
            <label>
              <span>Verification code:</span>
              <input
                type="number"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </label>
            <button className="btn">Verify</button>
            {error && <p className="error">{error}</p>}
          </form>
        </>
      )}
    </>
  );
}

export default LogInWithPhone;
