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
        className="flex flex-col gap-6 items-center p-3 text-white rounded-md"
      >
        <h2 className="text-6xl font-bold">
          {formsTranslations.signingOptions.passwordForgotten[selectedLanguage]}
        </h2>
        <p>
          {
            formsTranslations.signingOptions.passwordForgotten.underText[
              selectedLanguage
            ]
          }
        </p>

        <label className="flex flex-col sm:w-full md:max-w-xl my-2">
          <span>Email:</span>
          <input
            type="email"
            required
            className="p-2 rounded-md w-full outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>

        <button className="btn btn-wide bg-accColor text-white">
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
