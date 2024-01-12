import '../../components/stylings/mui-stylings.css';
import '../stylings/backgrounds.css';

/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';

import generateUniqueId from 'react-id-generator';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Autocomplete,
  TextField,
} from '@mui/material';

import alertMessages from '../../assets/translations/AlertMessages.json';
import formTranslations from '../../assets/translations/FormsTranslations.json';
import profileTranslations
  from '../../assets/translations/ProfileTranslations.json';
import Loader from '../../components/Loader';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function AddLink() {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const dispatch=useDispatch();
  const [option, setOption] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { getDocument } = useRealtimeDocument();
  const { getDocuments } = useRealtimeDocuments();
  const { addToDataBase } = useRealDatabase();
  const { user } = useAuthContext();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);

 const {documents}=useGetDocuments('links');

 const links = documents.map((bookReader) => {
  return bookReader;
})
.filter((reader) => reader.belongsTo === user.uid);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const uniqueId = generateUniqueId(
        `${option}${new Date().getTime()}${user.uid}`
      );

      if (option === "discord") {
        if (!link.match("^.{3,32}#[0-9]{4}$")) {
          setError(
            alertMessages.notifications.wrong.discordName[selectedLanguage]
          );
          setIsPending(false);
          return;
        }

        if (links.find((exLink) => exLink.mediaType === option)) {
          setError(alertMessages.notifications.wrong[selectedLanguage]);
          setIsPending(false);
          return;
        }

        addToDataBase("links", uniqueId, {
          mediaType: option,
          nickname: link,
          belongsTo: user.uid,
          id: uniqueId,
        });
      } else {
        if (
          !link.match(
            "/(https?://)?(www.)?[a-zA-Z0-9]+.[a-zA-Z]{2,}([/w .-]*)*/?/"
          )
        ) {
          setError(
            alertMessages.notifications.wrong.urlError[selectedLanguage]
          );
          setIsPending(false);
          return;
        }

        if (links.find((exLink) => exLink.mediaType === option)) {
          setError(alertMessages.notifications.wrong[selectedLanguage]);
          setIsPending(false);
          return;
        }

        addToDataBase("links", uniqueId, {
          mediaType: option,
          linkTo: link,
          belongsTo: user.uid,
          id: uniqueId,
        });
      }

      setError(null);
      setIsPending(false);
      navigate(`/profile/${user.uid}`);
      dispatch(snackbarActions.showMessage({message: `${alertMessages.notifications.successfull.create[selectedLanguage]}`, alertType:"success"}));
    } catch (error) {
      setError(error.message);
    }
  };

  const availableMedia = [
     "discord",
     "spotify",
    "youtube",
    "github" 
  ];

  return (
    <div className={`min-h-full h-screen flex flex-col justify-center items-center ${!isDarkModed && "pattern-bg"}`}>
      <form
        className="h-1/2 justify-around flex flex-col py-6 px-12 gap-4"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h2 className={`text-5xl font-bold ${isDarkModed ? "text-white" : "text-black"}`}>
          {profileTranslations.addLinkForm.topText[selectedLanguage]}
        </h2>

        <label className="sm:w-full md:max-w-3xl">
          <Autocomplete
     
        onChange={(event, newValue) => {
          setOption(newValue);
          console.log(newValue)
        }}
        id="controllable-states-demo"
        options={availableMedia}
className="w-full"
        renderInput={(params) => <TextField {...params} label={profileTranslations.addLinkForm.query[selectedLanguage]} />}
      />


       
        </label>
        {option === "discord" && (
          <label className="flex flex-col sm:w-full md:max-w-xl">
            <span className={`${isDarkModed ? "text-white" : "text-black"}`}>
              {formTranslations.userFields.nickname[selectedLanguage]}:
            </span>
            <input
              className="input input-info outline-none w-full py-1"
              type="text"
              required
              placeholder={
                formTranslations.userFields.nickname[selectedLanguage]
              }
              onChange={(e) => setLink(e.target.value)}
            />
          </label>
        )}

        {option === "spotify" && (
          <>
            <label className="flex flex-col  sm:w-full md:max-w-xl">
              <span className={`${isDarkModed ? "text-white" : "text-black"}`}>Link:</span>
              <input
                className="input input-info outline-none w-full py-1"
                type="text"
                placeholder={`${profileTranslations.addLinkForm.placeHolder[selectedLanguage]}`}
                required
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          </>
        )}

        {option === "youtube" && (
          <>
            <label className="flex flex-col  sm:w-full md:max-w-xl">
              <span className={`${isDarkModed ? "text-white" : "text-black"}`}>Link:</span>
              <input
                className="input input-info outline-none w-full py-1"
                type="text"
                required
                placeholder={`${profileTranslations.addLinkForm.placeHolder[selectedLanguage]}`}
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          </>
        )}

        {option === "github" && (
          <>
            <label className="flex flex-col  sm:w-full md:max-w-xl">
              <span className={`${isDarkModed ? "text-white" : "text-black"}`}>Link:</span>
              <input
                className="input input-info outline-none w-full py-1"
                type="text"
                required
                placeholder={`${profileTranslations.addLinkForm.placeHolder[selectedLanguage]}`}
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          </>
        )}

        {option === "" && (
          <p className={`${isDarkModed ? "text-white" : "text-black"}`}>
            {profileTranslations.addLinkForm.selectType[selectedLanguage]}
          </p>
        )}

        {error && (
          <Alert className="bg-transparent" severity="error">
            {error}
          </Alert>
        )}
        <div className="w-full justify-center flex items-center">
          <button className="btn sm:w-full md:max-w-xl bg-accColor text-white">
            {profileTranslations.addLinkForm.btnText[selectedLanguage]}
          </button>
        </div>
      </form>

      {isPending && <Loader />}
    </div>
  );
}

export default AddLink;
