import React, {
  useEffect,
  useState,
} from 'react';

import ReactFlagsSelect from 'react-flags-select';
import { useSelector } from 'react-redux';

import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function LanguageSelection() {
  const { user } = useAuthContext();
  const [selected, setSelected] = useState("");
  const [hasNoNationality, setHasNoNationalitySet] = useState(false);
  const { addToDataBase } = useRealDatabase();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { getDocument } = useRealtimeDocument();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUserDocument = async () => {
    if (user) {
      const userObject = await getDocument("users", user.uid);

      if (!userObject.nationality && user) {
        setHasNoNationalitySet(true);
      } else {
        setHasNoNationalitySet(false);
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

  return (
    <div
      className={`fixed z-[99999999] top-0 left-0 w-full h-full bg-imgCover ${
        hasNoNationality ? `flex` : "hidden"
      } flex-col justify-center items-center group`}
    >
      <div className="flex flex-col gap-2 justify-center items-center bg-accColor rounded-xl py-8 px-4 mx-3 sm:w-4/5 lg:w-3/5 xl:w-1/4 transition-all duration-500">
        <ul className="steps">
          <li className="step step-primary">Register</li>
          <li className={`step ${selected.trim("") !== "" && "step-primary"}`}>
            Set nationality
          </li>
          <li className={`step ${selected.trim("") !== "" && "step-primary"}`}>
            Enjoy using
          </li>
        </ul>

        <h2 className=" text-xl text-white font-bold text-center">
          {formsTranslations.topText.selectNationality[selectedLanguage]}
        </h2>

        <ReactFlagsSelect
          searchPlaceholder="Search countries"
          searchable
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
      </div>
    </div>
  );
}

export default LanguageSelection;
