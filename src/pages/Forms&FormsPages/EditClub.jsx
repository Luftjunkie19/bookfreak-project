import '../../components/stylings/mui-stylings.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router';
import CreatableSelect from 'react-select';

import { Alert } from '@mui/material';

import { storage } from '../../';
import alertMessages from '../../assets/translations/AlertMessages.json';
import formsTranslation from '../../assets/translations/FormsTranslations.json';
import Loader from '../../components/Loader';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFormRealData } from '../../hooks/useFormRealData';
import { useRealDatabase } from '../../hooks/useRealDatabase';

function EditClub() {
  const { id } = useParams();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const dispatch=useDispatch();
  const { updateDatabase } = useRealDatabase();
  const { document } = useFormRealData("readersClubs", id);
  const { user } = useAuthContext();
  const [clubsName, setClubsName] = useState("");
  const [error, setError] = useState("");
  const [attachedUsers, setAttachedUsers] = useState([]);
  const [description, setDescription] = useState("");
  const [clubLogo, setClubLogo] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [requiredPagesRead, setRequiredPagesRead] = useState(0);
  const navigate = useNavigate();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  useEffect(() => {
    if (document) {
      if (document.createdBy.id === user.uid) {    
        setClubsName(document.clubsName);
        setClubLogo(document.clubLogo);
        setDescription(document.description);
        setRequiredPagesRead(document.requiredPagesRead);
      } else {
        navigate('/');
      }
    }
  }, [document, user]);

  const notCurrentUsers = [].filter((doc) => {
    return doc.id !== user.uid;
  });

  let usersAvailable = notCurrentUsers.map((user) => {
    return {
      label: user.nickname,
      value: {
        nickname: user.nickname,
        id: user.id,
        photoURL: user.photoURL,
      },
    };
  });

  const handleSelect = (e) => {
    setError(null);
    setClubLogo(null);
    let selected = e.target.files[0];

    if (selected?.size > 200000) {
      setError(alertMessages.notficactions.wrong.tooBigFile[selectedLanguage]);
      return;
    }

    if (!selected?.type.includes("image")) {
      setError(
        alertMessages.notficactions.wrong.inAppropriateFile[selectedLanguage]
      );
      return;
    }

    if (!selected) {
      setError(
        alertMessages.notficactions.wrong.selectAnything[selectedLanguage]
      );
      return;
    }

    setError(null);
    setClubLogo(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      if (clubLogo.name) {
        const uploadPath = `clubLogo/uid${user.uid}/${clubLogo.name}`;


        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, clubLogo);
        const photoURL = await getDownloadURL(image);

        updateDatabase(
          {
            ...document,
            clubsName: clubsName,
            clubLogo: photoURL,
            description: description,
            requiredPagesRead: requiredPagesRead,
          },
          "readersClubs",
          id
        );

        attachedUsers.map(async (member) => {
          /**({
            notificationContent: `${user.displayName} has comitted some changes in ${clubsName} club`,
            directedTo: member.value.id,
            linkTo: `readers-clubs/${id}`,
            isRead: false,
            notificationTime: Timestamp.fromDate(new Date()),
            changeConcering: user.photoURL,
            sentTo: document.id,
          });**/
        });

        navigate(`/readers-clubs/${id}`);
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:"success"}));
      } else {
        updateDatabase(
          {
            ...document,
            clubsName: clubsName,
            clubLogo: clubLogo,
            description: description,
            requiredPagesRead: requiredPagesRead,
          },
          "readersClubs",
          id
        );
        attachedUsers.map(async (member) => {
          /**({
            notificationContent: `${user.displayName} has comitted some changes in ${clubsName} club`,
            directedTo: member.value.id,
            linkTo: `readers-clubs/${id}`,
            isRead: false,
            notificationTime: Timestamp.fromDate(new Date()),
            changeConcering: user.photoURL,
          });**/
        });

        setError(null);
        setIsPending(false);
        navigate(`/readers-clubs/${id}`);
        dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:'success'}))
      
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`min-h-screen h-full flex flex-col ${!isDarkModed && "pattern-bg"}`}>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onSubmit={handleSubmit}
        className={`flex flex-col gap-2 ${isDarkModed ? "text-white" : 'text-black'} p-4`}
      >
        <div className="w-full flex flex-col justify-center items-center">
          <FaUsers className="text-3xl text-center" />
          <h2 className="text-2xl text-center font-extrabold">
            {formsTranslation.topText.editClub[selectedLanguage]}
          </h2>
          <p className="font-thin text-center text-lg">
            {
              formsTranslation.topText.editCompetition.underText[
                selectedLanguage
              ]
            }
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-3">
          <div className="w-full flex flex-col">
            <p className={` text-3xl font-bold ${isDarkModed ? "text-white" : "text-black"}`}>
              General Information
            </p>
            <div className="flex w-full flex-wrap gap-4">
              <label className="flex flex-col sm:w-full md:max-w-xs xl:max-w-md">
                <span>
                  {formsTranslation.clubsNameInput.label[selectedLanguage]}:
                </span>
                <input
                  className="outline-none p-2 border-accColor rounded-md w-full"
                  type="text"
                  required
                  value={clubsName}
                  onChange={(e) => setClubsName(e.target.value)}
                />
              </label>
              <label className="flex flex-col sm:w-full md:max-w-xs xl:max-w-md">
                <span>
                  {formsTranslation.membersInput.label[selectedLanguage]}:
                </span>
                <CreatableSelect
                  className="select-input w-full"
                  isClearable
                  isSearchable
                  isMulti
                  options={usersAvailable}
                  value={attachedUsers}
                  onChange={(e) => {
                    setAttachedUsers(e);
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <p className={`text-3xl font-bold  ${isDarkModed ? "text-white" : "text-black"}`}>
              Detailed information
            </p>

            <div className="w-full flex flex-wrap items-center gap-5">
              <label className="flex flex-col sm:w-full md:max-w-xs xl:max-w-md">
                <span>
                  {formsTranslation.selectImgBtn.label[selectedLanguage]}:{" "}
                </span>
                <input
                  className="file-input file-input-bordered w-full"
                  type="file"
                  onChange={handleSelect}
                />
              </label>

              <label className="flex flex-col sm:w-full md:max-w-xs xl:max-w-md">
                <span className="label-text">
                  {formsTranslation.requiredPagesToJoin.label[selectedLanguage]}
                </span>
                <input
                  className="input border-accColor outline-none w-full"
                  placeholder={`${formsTranslation.requiredPagesToJoin.placeholder[selectedLanguage]}`}
                  type="number"
                  min={0}
                  value={requiredPagesRead}
                  step={10}
                  onChange={(e) => {
                    setRequiredPagesRead(+e.target.value);
                  }}
                />
              </label>
            </div>
          </div>

          <label className="flex flex-col w-full">
            <span className={`${isDarkModed ? "text-white" : "text-black"} font-semibold text-lg`}>
              {formsTranslation.descriptionTextarea.label[selectedLanguage]}:
            </span>
            <textarea
              className="outline-none border-2 border-accColor p-2 rounded-md resize-none sm:w-full lg:max-w-2xl xl:max-w-4xl h-48"
              required
              placeholder="Tell the users, what are you in this club doing."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
        </div>

        {error && (
          <Alert className="bg-transparent" severity="error">
            {error}
          </Alert>
        )}

        <div className="flex  w-full justify-center items-center">
          <button disabled={document && document.createdBy.id !== user.uid} className="btn bg-accColor sm:w-full md:w-3/4 lg:max-w-xl text-white mt-2">
            {formsTranslation.updateBtn[selectedLanguage]}
          </button>
        </div>
      </motion.form>
      {isPending && <Loader />}
    </div>
  );
}

export default EditClub;
