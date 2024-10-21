'use client';
import { FaBell } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import image from 'assets/about-image.jpg'
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from 'hooks/useLogout';
import {motion} from 'framer-motion'
import { viewerActions } from 'context/ViewerContext';
import Button from 'components/buttons/Button';
import { FaCheck } from 'react-icons/fa6';
import { MdCancel } from 'react-icons/md';
import Image from 'next/image';
import Notification from './notification/Notification';

function NotificationViewer() {
  const { user } = useAuthContext();
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );

  const openedState = useSelector((state: any) => state.viewer.isOpened);

  const dispatch=useDispatch();


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

  const openDialog=()=>{
    dispatch(viewerActions.toggleState())
  }

  return (
    <div className='relative top-0 left-0' >
      <FaBell onClick={openDialog} size={24} className={` transition-all duration-500 ${openedState ? 'text-yellow-500' : 'text-white'}`} />
    
    <motion.div  animate={{
      'scale': openedState ? 1 : 0,
      opacity:openedState ? 1 : 0,
      x: openedState ? -250 : -200,
      y: openedState ? 15 : 50,
      zIndex:999,
      type:'spring',
      
    }} className="absolute flex-col gap-2 flex min-w-96 max-w-96 border-primary-color border-2 p-2 w-full max-h-80 min-h-72 bg-dark-gray rounded-lg">
      <p className='text-white text-xl'>Notifications</p>
      <div className="flex items-center gap-2">
        <Button additionalClasses='px-3' type='white-blue'>All</Button>
        <Button type='blue'>Unread</Button>
      </div>
      <div className="flex flex-col gap-2 w-full h-full overflow-y-auto">
       <Notification image={image} description={`Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur repudiandae, non amet laudantium repellat facere numquam quidem autem distinctio. Culpa error dolores quos, hic aliquid ut magni, qui sequi officiis reprehenderit facilis. Reiciendis, provident voluptate libero ratione cumque nostrum magnam?
`} linkPath={'/path'} isFriendshipRequest={false} senderId={''}  />
      <Notification image={image} description={`Użytkownik Blah Blah, has sent you an friendship request.`} linkPath={'/path'} isFriendshipRequest={true} senderId={''}  />

      </div>
    </motion.div>
    </div>
  );
}

export default NotificationViewer;