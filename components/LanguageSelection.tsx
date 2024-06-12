import React, { useState } from 'react';

import { httpsCallable } from 'firebase/functions';
import ReactFlagsSelect from 'react-flags-select';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { Link } from 'react-router-dom';

import { functions } from '../../';
import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function LanguageSelection() {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState('');
  const { addToDataBase, updateDatabase, removeFromDataBase} = useRealDatabase();
  const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
  const { getDocument } = useRealtimeDocument();
  const createNewLink=httpsCallable(functions, "createAccountLink")
  const { document } = useGetDocument('users', user.uid);
  
  const askLater=()=>{
    removeFromDataBase('users', `${user.uid}/accountLinkObject`);
  }


  const submitHandle = () => {
    if (user && selected.trim('') !== '') {
      addToDataBase('users', `${user.uid}/nationality`, {
        nationality: selected.toLowerCase(),
        nationalityFlag: `https://flagcdn.com/h40/${selected.toLowerCase()}.png`,
      });
    }
  };

  const updateAccountLink = async () => {
    try {
      const userObject = await getDocument('users', user.uid);

      const accountLinkResponse =await createNewLink({ accountId: userObject.stripeAccountData.id });

      const { accountLinkObject } = accountLinkResponse.data;

      updateDatabase(accountLinkObject, 'users', `${user.uid}/accountLinkObject`);

      dispatch(snackbarActions.showMessage({ message: '', alertType: 'success' }));
    } catch (error) {
      dispatch(snackbarActions.showMessage({ message: '', alertType: 'error' }));
      console.log(error.message);
    }
  };



  return (
    <>{document &&
    <div
      className={`fixed z-[99999999] top-0 left-0 w-full h-full bg-imgCover ${
        (!document.nationality || document.accountLinkObject) ? 'flex' : 'hidden'
      } flex-col justify-center items-center group`}
    >
  

      <div className="flex flex-col gap-2 justify-center items-center border-2 border-primeColor shadow-md shadow-primeColor bg-accColor rounded-xl py-8 px-4 mx-3 sm:w-full max-w-md transition-all duration-500">
        <ul className="steps">
          <li className="step step-success">{formsTranslations.fullfillData.first[selectedLanguage]}</li>
          <li className={`step ${!!document.nationality && 'step-success'}`}>
            {formsTranslations.fullfillData.second[selectedLanguage]}
          </li>
          <li className={`step ${!document.accountLinkObject && document.nationality && 'step-success'}`}>
            {formsTranslations.fullfillData.third[selectedLanguage]}
          </li>
        </ul>
        {!document.nationality && (
          <>
            <h2 className="text-xl text-white font-bold text-center">
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

            <button className="btn bg-primeColor border-none text-white" onClick={submitHandle}>
              {formsTranslations.submit[selectedLanguage]}
            </button>
          </>
        )}

        {document.nationality && document.accountLinkObject && (
          <>
            <p className="text-white font-medium">{formsTranslations.provideFinancialData[selectedLanguage]}</p>
            <Link to={`${document.accountLinkObject.url}`} className="btn bg-primeColor border-none text-white">
              {formsTranslations.provide[selectedLanguage]}
            </Link>

            <small className="text-white">{formsTranslations.info[selectedLanguage]}</small>
            <div className="w-full flex flex-wrap justify-center gap-2">
            <button
          className={`btn btn-info`}
          onClick={askLater}
        >
          {formsTranslations.askLater[selectedLanguage]}
        </button>
            <button onClick={updateAccountLink} className="btn text-white bg-primeColor">
              {formsTranslations.testFields.buttonText.createBtn[selectedLanguage]}
            </button>
            </div>
          </>
        )}   
      </div>
    </div>
    }
    </>
  );
}

export default LanguageSelection;
