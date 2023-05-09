import React from "react";

import { BsFillPersonFill } from "react-icons/bs";
import { GiExitDoor } from "react-icons/gi";
import { GoAlert } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { warningActions } from "../context/WarningContext";
import { useDocument } from "../hooks/useDocument";
import { useFirestore } from "../hooks/useFirestore";

function Warning() {
  const item = useSelector((state) => state.warning.referedTo);
  const typeOf = useSelector((state) => state.warning.typeOf);
  const collectionName = useSelector((state) => state.warning.collection);
  const navigate = useNavigate();
  const { deleteDocument } = useFirestore(collectionName);
  const { document } = useDocument(collectionName, item);

  const dispatch = useDispatch();
  return (
    <>
      {document && (
        <div className="loader-container">
          <GoAlert />
          <h2>
            Are you sure you want to leave the{" "}
            {document.competitionTitle
              ? document.competitionTitle
              : document.clubsName}
          </h2>

          <p>In case you leave the {typeOf}, it will be removed.</p>

          <div className="pages-buttons">
            <button
              className="btn no"
              onClick={() => {
                dispatch(warningActions.closeWarning());
                deleteDocument(document.id);
                navigate("/");
                toast.success("Competition removed successfully !");
              }}
            >
              Leave <GiExitDoor />
            </button>
            <button
              className="btn"
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
