import React from "react";

import { FaMoon } from "react-icons/fa";
import { GiGrass } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";

import { modeActions } from "../context/ModeContext";

function Switcher() {
  const dispatch = useDispatch();
  const isDarkmode = useSelector((state) => state.mode.isDarkMode);
  return (
    <button
      className={` rounded-full p-2 ${
        isDarkmode ? " bg-bgColor" : "bg-accColor"
      }`}
      onClick={() => {
        dispatch(modeActions.toggleDarkMode());
        console.log(isDarkmode);
      }}
    >
      {isDarkmode ? (
        <GiGrass className="text-3xl appearing text-green-700" />
      ) : (
        <FaMoon className="text-3xl appearing text-blue-950" />
      )}
    </button>
  );
}

export default Switcher;
