'use client';
import { FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from 'hooks/useLogout';

function NotificationViewer() {
  const { user } = useAuthContext();
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );


  const openedState = useSelector((state: any) => state.viewer.isOpened);

  const acceptRequest = async (notification, communityId, userData) => {
    // updateDatabase(
    //   { ...notification, isRead: true },
    //   "notifications",
    //   `${notification.clubToJoin}-${notification.notificationTime}`
    // );

    // addToDataBase(
    //   `communityMembers/${communityId}/users`,
    //   userData.value.id,
    //   userData
    // );

    console.log(communityId, userData);
  };

  const readNotification = (notification) => {
    // updateDatabase(
    //   {
    //     ...notification,
    //     isRead: true,
    //   },
    //   "notifications",
    //   `${notification.notificationId}-${notification.notificationTime}`
    // );
  };
 

  return (
    <button>
      <FaBell size={24} className="text-white" />
    </button>
  );
}

export default NotificationViewer;