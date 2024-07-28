import '../stylings/backgrounds.css';

import { useState } from 'react';

import { sendPasswordResetEmail } from 'firebase/auth';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { auth } from '../../firebase';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import formsTranslations
  from '../../../assets/translations/FormsTranslations.json';


function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    await sendPasswordResetEmail(auth, email);

    navigate("/");
  };

  return (
    <div className={`min-h-screen h-full flex `}>
     
    </div>
  );
}

export default ForgotPassword;
