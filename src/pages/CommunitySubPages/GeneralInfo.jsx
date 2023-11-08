import React, { useEffect, useState } from "react";

import { BsFillDoorOpenFill } from "react-icons/bs";
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Button, Menu, MenuItem } from "@mui/material";

import alertMessages from "../../assets/translations/AlertMessages.json";
import translations from "../../assets/translations/CompetitionsTranslations.json";
import formsTranslations from "../../assets/translations/FormsTranslations.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";
import Ranking from "../../components/Ranking";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocument from "../../hooks/useRealtimeDocument";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function GeneralInfo() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  const [document, setDocument] = useState(null);
  const [members, setMembers] = useState([]);
  const { getDocument } = useRealtimeDocument();
  const { getDocuments } = useRealtimeDocuments();
  const { removeFromDataBase } = useRealDatabase();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleOpenManagement = (e) => {
    setManagmentEl(e.currentTarget);
  };

  const handleCloseManagent = () => {
    setManagmentEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const openMangement = Boolean(managmentEl);

  const { id } = useParams();
  const { user } = useAuthContext();

  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadDocument = async () => {
    const documentEl = await getDocument("competitions", id);

    if (documentEl) {
      setDocument(documentEl);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadMembers = async () => {
    const memberElements = await getDocuments("communityMembers");

    const realObjects = memberElements.map((bookReader) => {
      return bookReader.users;
    });

    const newArray = realObjects.map((obj) => {
      const nestedObject = Object.values(obj);
      return nestedObject;
    });

    setMembers(...newArray);
  };

  useEffect(() => {
    loadDocument();
    loadMembers();
  }, [loadDocument, loadMembers]);

  const deleteCompetition = async (id) => {
    removeFromDataBase("competitions", id);
    removeFromDataBase("communityChats", id);
    removeFromDataBase("communityMembers", id);

    navigate("/");

    toast.success(
      alertMessages.notifications.successfull.remove[selectedLanguage]
    );
  };

  const dispatch = useDispatch();

  const leaveCompetition = async () => {
    {
      /*  const arrayWithoutYou = document.users.filter(
      (doc) => doc.value.id !== user.uid
    );

    if (arrayWithoutYou && document.createdBy.id === user.uid) {
      dispatch(
        warningActions.openWarning({
          referedTo: document.id,
          typeOf: "competition",
          collection: "competitions",
        })
      );
      return;
    }*/
    }

    navigate("/");
    toast.success(
      alertMessages.notifications.successfull.leave[selectedLanguage]
    );
  };

  const competitionExpirationDate =
    document && document.expiresAt / 1000 / 24 / 12 / 30 / 60 / 60;

  return (
    <div className="min-h-screen h-full">
      {document &&
        members.find(
          (member) =>
            member.value.id === user.uid && member.belongsTo === document.id
        ) && (
          <div className="w-full flex justify-between items-center p-3 bg-accColor">
            <div className="flex flex-col text-white items-center">
              <p>{document.competitionTitle}</p>
              <p>{document.competitionsName}</p>
            </div>

            <div className="sm:hidden xl:flex justify-around items-center">
              <Link to={`/competition/${id}`} className="btn mx-2">
                <FaFacebookMessenger />{" "}
                {reuseableTranslations.communitiesBar.chatBtn[selectedLanguage]}
              </Link>

              <Link className="btn mr-2" to={`/competition/${id}/overall`}>
                <FaInfo />{" "}
                {
                  reuseableTranslations.communitiesBar.overallBtn[
                    selectedLanguage
                  ]
                }
              </Link>

              <button className="btn" onClick={leaveCompetition}>
                {
                  reuseableTranslations.communitiesBar.leaveBtn[
                    selectedLanguage
                  ]
                }
                <BsFillDoorOpenFill />
              </button>

              {document.createdBy.id === user.uid && (
                <div className="mx-2 flex justify-around items-center">
                  <button
                    className="btn"
                    onClick={() => navigate(`/edit-competition/${document.id}`)}
                  >
                    {
                      reuseableTranslations.communitiesBar.editBtn[
                        selectedLanguage
                      ]
                    }
                    <FaPencilAlt />
                  </button>

                  <button
                    className="btn ml-2"
                    onClick={async () => await deleteCompetition(document.id)}
                  >
                    {
                      reuseableTranslations.communitiesBar.deleteBtn[
                        selectedLanguage
                      ]
                    }
                    <FaTrashAlt />
                  </button>
                </div>
              )}
            </div>

            <div className="sm:flex xl:hidden justify-around items-center sm:flex-col lg:flex-row">
              <Button
                className="text-white"
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                Menu
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    className="flex justify-around items-center w-full"
                    to={`/competition/${id}`}
                  >
                    <FaFacebookMessenger />{" "}
                    {
                      reuseableTranslations.communitiesBar.chatBtn[
                        selectedLanguage
                      ]
                    }
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={`/competition/${id}/overall`}
                    className="flex justify-around items-center w-full"
                  >
                    <FaInfo />
                    {
                      reuseableTranslations.communitiesBar.overallBtn[
                        selectedLanguage
                      ]
                    }
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <button
                    className="flex justify-around items-center w-full"
                    onClick={leaveCompetition}
                  >
                    <BsFillDoorOpenFill />{" "}
                    {
                      reuseableTranslations.communitiesBar.leaveBtn[
                        selectedLanguage
                      ]
                    }
                  </button>
                </MenuItem>
              </Menu>
              {document && document.createdBy.id === user.uid && (
                <div className="sm:block xl:hidden">
                  <Button
                    className="text-white"
                    id="basic-button"
                    aria-controls={openMangement ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMangement ? "true" : undefined}
                    onClick={handleOpenManagement}
                  >
                    {reuseableTranslations.managementBtn[selectedLanguage]}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={managmentEl}
                    open={openMangement}
                    onClose={handleCloseManagent}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={handleCloseManagent}>
                      <Link className="flex justify-around items-center w-full">
                        {
                          reuseableTranslations.communitiesBar.editBtn[
                            selectedLanguage
                          ]
                        }{" "}
                        <FaPencilAlt />
                      </Link>
                    </MenuItem>

                    <MenuItem onClick={handleCloseManagent}>
                      <button className="flex justify-around items-center w-full">
                        {
                          reuseableTranslations.communitiesBar.deleteBtn[
                            selectedLanguage
                          ]
                        }
                        <FaTrashAlt />
                      </button>
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        )}

      {document && (
        <div className="flex sm:flex-col xl:flex-row justify-between w-full items-center gap-4 p-4">
          <div className="h-full sm:w-full xl:w-2/5 gap-6 text-white flex flex-col items-center justify-between rounded-md py-4">
            <p className="sm:text-2xl lg:text-4xl font-bold">
              {document.competitionTitle}
            </p>
            <div className="flex sm:flex-col gap-4 xl:flex-row w-full justify-around items-center border-t-2 border-accColor p-4">
              <p className=" text-2xl font-thin">
                {reuseableTranslations.detailsText[selectedLanguage]}:
              </p>
              <div>
                <h3 className=" text-lg font-semibold">
                  {document.competitionsName}
                </h3>
                <p className=" font-medium">
                  {
                    members.filter((member) => member.belongsTo === document.id)
                      .length
                  }{" "}
                  {
                    translations.competitionObject.membersAttending[
                      selectedLanguage
                    ]
                  }
                </p>
                <p>
                  {reuseableTranslations.createdBy[selectedLanguage]}:{" "}
                  <Link
                    className="link hover:text-yellow-400 duration-500 transition-all"
                    to={`/user/profile/${document.createdBy.id}`}
                  >
                    {document.createdBy.displayName}
                  </Link>
                </p>
              </div>
            </div>
            {document && document.description.trim() !== "" && (
              <div class="flex flex-col text-white p-3 w-full">
                <p>
                  Expires in{" "}
                  <span className="text-2xl font-bold text-red-500">
                    {Math.round(competitionExpirationDate)} days
                  </span>
                </p>
                <h2 class="text-3xl font-extralight pb-2">
                  {
                    formsTranslations.descriptionTextarea.label[
                      selectedLanguage
                    ]
                  }
                  :
                </h2>
                <p class="overflow-y-scroll overflow-x-hidden h-40 py-2 pr-4">
                  {document.description}
                </p>
              </div>
            )}
          </div>

          <Ranking
            communityMembers={members.filter(
              (member) => member.belongsTo === id
            )}
            communityId={document.id}
          />
        </div>
      )}
    </div>
  );
}

export default GeneralInfo;
