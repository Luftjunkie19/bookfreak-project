import "./Navbar.css";

import React from "react";

import {
  FaComments,
  FaHome,
  FaPlusCircle,
  FaUserAlt,
  FaUserAltSlash,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

import BookIcon from "../assets/book-icon.png";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  console.log(user);

  const location = useLocation();

  const navigate = useNavigate();

  const checkLocation = (linkLocation) => {
    if (location.pathname === linkLocation) {
      return true;
    }
  };

  const bringToProfile = () => {
    navigate("/");
    setTimeout(() => {
      navigate(`/profile/${user.uid}`);
    });
  };

  return (
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
              <Link to="/" className={checkLocation("/") ? "active-link" : ""}>
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

              <button className="btn logout" onClick={logout}>
                Logout <FaUserAltSlash />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
