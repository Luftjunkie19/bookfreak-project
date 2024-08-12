'use client';

import { useState } from 'react';
import image from '../../../assets/Logo.png'
import classes from '../../../stylings/gradient.module.css' 
import CompetitionBar from 'components/Sidebars/left/CompetitionLeftBar';
import { increment } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import { BsFillDoorOpenFill, BsListTask } from 'react-icons/bs';
import {
  FaBook,
  FaBookOpen,
  FaFacebookMessenger,
  FaInfo,
  FaMoneyBillWave,
  FaPencilAlt,
  FaTasks,
  FaTrashAlt,
  FaUserFriends,
} from 'react-icons/fa';
import {
  FaClockRotateLeft,
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
import { useRealDocument } from 'hooks/firestore/useGetRealDocument';
import Image from 'next/image';
import Button from 'components/buttons/Button';
import { IoChatbubbles } from 'react-icons/io5';
import { GiCrane } from 'react-icons/gi';
import CompetitionAd from 'components/advertisements/CompetitionAd';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import Slide from 'components/home/swipers/base-swiper/Slide';
import { Pagination } from 'swiper/modules';
import { Swiper } from 'swiper/react';

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

const {document}=useRealDocument("competitions", id);
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
      className={`h-screen overflow-y-auto overflow-x-hidden w-full`}
    >
      <div className={`relative w-full ${classes['light-blue-gradient']} top-0 left-0 h-64 `}>
          {document && 
        <div className="absolute z-10 -bottom-16 flex gap-6 items-center  left-0 m-3">
            <Image src={image} alt='' width={60} height={60} className='w-44 z-10 h-44 object-cover rounded-lg' />
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-bold text-white">{document.competitionName}</p>
              <p>{document.members.length} Members</p>
              <div className="flex">
                <Image src={image} alt='' width={60} height={60} className='w-6 h-6 object-cover rounded-full' />
                <Image src={image} alt='' width={60} height={60} className='w-6 h-6 object-cover rounded-full' />
                <Image src={image} alt='' width={60} height={60} className='w-6 h-6 object-cover rounded-full' />
              </div>
            </div>
          
        </div>
          }
      </div>

      <div className="flex justify-end items-center gap-2 p-2">
        <Button additionalClasses='px-6 py-[0.375rem]' type={'blue'} >
Share
        </Button>
           <Button additionalClasses='px-6 py-[0.375rem]' type={'white-blue'} >
Request To Join
        </Button>
</div>

      <div className="flex overflow-x-hidden overflow-y-hidden  gap-4 w-full">
        
        <div className="flex flex-col my-4 mx-2 gap-3 max-w-sm w-full">
          <div className="w-full h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaClockRotateLeft /> Activity</p>
            <div className="flex items-center gap-6">
              <IoChatbubbles className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>10 New Messages Today</p>
                <p className='text-sm font-extralight'>In last Month 1.2k Messages</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <FaUserFriends className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>19 Members Together</p>
                <p className='text-sm font-extralight'>Yesterday 0 new members</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <GiCrane  className="text-primary-color text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>Estimated 3 years ago</p>
                <p className='text-xs font-extralight'>Est. 19th of March 2021</p>
              </div>
            </div>
          </div>
              <div className="w-full h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaClockRotateLeft /> Activity</p>
            <div className="flex items-center gap-6">
              <IoChatbubbles className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>10 New Messages Today</p>
                <p className='text-sm font-extralight'>In last Month 1.2k Messages</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <FaUserFriends className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>19 Members Together</p>
                <p className='text-sm font-extralight'>Yesterday 0 new members</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <GiCrane  className="text-primary-color text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>Estimated 3 years ago</p>
                <p className='text-xs font-extralight'>Est. 19th of March 2021</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-1 overflow-x-hidden max-w-4xl w-full">
          <div className="flex flex-col gap-1">
            <p className='text-white text-xl'>The Prize</p>
          <div className="flex gap-3 p-1 w-full items-center">
               <div className="w-full max-w-xs h-72 bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
          
          </div>

               <div className="w-full max-w-xs h-72 bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
           
          </div>
           </div>
         </div>
           <div className="flex flex-col gap-1 p-1 h-full w-full">
            <p className='text-xl flex gap-2 items-center  font-semibold text-white'><FaBookOpen className='text-white' /> Reading Activity of the users</p>
            <Swiper modules={[Pagination]} className='w-full max-w-3xl' spaceBetween={8}>
      <Slide>
        <div className='bg-red-400 w-1/2'>

        </div>
      </Slide>

<Slide>
  <div className='bg-red-400 w-1/2'></div>
</Slide>

    </Swiper>
      </div>
  </div>
</div>
      
     
 
    </div>
  )
}

export default Competition;
