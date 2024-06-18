import '../stylings/backgrounds.css';

/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';

import generateUniqueId from 'react-id-generator';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';



import alertMessages from '../../../../assets/translations/AlertMessages.json';
import formTranslations from '../../../../assets/translations/FormsTranslations.json';
import profileTranslations
  from '../../../../assets/translations/ProfileTranslations.json';
import Loader from '../../../../components/Loader';
import { snackbarActions } from '../../../../context/SnackBarContext';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import useGetDocuments from '../../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../../hooks/useRealDatabase';
import useRealtimeDocument from '../../../../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../../../../hooks/useRealtimeDocuments';
import { User } from 'firebase/auth';

function LinkSettingsPage() {
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
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
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);

 const {documents}=useGetDocuments('links');

 const links = documents.map((bookReader) => {
  return bookReader;
})
.filter((reader) => reader.belongsTo === (user as User).uid);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const uniqueId = generateUniqueId(
        `${option}${new Date().getTime()}${(user as User).uid}`
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
          belongsTo: (user as User).uid,
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
          belongsTo: (user as User).uid,
          id: uniqueId,
        });
      }

      setError(null);
      setIsPending(false);
      navigate(`/profile/${(user as User).uid}`);
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
  

      {isPending && <Loader />}
    </div>
  );
}

export default LinkSettingsPage;
