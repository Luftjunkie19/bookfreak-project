import React, {
  useEffect,
  useState,
} from 'react';

import {
  GiBookmarklet,
  GiHamburgerMenu,
} from 'react-icons/gi';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { Link } from 'react-router-dom';

import languageTranslation
  from '../../assets/translations/navbarTranslations.json';
import { burgerActions } from '../../context/BurgerContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import LanguageSelect from './LanguageSelect';

function UnloggedNavbar() {
  const { user } = useAuthContext();
  const [isSticky, setIsSticky] = useState(false);
  const selectedLangugage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const burgerState = useSelector((state) => state.hamburger.isUnloggedOpened);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIfScrolled = () => {
      const scrolledLevel = document.body.getBoundingClientRect();

      if (scrolledLevel.y <= -50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", checkIfScrolled);

    return () => {
      window.removeEventListener("scroll", checkIfScrolled);
    };
  }, []);

  return (
    <>
      <div
        className={`${
          isSticky ? "sticky top-0 left-0 z-50 scrolled" : ""
        } flex justify-between items-center px-3 py-4 bg-primeColor text-neutral-50 rounded-b-lg w-screen`}
      >
        <Link
          to="/"
          className="flex justify-around items-center group hover:tracking-wider"
        >
          <GiBookmarklet className="text-3xl font-bold group-hover:text-accColor group-hover:-translate-y-1 transition-all duration-200 delay-300 group-hover:text-4xl" />
          <h2 className="font-thin text-2xl">
            <span className="font-extrabold group-hover:text-accColor transition-all duration-300">
              B
            </span>
            <span className="transition-all duration-300 delay-75 group-hover:text-accColor">
              ook
            </span>
            <span className="font-extrabold transition-all duration-300 delay-100 group-hover:text-accColor">
              F
            </span>
            <span className="transition-all duration-300 delay-150 group-hover:text-accColor">
              reak
            </span>
          </h2>
        </Link>

        {!user && (
          <>
            <ul className="justify-around items-center gap-6 sm:hidden xl:flex">
              <li>
                <LanguageSelect />
              </li>

              <li className=" text-neutral-50">
                <Link to="/sign-up">
                  {
                    languageTranslation.unloggedNavbar.register[
                      selectedLangugage
                    ]
                  }
                </Link>
              </li>

              <li className=" text-neutral-50">
                <Link to="/login">
                  {languageTranslation.unloggedNavbar.login[selectedLangugage]}
                </Link>
              </li>
            </ul>

            <button
              onClick={() => {
                dispatch(burgerActions.toggleUnloggedBurger());
                console.log(burgerState);
              }}
              className="sm:block xl:hidden btn bg-transparent border-none text-lg"
            >
              <GiHamburgerMenu />
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default UnloggedNavbar;
