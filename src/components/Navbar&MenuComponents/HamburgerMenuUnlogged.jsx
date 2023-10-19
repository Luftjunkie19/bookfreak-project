import { FaComments, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import languageTranslation from "../../assets/translations/navbarTranslations.json";
import { burgerActions } from "../../context/BurgerContext";
import LanguageSelect from "./LanguageSelect";

function HamburgerMenuUnlogged() {
  const dispatch = useDispatch();
  const translations = languageTranslation;
  const selectedLangugage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const isBurgerOpened = useSelector(
    (state) => state.hamburger.isUnloggedOpened
  );

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
          to={`/sign-up`}
          onClick={() => {
            dispatch(burgerActions.closedUnloggedBurger());
          }}
          className="flex items-center justify-around w-2/5 hover:font-extrabold hover:text-xl transition-all duration-500 font-bold"
        >
          <FaUser className="text-xl font-extrabold" />
          {translations.unloggedNavbar.register[selectedLangugage]}
        </Link>

        <Link
          to="/login"
          className="flex font-bold items-center justify-around w-2/5 hover:font-extrabold hover:text-xl transition-all duration-500"
          onClick={() => {
            dispatch(burgerActions.closedUnloggedBurger());
          }}
        >
          <FaComments className="text-xl font-extrabold" />
          {translations.unloggedNavbar.login[selectedLangugage]}
        </Link>

        <LanguageSelect />
      </div>
    </div>
  );
}

export default HamburgerMenuUnlogged;
