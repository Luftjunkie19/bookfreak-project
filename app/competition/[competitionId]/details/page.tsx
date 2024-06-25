'use client';

import React, { useState } from 'react';

import { increment } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import { BsFillDoorOpenFill } from 'react-icons/bs';
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
} from 'react-icons/fa';
import {
  FaBook,
  FaMoneyBillWave,
  FaTicket,
  FaTicketSimple,
  FaUser,
} from 'react-icons/fa6';
import { FiType } from 'react-icons/fi';
import { GrUserManager } from 'react-icons/gr';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router';
import Link  from 'next/link';


import { functions } from '../../../firebase';
import alertMessages from '../../../../assets/translations/AlertMessages.json';
import competitionTranslations
  from '../../../../assets/translations/CompetitionsTranslations.json';
import translations
  from '../../../../assets/translations/CompetitionsTranslations.json';
import formsTranslations
  from '../../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../../assets/translations/ReusableTranslations.json';
import { snackbarActions } from '../../../../context/SnackBarContext';
import { warningActions } from '../../../../context/WarningContext';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import useGetDocument from '../../../../hooks/useGetDocument';
import useGetDocuments from '../../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../../hooks/useRealDatabase';
import useRealtimeDocument from '../../../../hooks/useRealtimeDocument';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

function GeneralInfo({ params }:{params:{competitionId:string}}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { getDocument } = useRealtimeDocument();
  const { removeFromDataBase, updateDatabase } = useRealDatabase();
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const sendRefund=httpsCallable(functions, "sendRefund");
const dispatch=useDispatch();
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

  const { competitionId:id } = params;
  const { user } = useAuthContext();

  const navigate = useRouter();
  const { document } = useGetDocument("competitions", id);
  const { documents: members } = useGetDocuments(
    `communityMembers/${id}/users`
  );

  const competitionExpirationDate =
    document && (document.expiresAt - new Date().getTime()) / 86400000;

  const deleteCompetition = async (id) => {
    setIsPending(true);
    if (
      competitionExpirationDate > 0 &&
      !document.prizeHandedIn &&
      document.prize.moneyPrize &&
      !document.prize.itemPrize
    ) {
      const userDoc = await getDocument("users", document.createdBy.id);

      const response =  await sendRefund({
        chargeId: document.chargeId,
      });
   

      const { error } =  response.data as any;

      if (error) {
        setIsPending(false);
        dispatch(snackbarActions.showMessage({message:error, alertType:"error"}));
        return;
      }
      console.log(error, userDoc);

      updateDatabase(
        {
          ...userDoc,
          creditsAvailable: {
            ...userDoc.creditsAvailable,
            valueInMoney: increment(document.prize.moneyPrize.amount),
            balance: {
              ...userDoc.creditsAvailable.balance,
              0: {
                ...userDoc.creditsAvailable.balance["0"],
                amount: increment(document.prize.moneyPrize.amount),
              },
            },
          },
        },
        "users",
        userDoc.id
      );
      removeFromDataBase("competitions", id);
      removeFromDataBase("communityChats", id);
      removeFromDataBase("communityMembers", id);
      setIsPending(false);
      navigate.push("/");
    }

    if (
      competitionExpirationDate <= 0 &&
      !document.prizeHandedIn &&
      document.prize.moneyPrize &&
      !document.prize.itemPrize
    ) {
      setIsPending(false);
      dispatch(snackbarActions.showMessage({message:"The winner has to claim the reward", alertType:"error"}));
      return;
    } else {
      removeFromDataBase("competitions", id);
      removeFromDataBase("communityChats", id);
      removeFromDataBase("communityMembers", id);
      setIsPending(false);
      navigate.push("/");
    }
    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.remove[selectedLanguage]}`, alertType:"success"}))
  };


  const leaveCompetition = async () => {
    const arrayWithoutYou = members.filter((doc) => doc.value.id !== (user as User).uid);

    if (arrayWithoutYou && document.createdBy.id === (user as User).uid) {
      dispatch(
        warningActions.openWarning({
          referedTo: document.id,
          typeOf: document.competitionTitle,
          collection: "competitions",
        })
      );
    } else {
      removeFromDataBase("communityMembers", `${id}/users/${(user as User).uid}`);
      navigate.push("/");
      dispatch(snackbarActions.showMessage({message:`${ alertMessages.notifications.successfull.leave[selectedLanguage]}`, alertType:"success"}));
    }
  };

  const isWarningVisible = useSelector((state:any) => state.isWarningVisible);
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  return (
    <div className={`min-h-screen h-full`}>
     
    </div>
  );
}

export default GeneralInfo;
