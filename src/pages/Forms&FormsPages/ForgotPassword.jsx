import { useState } from "react";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import formsTranslations from "../../assets/translations/FormsTranslations.json";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const myAuth = getAuth();

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    await sendPasswordResetEmail(myAuth, email);

    toast.success("Email successfully sent");
    navigate("/");
  };

  return (
    <div className="min-h-screen h-full flex justify-center items-center flex-col">
      <form
        onSubmit={submitForm}
        className="flex flex-col items-center p-3 text-white rounded-md shadow-md shadow-primeColor bg-accColor"
      >
        <h2 className="text-2xl font-bold">
          {formsTranslations.signingOptions.passwordForgotten[selectedLanguage]}
        </h2>
        <p>
          {
            formsTranslations.signingOptions.passwordForgotten.underText[
              selectedLanguage
            ]
          }
        </p>

        <label className="flex flex-col my-2">
          <span>Email:</span>
          <input
            type="email"
            required
            className="p-2 rounded-md outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>

        <button className="btn btn-wide">
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
