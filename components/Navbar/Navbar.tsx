'use client';

import { usePathname } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import { Input } from '@nextui-org/react';

import navBarTranslation
  from '../../assets/translations/navbarTranslations.json';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useLogout } from '../../hooks/useLogout';
import CreateBtn from './CreateBtn';
import LanguageSelect from './LanguageSelect';
import NotificationViewer from './NotificationViewer';

function Navbar() {
  const translations = navBarTranslation;
  const languageChosen = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const { user } = useAuthContext();
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const { logout } = useLogout();
  const location = usePathname();
  const isOpened = useSelector((state:any) => state.notificationViewer.isOpened);

  const checkLocation = (linkLocation) => {
    if (location === linkLocation) {
      return true;
    }
  };
const {documents}=useGetDocuments('notifications');
const {document: documentBase}=useGetDocument('users', user ? (user).uid : '');


  const dispatch = useDispatch();

  return (
    <div className="flex bg-primary-color justify-between px-4 py-2 items-center w-full">
      <div className="flex gap-2 items-center sticky top-0 left-0">
        <p className=' text-white text-xl'><span className='text-secondary-color text-2xl font-bold'>B</span>ook<span className='text-secondary-color text-2xl font-bold'>F</span>reak</p>
        <Input startContent={<FaSearch className='text-white'/>} />
      </div>
      {user ?     
<div className="flex items-center gap-2">
        <CreateBtn />
        <NotificationViewer />
        <LanguageSelect />
        </div> : <div>
          
           <LanguageSelect />
      </div>
      }
      
    </div>
  );
}

export default Navbar;
