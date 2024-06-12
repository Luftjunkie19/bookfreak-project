'use client';
import { useSelector } from 'react-redux';

import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';

function NotificationViewer() {
  const { user } = useAuthContext();
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const { updateDatabase, addToDataBase } = useRealDatabase();
  const {documents}=useGetDocuments('notifications');

  
  const openedState = useSelector((state:any) => state.viewer.isOpened);

  const acceptRequest = async (notification, communityId, userData) => {
    updateDatabase(
      { ...notification, isRead: true },
      "notifications",
      `${notification.clubToJoin}-${notification.notificationTime}`
    );

    addToDataBase(
      `communityMembers/${communityId}/users`,
      userData.value.id,
      userData
    );

    console.log(communityId, userData);
  };

  const readNotification = (notification) => {
    updateDatabase(
      {
        ...notification,
        isRead: true,
      },
      "notifications",
      `${notification.notificationId}-${notification.notificationTime}`
    );
  };
  return (
    <div>
      Notification Bell
    </div>
  );
}

export default NotificationViewer;