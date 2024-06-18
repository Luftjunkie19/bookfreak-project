import '../stylings/scrollbarStyling.css';

import React, { useState } from 'react';

import { BsFillDoorOpenFill } from 'react-icons/bs';
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
} from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa6';
import {
  GiBookmarklet,
  GiRibbonShield,
} from 'react-icons/gi';
import { GrUserManager } from 'react-icons/gr';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';


import alertMessages from '../../../../assets/translations/AlertMessages.json';
import translations from '../../../../assets/translations/ClubsTranslations.json';
import formsTranslations
  from '../../../../assets/translations/FormsTranslations.json';
import reusableTranslations
  from '../../../../assets/translations/ReusableTranslations.json';
import { snackbarActions } from '../../../../context/SnackBarContext';
import { warningActions } from '../../../../context/WarningContext';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import useGetDocument from '../../../../hooks/useGetDocument';
import useGetDocuments from '../../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../../hooks/useRealDatabase';
import { User } from 'firebase/auth';
import Image from 'next/image';

function OverallClub() {
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleOpenManagement = (e) => {
    setManagmentEl(e.currentTarget);
  };

  const handleCloseManagent = () => {
    setManagmentEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const openMangement = Boolean(managmentEl);
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { removeFromDataBase } = useRealDatabase();
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
const {document}=useGetDocument("readersClubs", id); 
const {documents: members}=useGetDocuments(`communityMembers/${id}/users`);

  const leaveClub = async () => {
    const arrayWithoutYou = members.filter((doc) => doc.value.id !== (user as User).uid);

    if (arrayWithoutYou && document.createdBy.id === (user as User).uid) {
      dispatch(
        warningActions.openWarning({
          referedTo: document.id,
          typeOf: document.clubsName,
          collection: "readersClubs",
        })
      );
      return;
    }

    navigate("/");
    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.leave[selectedLanguage]}`, alertType:"success"}));
  };

  const deleteClub = async (id) => {
    removeFromDataBase("readersClubs", id);
    removeFromDataBase("communityChats", id);
    removeFromDataBase("communityMembers", id);

    navigate("/");
    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:"success"}));
  };

  return (
    <div className={`min-h-screen h-full`}>
     

    </div>
  );
}

export default OverallClub;
