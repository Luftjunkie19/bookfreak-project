import './Navbar.css';

import {
  FaBell,
  FaComments,
  FaHome,
  FaPlusCircle,
  FaSearch,
  FaUserAlt,
} from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import {
  Link,
  useLocation,
} from 'react-router-dom';

import BookIcon from '../assets/book-icon.png';
import { burgerActions } from '../context/BurgerContext';
import { viewerActions } from '../context/ViewerContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

function Navbar({ unreadNotifications, unreadRequests }) {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();

  const checkLocation = (linkLocation) => {
    if (location.pathname === linkLocation) {
      return true;
    }
  };

  const dispatch = useDispatch();

  return (
    <>
      <div className="navbar">
        <Link to="/">
          <div className="logo">
            <div className="logo-holder">
              <img src={BookIcon} alt="book-img" />
            </div>
            <h2>BookFreak</h2>
          </div>
        </Link>

        {user && (
          <div className="mobile-nav">
            <button
              className="notification-btn mobile"
              onClick={() => {
                dispatch(viewerActions.toggleState());
              }}
            >
              <FaBell />
              {unreadNotifications > 0 ||
                (unreadRequests > 0 && (
                  <div className="red-point">
                    {unreadNotifications + unreadRequests >= 10
                      ? "9+"
                      : unreadNotifications + unreadRequests}
                  </div>
                ))}
            </button>

            <button
              className="hamburger-btn"
              onClick={() => {
                dispatch(burgerActions.toggleBurger());
              }}
            >
              <GiHamburgerMenu />
            </button>
          </div>
        )}

        {!user && (
          <>
            <div className="links">
              <ul>
                <li>
                  <Link to="/sign-up">Sign up</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </div>
          </>
        )}

        {user && (
          <>
            <div className="nav-options">
              <Link to="/" className={checkLocation("/") ? "active-link" : ""}>
                <FaHome />
              </Link>

              <Link
                to={`/profile/${user.uid}`}
                className={
                  checkLocation(`/profile/${user.uid}`) ? "active-link" : ""
                }
              >
                <FaUserAlt />
              </Link>

              <Link
                to="/create"
                className={checkLocation(`/create`) ? "active-link" : ""}
              >
                <FaPlusCircle />
              </Link>

              <Link
                to="/your-chats"
                className={checkLocation(`/your-chats`) ? "active-link" : ""}
              >
                <FaComments />
              </Link>

              <button
                className="notification-btn"
                onClick={() => {
                  dispatch(viewerActions.toggleState());
                }}
              >
                <FaBell />
                {(unreadNotifications > 0 || unreadRequests.length) > 0 && (
                  <div className="red-point">
                    {unreadNotifications + unreadRequests}
                  </div>
                )}
              </button>

              <Link
                to="/search"
                className={checkLocation(`/search`) ? "active-link" : ""}
              >
                <FaSearch />
              </Link>

              <button className="btn logout" onClick={logout}>
                Logout <RiLogoutBoxRFill />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Navbar;
