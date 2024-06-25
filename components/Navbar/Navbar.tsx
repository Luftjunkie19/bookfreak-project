'use client';

import { usePathname } from 'next/navigation';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

import navBarTranslation
  from '../../assets/translations/navbarTranslations.json';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useLogout } from '../../hooks/useLogout';
import LanguageSelect from './LanguageSelect';
import NotificationViewer from './NotificationViewer';
import SignInBtn from './Sign-Buttons/SignInBtn';
import SignUpBtn from './Sign-Buttons/SignUpBtn';
import UserDropDown from './User-Dropdown/UserDropDown';
import Link from 'next/link';
import { Input } from '@nextui-org/react';
import { FaSearch } from 'react-icons/fa';

function Navbar() {
  const translations = navBarTranslation;
  const languageChosen = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );

  const { user } = useAuthContext();
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  const { logout } = useLogout();
  const location = usePathname();
  const isOpened = useSelector((state: any) => state.notificationViewer.isOpened);

  const checkLocation = (linkLocation: string) => {
    if (location === linkLocation) {
      return true;
    }
  };
  const { documents } = useGetDocuments('notifications');
  const { document: documentBase } = useGetDocument('users', user ? (user).uid : '');


  const dispatch = useDispatch();

  return (
    <div className="flex sticky top-0 left-0 z-50 bg-primary-color justify-between px-4 py-2 items-center w-full">
      <div className="flex gap-2 items-center sticky top-0 left-0">
        <Link href={'/'} className=' text-white text-xl'><span className='text-secondary-color text-2xl font-bold'>B</span>ook<span className='text-secondary-color text-2xl font-bold'>F</span>reak</Link>
        <Input isClearable className='text-white sm:hidden lg:block' classNames={{
          'input': 'bg-dark-gray',
          'innerWrapper': "bg-dark-gray focus:bg-dark-gray active:bg-dark-gray ",
          'inputWrapper':'bg-dark-gray focus:bg-dark-gray active:bg-dark-gray border border-white',
          
        }} startContent={<FaSearch className='text-white text-lg'/>} />
      </div>
      {user ?
        <div className="flex items-center gap-6">
          {documentBase && 
          <UserDropDown userId={user.uid} userObject={documentBase}/>
          }
          <NotificationViewer />
          <LanguageSelect />
        </div> : <div className="flex items-center gap-5">
          <SignInBtn />
          <SignUpBtn />
          <LanguageSelect />
        </div>
      }

    </div>
  );
}

export default Navbar;
