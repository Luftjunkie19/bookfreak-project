import {
  FaComments,
  FaHome,
  FaPlusCircle,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { burgerActions } from "../context/BurgerContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

function HamburgerMenu() {
  const { user } = useAuthContext();
  const dispatch = useDispatch();

  const { logout } = useLogout();
  const isBurgerOpened = useSelector((state) => state.hamburger.isOpened);

  return (
    <div className={`hamburger-holder-${isBurgerOpened ? "opened" : "closed"}`}>
      <ul>
        <li>
          <Link
            to="/"
            onClick={() => {
              dispatch(burgerActions.closedBurger());
            }}
          >
            Home <FaHome />
          </Link>
        </li>
        <li>
          <Link
            to={`/profile/${user.uid}`}
            onClick={() => {
              dispatch(burgerActions.closedBurger());
            }}
          >
            Profile <FaUser />
          </Link>
        </li>
        <li>
          <Link
            to="/your-chats"
            onClick={() => {
              dispatch(burgerActions.closedBurger());
            }}
          >
            Chats <FaComments />
          </Link>
        </li>

        <li>
          <Link
            to="/create"
            onClick={() => {
              dispatch(burgerActions.closedBurger());
            }}
          >
            Add <FaPlusCircle />
          </Link>
        </li>

        <li>
          <Link
            to="/search"
            onClick={() => {
              dispatch(burgerActions.closedBurger());
            }}
          >
            Search <FaSearch />
          </Link>
        </li>

        <li>
          <button
            className="btn logout"
            onClick={() => {
              dispatch(burgerActions.closedBurger());
              logout();
            }}
          >
            Logout <RiLogoutBoxRFill />
          </button>
        </li>
      </ul>
    </div>
  );
}

export default HamburgerMenu;
