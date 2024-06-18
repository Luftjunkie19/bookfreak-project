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


import { storage } from '../../../firebase';
import alertMessages from '../../../../assets/translations/AlertMessages.json';
import formsTranslation from '../../../../assets/translations/FormsTranslations.json';
import Loader from '../../../../components/Loader';
import { snackbarActions } from '../../../../context/SnackBarContext';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useFormRealData } from '../../../../hooks/useFormRealData';
import { useRealDatabase } from '../../../../hooks/useRealDatabase';
import { User } from 'firebase/auth';

function EditClub() {
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const dispatch=useDispatch();
  const { updateDatabase } = useRealDatabase();
  const { document } = useFormRealData("readersClubs", id);
  const { user } = useAuthContext();
  const [clubsName, setClubsName] = useState("");
  const [error, setError] = useState<string | null>("");
  const [attachedUsers, setAttachedUsers] = useState([]);
  const [description, setDescription] = useState("");
  const [clubLogo, setClubLogo] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [requiredPagesRead, setRequiredPagesRead] = useState(0);
  const navigate = useNavigate();
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  useEffect(() => {
    if (document) {
      if (document.createdBy.id === (user as User).uid) {    
        setClubsName(document.clubsName);
        setClubLogo(document.clubLogo);
        setDescription(document.description);
        setRequiredPagesRead(document.requiredPagesRead);
      } else {
        navigate('/');
      }
    }
  }, [document, user]);

  const notCurrentUsers = [].filter((doc:any) => {
    return doc.id !== (user as User).uid;
  });

  let usersAvailable = notCurrentUsers.map((user:any) => {
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
      setError(alertMessages.notifications.wrong.tooBigFile[selectedLanguage]);
      return;
    }

    if (!selected?.type.includes("image")) {
      setError(
        alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]
      );
      return;
    }

    if (!selected) {
      setError(
        alertMessages.notifications.wrong.selectAnything[selectedLanguage]
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
      if (clubLogo && clubLogo.name) {
        const uploadPath = `clubLogo/uid${(user as User).uid}/${clubLogo.name}`;


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
    <div className={`min-h-screen h-full flex flex-col`}>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onSubmit={handleSubmit}
        className={`flex flex-col gap-2 p-4`}
      >

      </motion.form>
      {isPending && <Loader />}
    </div>
  );
}

export default EditClub;
