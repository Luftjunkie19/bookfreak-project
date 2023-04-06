import "./Navbar.css";

import { useEffect, useState } from "react";

import {
  FaBell,
  FaComments,
  FaHome,
  FaPlusCircle,
  FaSearch,
  FaUserAlt,
  FaUserAltSlash,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

import BookIcon from "../assets/book-icon.png";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useLogout } from "../hooks/useLogout";
import { useOrderedCollection } from "../hooks/useOrderedCollection";
import NotificationViewer from "../pages/NotificationViewer";

function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  const { documents } = useCollection("notifications");
  const { orderedDocuments } = useOrderedCollection("join-request");
  const navigate = useNavigate();

  const checkLocation = (linkLocation) => {
    if (location.pathname === linkLocation) {
      return true;
    }
  };

  const openedModal = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (documents && orderedDocuments) {
      const unreadRequests = orderedDocuments.filter((doc) => {
        if (user) {
          return !doc.isRead && doc.directedTo === user.uid;
        }
      });

      const unreadDocs = documents.filter((doc) => {
        if (user) {
          return !doc.isRead && doc.directedTo === user.uid;
        }
      });

      const allUnread = unreadRequests.concat(unreadDocs);

      setAllNotifications(allUnread);

      setHasUnreadNotifications(allUnread.length > 0);
    }
  }, [documents, user, orderedDocuments]);

  const bringToProfile = () => {
    navigate("/");
    setTimeout(() => {
      navigate(`/profile/${user.uid}`);
    });
  };

  return (
    <>
      <div className="navbar">
        <div className="logo">
          <div className="logo-holder">
            <img src={BookIcon} alt="book-img" />
          </div>
          <h2>BookFreak</h2>
        </div>

        <div className="links">
          {!user && (
            <>
              <ul>
                <li>
                  <Link to="/sign-up">Sign up</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </>
          )}

          {user && (
            <>
              <div className="options">
                <Link
                  to="/"
                  className={checkLocation("/") ? "active-link" : ""}
                >
                  <FaHome /> Home
                </Link>

                <Link
                  onClick={bringToProfile}
                  className={
                    checkLocation(`/profile/${user.uid}`) ? "active-link" : ""
                  }
                >
                  <FaUserAlt /> Profile
                </Link>

                <Link
                  to="/create"
                  className={checkLocation(`/create`) ? "active-link" : ""}
                >
                  <FaPlusCircle /> Create
                </Link>

                <Link
                  to="/your-chats"
                  className={checkLocation(`/your-chats`) ? "active-link" : ""}
                >
                  <FaComments /> Your chats
                </Link>

                <button
                  className="notification-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FaBell /> Notifications
                  {allNotifications.length > 0 && (
                    <div
                      className={
                        hasUnreadNotifications ? "red-point" : "hidden"
                      }
                    >
                      {allNotifications.length}
                    </div>
                  )}
                </button>

                <Link
                  to="/search"
                  className={checkLocation(`/search`) ? "active-link" : ""}
                >
                  <FaSearch /> Search
                </Link>

                <button className="btn logout" onClick={logout}>
                  Logout <FaUserAltSlash />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {user && showNotifications && (
        <NotificationViewer
          openModal={openedModal}
          isOpened={openModal}
          closeModal={closeModal}
        />
      )}
    </>
  );
}

export default Navbar;
