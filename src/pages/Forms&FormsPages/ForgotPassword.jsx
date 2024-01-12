import '../stylings/backgrounds.css';

import { useState } from 'react';

import { sendPasswordResetEmail } from 'firebase/auth';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { auth } from '../../';
import alertMessages from '../../assets/translations/AlertMessages.json';
import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import { snackbarActions } from '../../context/SnackBarContext';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
const dispatch= useDispatch();
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    await sendPasswordResetEmail(auth, email);

    dispatch(snackbarActions.showMessage({message:alertMessages.notifications.successfull[selectedLanguage], alertType:"success"}));
    navigate("/");
  };

  return (
<div className={`min-h-screen h-full flex justify-center items-center flex-col ${!isDarkModed && "pattern-bg"}`}>
  <form
    onSubmit={submitForm}
    className="flex flex-col gap-6 items-center p-3 text-white rounded-md"
  >
    <h2 className={`text-6xl font-bold ${isDarkModed ? "text-white" : "text-black"}`}>
      {formsTranslations.signingOptions.passwordForgotten[selectedLanguage]}
    </h2>
    <p className={`${isDarkModed ? "text-white" : "text-black"}`}>
      {
        formsTranslations.signingOptions.passwordForgotten.underText[
          selectedLanguage
        ]
      }
    </p>

    <label className={`flex flex-col sm:w-full md:max-w-xl my-2 ${isDarkModed ? "text-white" : "text-black"}`}>
      <span>Email:</span>
      <input
        type="email"
        required
        className={`p-2 rounded-md w-full outline-none input border-2 border-accColor ${isDarkModed ? "text-white" : "text-black"}`}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
    </label>

    <button className={`btn btn-wide ${isDarkModed ? "bg-accColor" : "bg-primeColor"} text-white`}>
      {
        formsTranslations.signingOptions.passwordForgotten.sendEmail[
          selectedLanguage
        ]
      }
    </button>
  </form>
</div>
  );
}

export default ForgotPassword;
