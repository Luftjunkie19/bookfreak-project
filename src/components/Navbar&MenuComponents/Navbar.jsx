import '../stylings/effects.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  FaBell,
  FaComments,
  FaHome,
  FaSearch,
  FaUserAlt,
} from 'react-icons/fa';
import {
  GiBookmarklet,
  GiHamburgerMenu,
} from 'react-icons/gi';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Link,
  useLocation,
} from 'react-router-dom';

import navBarTranslation
  from '../../assets/translations/navbarTranslations.json';
import { burgerActions } from '../../context/BurgerContext';
import { viewerActions } from '../../context/ViewerContext';
import { useLogout } from '../../hooks/useLogout';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';
import CreateBtn from './CreateBtn';
import LanguageSelect from './LanguageSelect';

function Navbar({ user }) {
  const translations = navBarTranslation;
  const languageChosen = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const { logout } = useLogout();
  const location = useLocation();
  const isOpened = useSelector((state) => state.notificationViewer.isOpened);
  const [documentBase, setDocumentBase] = useState(null);
  const { getDocument } = useRealtimeDocument();
  const checkLocation = (linkLocation) => {
    if (location.pathname === linkLocation) {
      return true;
    }
  };
  const { getDocuments } = useRealtimeDocuments();
  const [documents, setDocuments] = useState([]);
  /* eslint-disable react-hooks/exhaustive-deps */
  const loadNotifications = async () => {
    const notificationsEl = await getDocuments("notifications");

    if (notificationsEl) {
      setDocuments(notificationsEl);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const effectFunction = async () => {
    const userDoc = await getDocument("users", user.uid);

    if (userDoc && user) {
      setDocumentBase(userDoc);
    } else {
      setDocumentBase(null);
    }
  };

  useEffect(() => {
    effectFunction();
    loadNotifications();
  }, [effectFunction, loadNotifications]);

  const dispatch = useDispatch();

  return (
    <>
      <div
        className={`
             sticky top-0 left-0 scrolled 
           ${!isDarkModed ? "bg-primeColor" : "bg-accColor"}
         flex justify-between items-center px-3 py-2 bg-accColor text-neutral-50 w-screen z-[99999] transition-all duration-500`}
      >
        <Link
          to="/"
          className="flex justify-around items-center group hover:tracking-widest"
        >
          <GiBookmarklet className={`text-3xl font-bold ${isDarkModed ? "group-hover:text-primeColor" : "group-hover:text-accColor"} group-hover:-translate-y-1 transition-all duration-200 group-hover:text-4xl`}/>
          <h2 className="font-thin sm:text-lg md:text-2xl">
            <span className={`font-extrabold ${isDarkModed ? "group-hover:text-primeColor" : "group-hover:text-accColor"}  transition-all duration-300 delay-[150ms]`}>
              B
            </span>
            <span className="transition-all duration-300 delay-[250ms] group-hover:font-medium group-hover:text-yellow-400">
              o
            </span>
            <span className="transition-all duration-300 delay-[350ms] group-hover:font-medium group-hover:text-yellow-400">
              o
            </span>
            <span className="transition-all duration-300 delay-500 group-hover:font-medium group-hover:text-yellow-400">
              k
            </span>
            <span className={`font-extrabold transition-all duration-300 delay-700 ${isDarkModed ? "group-hover:text-primeColor" : "group-hover:text-accColor"}`}>
              F
            </span>
            <span className="transition-all duration-300 delay-[800ms] group-hover:font-medium group-hover:text-yellow-400">
              r
            </span>
            <span className="transition-all duration-300 delay-[825ms] group-hover:font-medium group-hover:text-yellow-400">
              e
            </span>
            <span className="transition-all duration-300 delay-[850ms] group-hover:font-medium group-hover:text-yellow-400">
              a
            </span>
            <span className="transition-all duration-300 delay-[900ms] group-hover:font-medium group-hover:text-yellow-400">
              k
            </span>
          </h2>
        </Link>

        {user && documentBase && (
          <div className="sm:flex md:flex lg:flex xl:hidden">
            <button
              className="btn border-none text-neutral-50 bg-transparent shadow-none hover:bg-modalPrimeColor"
              onClick={() => {
                dispatch(viewerActions.toggleState());
              }}
            >
              <FaBell className=" text-yellow-400 text-base" />
              {documents.length > 0 &&
                documents.filter(
                  (doc) => !doc?.isRead && doc.directedTo === user.uid
                ).length > 0 && (
                  <div className="badge text-yellow-400 bg-transparent border-none">
                    +
                    {
                      documents.filter(
                        (doc) => !doc?.isRead && doc.directedTo === user.uid
                      ).length
                    }
                  </div>
                )}
            </button>

            <button
              className="btn bg-transparent text-xl shadow-none border-none hover:bg-modalPrimeColor mx-2 text-neutral-50"
              onClick={() => {
                dispatch(burgerActions.toggleBurger());
              }}
            >
              <GiHamburgerMenu />
            </button>
          </div>
        )}

        {user && documentBase && (
          <>
            <div className="xl:flex sm:hidden items-center gap-6">
              <LanguageSelect />

              <Link
                to="/"
                className={
                  checkLocation("/")
                    ? `btn text-2xl mx-1 ${isDarkModed ? "bg-primeColor" : "bg-accColor"} text-neutral-50  border-none`
                    : `btn bg-transparent border-none text-2xl mx-1 text-neutral-50 ${isDarkModed ? "hover:bg-primeColor" : "hover:bg-accColor"}`
                }
              >
                <FaHome />
              </Link>

              <Link
                to={`/profile/${user.uid}`}
                className={
                  checkLocation(`/profile/${user.uid}`)
                    ? `btn text-2xl mx-1 ${isDarkModed ? "bg-primeColor" : "bg-accColor"} text-neutral-50  border-none`
                    : `btn bg-transparent border-none text-2xl mx-1 text-neutral-50 ${isDarkModed ? "hover:bg-primeColor" : "hover:bg-accColor"}`
                }
              >
                <FaUserAlt />
              </Link>

              <CreateBtn />

              <Link
                to="/your-chats"
                className={
                  checkLocation(`/your-chats`)
                    ? `btn text-2xl mx-1 ${isDarkModed ? "bg-primeColor" : "bg-accColor"} text-neutral-50  border-none`
                    : `btn bg-transparent border-none text-2xl mx-1 text-neutral-50 ${isDarkModed ? "hover:bg-primeColor" : "hover:bg-accColor"}`
                }
              >
                <FaComments />
              </Link>

              <button
                className={`btn ${
                  !isOpened && "bg-transparent"
                } text-2xl mx-1 border-none  ${isDarkModed ? "hover:bg-primeColor" : "hover:bg-accColor"} ${
                  isOpened && "bg-primeColor"
                }`}
                onClick={() => {
                  dispatch(viewerActions.toggleState());
                }}
              >
                <FaBell
                  className={isOpened ? "text-yellow-400" : "text-neutral-50"}
                />

                {documents.length > 0 &&
                  documents.filter(
                    (doc) => !doc?.isRead && doc.directedTo === user.uid
                  ).length > 0 && (
                    <div className="badge text-yellow-400 bg-transparent border-none">
                      +
                      {
                        documents.filter(
                          (doc) => !doc?.isRead && doc.directedTo === user.uid
                        ).length
                      }
                    </div>
                  )}
              </button>

              <Link
                to="/search"
                className={
                  checkLocation(`/search`)
                    ? `btn text-2xl mx-1 ${isDarkModed ? "bg-primeColor" : "bg-accColor"} text-neutral-50  border-none`
                    : `btn bg-transparent border-none text-2xl mx-1 text-neutral-50 ${isDarkModed ? "hover:bg-primeColor" : "hover:bg-accColor"}`
                }
              >
                <FaSearch />
              </Link>

              <button
                className="btn bg-error hover:bg-darkRed transition-all duration-500 text-neutral-50 mx-1 border-none"
                onClick={logout}
              >
                {translations.hamburgerMenu.logOut[languageChosen]}{" "}
                <RiLogoutBoxRFill />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Navbar;
