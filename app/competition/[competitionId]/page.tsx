'use client';

import { useState } from 'react';
import CompetitionBar from 'components/left-bar/CompetitionBar';
import { increment } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import { BsFillDoorOpenFill } from 'react-icons/bs';
import {
  FaBook,
  FaFacebookMessenger,
  FaInfo,
  FaMoneyBillWave,
  FaPencilAlt,
  FaTrashAlt,
} from 'react-icons/fa';
import {
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
import Link from 'next/link';



import { functions } from '../../firebase';
import alertTranslations from '../../../assets/translations/AlertMessages.json';
import competitionTranslations
  from '../../../assets/translations/CompetitionsTranslations.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import CompetitionChat from '../../../components/chat/CommunityChat';
import Loader from '../../../components/Loader';
// import Ranking from '../../components/Ranking';
// import Warning from '../../components/WarningsComponents/Warning';
import { snackbarActions } from '../../../context/SnackBarContext';
import { warningActions } from '../../../context/WarningContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import useRealtimeDocument from '../../../hooks/useRealtimeDocument';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import BlueButton from 'components/buttons/BlueButton';

function Competition({params}:{params:{competitionId:string}}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const sendRefund=httpsCallable(functions, 'sendRefund');
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
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const { competitionId:id } = params;
  const { user } = useAuthContext();


  const { getDocument } = useRealtimeDocument();
  const navigate = useRouter();
  const { removeFromDataBase, updateDatabase, addToDataBase } =
    useRealDatabase();

  const isWarningVisible = useSelector((state:any) => state.isWarningVisible);

const {document}=useGetDocument("competitions", id);
const {documents:members}=useGetDocuments(`communityMembers/${id}/users`);

  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
 

  const competitionExpirationDate =
    document && (document.expiresAt - new Date().getTime()) / 86400000;

  const deleteCompetition = async (id) => {
    setIsPending(true);
    if (
      !document.prizeHandedIn &&
      document.prize.moneyPrize &&
      !document.prize.itemPrize &&
      competitionExpirationDate > 0
    ) {
      const userDoc = await getDocument("users", document.createdBy.id);

      const response=  await sendRefund({
        chargeId: document.chargeId,
      });

      
      const { error } = (response.data as any);

      if (error) {
        setIsPending(false);
        dispatch(snackbarActions.showMessage({message:error, alertType:"error"}));
        return;
      }

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
      dispatch(snackbarActions.showMessage({message:alertTranslations.notifications.wrong.winnerClaimError, alertType:"error"}));
      return;
    } else {
      removeFromDataBase("competitions", id);
      removeFromDataBase("communityChats", id);
      removeFromDataBase("communityMembers", id);
      setIsPending(false);
      navigate.push("/");
    }

    dispatch(snackbarActions.showMessage({message:`${alertTranslations.notifications.successfull.remove[selectedLanguage]}`, alertType:"success"}));

   
  };

  const dispatch = useDispatch();

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
      dispatch(snackbarActions.showMessage({message:`${alertTranslations.notifications.successfull.leave[selectedLanguage]}`, alertType:"success"}));
    }
  };

  const sendJoiningRequest = async () => {
    try {
      addToDataBase("notifications", `${document.id}-${new Date().getTime()}`, {
        requestContent: `${(user as User).displayName} sent a request to join ${document.competitionTitle}`,
        directedTo: `${document.createdBy.id}`,
        clubToJoin: `${document.id}`,
        isRead: false,
        requestTo: "competitions",
        notificationTime: new Date().getTime(),
        joinerData: {
          label: (user as User).displayName,
          belongsTo: document.id,
          value: {
            nickname: (user as User).displayName,
            id: (user as User).uid,
            photoURL: (user as User).photoURL,
          },
        },
      });

      console.log(members);
      dispatch(snackbarActions.showMessage({message:`${alertTranslations.notifications.successfull.send[selectedLanguage]}`, alertType:"success"}));
   
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`max-h-screen h-full overflow-y-hidden w-full flex`}
    >
      <CompetitionBar competitionId={id} />
      <div className="w-full">
       <div className="h-[calc(100vh-4rem)]  w-full overflow-y-auto p-2">

</div>
<form className="w-full flex items-center justify-around gap-2 max-h-16 h-full p-4 bg-dark-gray border-2 border-primary-color rounded-t-lg">
<textarea placeholder='Enter message...' name="message" className='sm:max-w-xs xl:max-w-md w-full resize-none max-h-12 outline-none p-2 overflow-y-hidden rounded-lg border-purple border'></textarea>
<BlueButton additionalClasses='px-6 py-2'>Send</BlueButton>
</form>
      </div>
    </div>
  )
}

export default Competition;
