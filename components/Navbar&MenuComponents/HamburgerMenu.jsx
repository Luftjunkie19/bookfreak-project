import { FaComments, FaHome, FaSearch, FaUser } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import languageTranslation from "../../assets/translations/navbarTranslations.json";
import { burgerActions } from "../../context/BurgerContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import CreateBtn from "./CreateBtn";
import LanguageSelect from "./LanguageSelect";

function HamburgerMenu() {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const translations = languageTranslation;
  const selectedLangugage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { logout } = useLogout();
  const isBurgerOpened = useSelector((state) => state.hamburger.isOpened);

  return (
    <div
      className={`fixed w-screen h-full z-50 right-0 bg-modalPrimeColor text-white py-2 ${
        isBurgerOpened
          ? "opacity-100 transition-all duration-500 z-[100] translate-x-0"
          : "opacity-0 transition-all duration-500 translate-x-full"
      }`}
    >
      <div className="h-3/4 flex flex-col justify-around items-center z-50">
        <Link
          to="/"
          onClick={() => {
            dispatch(burgerActions.closedBurger());
          }}
          className="flex items-center justify-around w-1/2 hover:font-extrabold hover:text-xl transition-all duration-500"
        >
          <FaHome className="text-2xl font-semibold mr-2" />
          {translations.hamburgerMenu.home[selectedLangugage]}
        </Link>

        <Link
          to={`/profile/${user.uid}`}
          onClick={() => {
            dispatch(burgerActions.closedBurger());
          }}
          className="flex items-center justify-around w-2/5 hover:font-extrabold hover:text-xl transition-all duration-500"
        >
          <FaUser className="text-xl font-extrabold" />
          {translations.hamburgerMenu.profile[selectedLangugage]}
        </Link>

        <Link
          to="/your-chats"
          className="flex items-center justify-around w-2/5 hover:font-extrabold hover:text-xl transition-all duration-500"
          onClick={() => {
            dispatch(burgerActions.closedBurger());
          }}
        >
          <FaComments className="text-xl font-extrabold" />
          {translations.hamburgerMenu.chats[selectedLangugage]}
        </Link>

        <span className="flex items-center justify-around w-2/5 hover:font-extrabold hover:text-xl transition-all duration-500">
          <CreateBtn />
          {translations.hamburgerMenu.addForms[selectedLangugage]}
        </span>

        <Link
          to="/search"
          className="flex items-center justify-around w-2/5 hover:font-extrabold hover:text-xl transition-all duration-500"
          onClick={() => {
            dispatch(burgerActions.closedBurger());
          }}
        >
          <FaSearch className="text-xl font-extrabold" />
          {translations.hamburgerMenu.search[selectedLangugage]}
        </Link>

        <LanguageSelect />

        <button
          className="btn w-1/2 bg-red-500 hover:bg-error border-none text-white mt-2"
          onClick={() => {
            dispatch(burgerActions.closedBurger());
            logout();
          }}
        >
          {translations.hamburgerMenu.logOut[selectedLangugage]}
          <RiLogoutBoxRFill />
        </button>
      </div>
    </div>
  );
}

export default HamburgerMenu;
