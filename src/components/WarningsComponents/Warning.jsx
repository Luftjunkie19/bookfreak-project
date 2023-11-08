import React from "react";

import { BsFillPersonFill } from "react-icons/bs";
import { GiExitDoor } from "react-icons/gi";
import { GoAlert } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import alertTranslations from "../../assets/translations/AlertMessages.json";
import { warningActions } from "../../context/WarningContext";

function Warning() {
  const item = useSelector((state) => state.warning.referedTo);

  const collectionName = useSelector((state) => state.warning.collection);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const navigate = useNavigate();

  const dispatch = useDispatch();
  return (
    <>
      {document && (
        <div className="loader-container">
          <GoAlert className=" text-6xl text-red-400" />
          <h2 className="text-center p-1">
            {alertTranslations.leavingWarning.query[selectedLanguage]}{" "}
            {document.competitionTitle
              ? document.competitionTitle
              : document.clubsName}{" "}
            {selectedLanguage === "ger" &&
              alertTranslations.leavingWarning.query.part2[selectedLanguage]}
          </h2>

          <p className="text-center p-1">
            {alertTranslations.leavingWarning.consequences[selectedLanguage]}{" "}
            {document.competitionTitle
              ? document.competitionTitle
              : document.clubsName}
            ,{" "}
            {
              alertTranslations.leavingWarning.consequences.part2[
                selectedLanguage
              ]
            }{" "}
            {selectedLanguage === "ger" &&
              `${
                document.competitionTitle
                  ? document.competitionTitle
                  : document.clubsName
              }`}{" "}
            {selectedLanguage === "ger" &&
              `${alertTranslations.leavingWarning.consequences.part3[selectedLanguage]}.`}
          </p>

          <div className="w-full flex justify-center items-center gap-2 p-2">
            <button
              className="btn w-32 btn-error"
              onClick={() => {
                dispatch(warningActions.closeWarning());

                navigate("/");
                toast.success(
                  alertTranslations.notifications.successfull.leave[
                    selectedLanguage
                  ]
                );
              }}
            >
              Leave <GiExitDoor />
            </button>
            <button
              className="btn w-32 bg-accColor text-white"
              onClick={() => {
                dispatch(warningActions.closeWarning());
              }}
            >
              Stay <BsFillPersonFill />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Warning;
