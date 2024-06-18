import '../../components/stylings/mui-stylings.css';

import React, {
  useEffect,
  useState,
} from 'react';

import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { FaX } from 'react-icons/fa6';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router';



import alertMessages from '../../../../assets/translations/AlertMessages.json';
import formsTranslation from '../../../../assets/translations/FormsTranslations.json';
import Loader from '../../../../components/Loader';
import { snackbarActions } from '../../../../context/SnackBarContext';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useFormRealData } from '../../../../hooks/useFormRealData';
import { useRealDatabase } from '../../../../hooks/useRealDatabase';
import { User } from 'firebase/auth';

function EditCompetition() {
  const dispatch=useDispatch();
  const { id } = useParams();
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const { updateDatabase } = useRealDatabase();
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [competitionsName, setCompetitionsName] = useState("");
  const [error, setError] = useState<null | string>("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [description, setDescription] = useState("");
  const [openState, setOpenState] = useState({
    open: false,
    message: "",
  });
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const { document } = useFormRealData("competitions", id);

  useEffect(() => {
    if (document) {
      if (document.createdBy.id === (user as User).uid) {
        setTitle(document.competitionTitle);
        setCompetitionsName(document.competitionsName);
        setDescription(document.description);
        setExpirationDate(document.expiresAt);
      } else {
        navigate('/');
      }
    }
  }, [document, navigate, user]);

  const competitionTypes = [
     "First read, first served",
    "Lift others, rise",
    
    "Teach to fish"
  ];

  const editCompetition = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    if (!expirationDate || expirationDate - new Date().getTime() <= 0) {
      setOpenState({
        open: true,
        message: "Cannot be set earlier date than today",
      });
      return;
    }

    updateDatabase(
      {
        ...document,
        competitionTitle: title,
        competitionsName: competitionsName,
        description: description,
        expiresAt: expirationDate,
      },
      "competitions",
      id
    );

    setError(null);
    setIsPending(false);
    navigate(`/competition/${id}`);
   dispatch(snackbarActions.showMessage({message:alertMessages.notifications.successfull.update[selectedLanguage], alertType:"success"}))
 
  };
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  return (
    <>
      <motion.div
        className={`min-h-screen h-full flex w-full flex-col ${!isDarkModed && "pattern-bg"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
     
      </motion.div>
      {isPending && <Loader />}
      
    </>
  );
}

export default EditCompetition;
