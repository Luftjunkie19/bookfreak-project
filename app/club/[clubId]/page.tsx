'use client';


import { useState } from 'react';

import { BsFillDoorOpenFill } from 'react-icons/bs';
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
  FaUserPlus,
} from 'react-icons/fa';
import {
  FaUsers,
  FaX,
} from 'react-icons/fa6';
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


import alertTranslations from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/ClubsTranslations.json';
import formsTranslations
  from '../../../assets/translations/FormsTranslations.json';
import reusableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import CompetitionChat from '../../../components/chat/CommunityChat';
import { snackbarActions } from '../../../context/SnackBarContext';
import { warningActions } from '../../../context/WarningContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import useRealtimeDocuments from '../../../hooks/useRealtimeDocuments';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import ClubBar from 'components/Sidebars/ClubBar';

function Club({params}:{params:{clubId:string}}) {
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const { clubId:id } = params;
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const navigate = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  const { getDocuments } = useRealtimeDocuments();
  const { removeFromDataBase, addToDataBase } = useRealDatabase();
  const [message, setMessage] = useState<{open:boolean, message:string | null}>({ open: false, message: null });
  const {document}=useGetDocument("readersClubs", id);
 const {documents: members}=useGetDocuments(`communityMembers/${id}/users`);



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
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const open = Boolean(anchorEl);
  const openMangement = Boolean(managmentEl);


  const deleteClub = async (id) => {
    removeFromDataBase("readersClubs", id);
    removeFromDataBase("communityChats", id);
    removeFromDataBase("communityMembers", id);

    navigate.push("/");
    dispatch(snackbarActions.showMessage({message:`${ alertTranslations.notifications.successfull.remove[selectedLanguage]}`, alertType:"success"}));

  };

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
    } else {
      removeFromDataBase(`communityMembers/${id}/users`, (user as User).uid);
    }

    navigate.push("/");
    setMessage({
      open: true,
      message:
        alertTranslations.notifications.successfull.leave[selectedLanguage],
    });
  };

  const sendJoiningRequest = async () => {
    try {
      const ClubswithMembers = await getDocuments("communityMembers");

      const membersOfClubsEls = (ClubswithMembers as any[]).map((club) => {
        return club.users;
      });

      const allMembersEls = membersOfClubsEls.map((object) => {
        return Object.values(object);
      });

      const finalConversion = allMembersEls.flat();

      if (
        finalConversion.find(
          (member:any) =>
            member.value.id === (user as User).uid &&
            member.belongsTo.includes("readersClub")
        )
      ) {
        setMessage({
          open: true,
          message:
            alertTranslations.notifications.wrong.loyality[selectedLanguage],
        });

        return;
      }

      addToDataBase("notifications", `${document.id}-${new Date().getTime()}`, {
        requestContent: `${(user as User).displayName} sent a request to join ${document.clubsName}`,
        directedTo: `${document.createdBy.id}`,
        clubToJoin: `${document.id}`,
        isRead: false,
        requestTo: "readersClubs",
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

      setMessage({
        open: true,
        message:
          alertTranslations.notifications.successfull.send[selectedLanguage],
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`w-full h-screen flex `}
    >
   
   

    </div>
  );
}

export default Club;
