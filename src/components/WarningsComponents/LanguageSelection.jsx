import React, {
  useEffect,
  useState,
} from 'react';

import ReactFlagsSelect from 'react-flags-select';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function LanguageSelection() {
  const { user } = useAuthContext();
  const [selected, setSelected] = useState("");
  const [hasNoNationality, setHasNoNationalitySet] = useState(false);
  const [hasNotRegistered, setHasNotRegistered] = useState(false);
  const { addToDataBase, updateDatabase } = useRealDatabase();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { getDocument } = useRealtimeDocument();
  const [link, setLink] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUserDocument = async () => {
    if (user) {
      const userObject = await getDocument("users", user.uid);

      if (userObject) {
        setLink(userObject?.accountLinkObject?.url);
      }

      if (!userObject.nationality && user && userObject.accountLinkObject) {
        setHasNoNationalitySet(true);
      } else if (
        userObject.nationality &&
        user &&
        userObject.accountLinkObject
      ) {
        setHasNotRegistered(true);
      } else {
        setHasNoNationalitySet(false);
        setHasNotRegistered(false);
      }
    }
  };

  useEffect(() => {
    loadUserDocument();
  }, [loadUserDocument]);

  const submitHandle = () => {
    if (user && selected.trim("") !== "") {
      addToDataBase("users", `${user.uid}/nationality`, {
        nationality: selected.toLowerCase(),
        nationalityFlag: `https://flagcdn.com/h40/${selected.toLowerCase()}.png`,
      });
      setHasNoNationalitySet(false);
    }
    return;
  };

  const updateAccountLink = async () => {
    try {
      const userObject = await getDocument("users", user.uid);

      const accountLinkResponse = await fetch(
        "http://127.0.0.1:5001/bookfreak-954da/us-central1/stripeFunctions/createAccountLink",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Connection: "keep-alive",
            Accept: "*",
          },
          body: JSON.stringify({ accountId: userObject.stripeAccountData.id }),
        }
      );

      const { accountLinkObject } = await accountLinkResponse.json();

      updateDatabase(
        accountLinkObject,
        `users`,
        `${user.uid}/accountLinkObject`
      );

      setLink(accountLinkObject.url);
      toast.success("New link created");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  return (
    <div
      className={`fixed z-[99999999] top-0 left-0 w-full h-full bg-imgCover ${
        hasNoNationality || hasNotRegistered ? `flex` : "hidden"
      } flex-col justify-center items-center group`}
    >
      <div className="flex flex-col gap-2 justify-center items-center border-2 border-primeColor shadow-md shadow-primeColor bg-accColor rounded-xl py-8 px-4 mx-3 sm:w-full max-w-xs transition-all duration-500">
        <ul className="steps">
          <li className="step step-success">Register</li>
          <li className={`step ${!hasNoNationality && "step-success"}`}>
            Set nationality
          </li>
          <li
            className={`step ${
              !hasNotRegistered && !hasNoNationality && "step-success"
            }`}
          >
            Enjoy using
          </li>
        </ul>
        {hasNoNationality && (
          <>
            <h2 className=" text-xl text-white font-bold text-center">
              {formsTranslations.topText.selectNationality[selectedLanguage]}
            </h2>

            <ReactFlagsSelect
              searchPlaceholder="Search countries"
              className="text-black sm:w-full lg:w-3/4"
              selectButtonClassName="bg-accColor text-white rounded-md border-white text-white"
              selected={selected}
              onSelect={(code) => {
                setSelected(code);
                console.log(code);
              }}
            />

            <button
              className="btn bg-primeColor border-none text-white"
              onClick={submitHandle}
            >
              {formsTranslations.submit[selectedLanguage]}
            </button>
          </>
        )}

        {!hasNoNationality && hasNotRegistered && (
          <>
            <p className="text-white font-medium">Provide financial data</p>
            <Link
              to={`${link}`}
              className="btn bg-primeColor border-none text-white"
            >
              Provide
            </Link>

            <small className="text-white">
              If you get redirected, try to create a new link, clicking button
              below.
            </small>
            <button
              onClick={updateAccountLink}
              className="btn text-white bg-primeColor"
            >
              Create new link
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LanguageSelection;
