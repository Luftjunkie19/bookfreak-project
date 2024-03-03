import '../stylings/scrollbarStyling.css';

import React, { useState } from 'react';

import { BsFillDoorOpenFill } from 'react-icons/bs';
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
} from 'react-icons/fa';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  Button,
  Menu,
  MenuItem,
} from '@mui/material';

import alertMessages from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/ClubsTranslations.json';
import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import reusableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import Ranking from '../../components/Ranking';
import { snackbarActions } from '../../context/SnackBarContext';
import { warningActions } from '../../context/WarningContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';

function OverallClub() {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  
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
  const dispatch = useDispatch();
  const { removeFromDataBase } = useRealDatabase();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
const {document}=useGetDocument("readersClubs", id); 
const {documents: members}=useGetDocuments(`communityMembers/${id}/users`);

  const leaveClub = async () => {
    const arrayWithoutYou = members.filter((doc) => doc.value.id !== user.uid);

    if (arrayWithoutYou && document.createdBy.id === user.uid) {
      dispatch(
        warningActions.openWarning({
          referedTo: document.id,
          typeOf: document.clubsName,
          collection: "readersClubs",
        })
      );
      return;
    }

    navigate("/");
    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.leave[selectedLanguage]}`, alertType:"success"}));
  };

  const deleteClub = async (id) => {
    removeFromDataBase("readersClubs", id);
    removeFromDataBase("communityChats", id);
    removeFromDataBase("communityMembers", id);

    navigate("/");
    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:"success"}));
  };

  return (
    <div className={`min-h-screen h-full ${!isDarkModed && "pattern-bg"}`}>
      {document &&
        members.find((member) => {
          return member.value.id === user.uid && member.belongsTo === id;
        }) && (
          <div className="w-full flex justify-between items-center bg-primeColor z-[9999] p-3 sticky sm:top-16 xl:top-20 left-0">
            <div className={`flex justify-between text-white items-center`}>
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={document.clubLogo}
                alt=""
              />
              <p className="ml-2">{document.clubsName}</p>
            </div>

            <div className="sm:hidden xl:flex justify-around items-center gap-2">
              <Link
                to={`/readers-clubs/${id}`}
                className="btn bg-transparent text-white border-none"
              >
                <FaFacebookMessenger />{" "}
                {reusableTranslations.communitiesBar.chatBtn[selectedLanguage]}
              </Link>

              <Link
                className="btn bg-transparent text-white border-none"
                to={`/readers-clubs/${id}/overall`}
              >
                <FaInfo />{" "}
                {
                  reusableTranslations.communitiesBar.overallBtn[
                    selectedLanguage
                  ]
                }
              </Link>

              <button className="btn bg-error text-white" onClick={leaveClub}>
                {reusableTranslations.communitiesBar.leaveBtn[selectedLanguage]}
                <BsFillDoorOpenFill />{" "}
              </button>
              {document && document.createdBy.id === user.uid && (
                <div className="mx-2 flex justify-around items-center gap-2">
                  <button
                    className="btn btn-info text-white border-none"
                    onClick={() => navigate(`/edit-club/${document.id}`)}
                  >
                    {
                      reusableTranslations.communitiesBar.editBtn[
                        selectedLanguage
                      ]
                    }
                    <FaPencilAlt />
                  </button>

                  <button
                    className="btn bg-error text-white border-none"
                    onClick={async () => await deleteClub(document.id)}
                  >
                    {
                      reusableTranslations.communitiesBar.deleteBtn[
                        selectedLanguage
                      ]
                    }{" "}
                    <FaTrashAlt />
                  </button>
                </div>
              )}
            </div>

            <div className="sm:flex xl:hidden justify-around items-center sm:flex-col md:flex-row">
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
                    to={`/readers-clubs/${id}`}
                    className="flex justify-around items-center w-full"
                  >
                    <FaFacebookMessenger />{" "}
                    {
                      reusableTranslations.communitiesBar.chatBtn[
                        selectedLanguage
                      ]
                    }
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={`/readers-clubs/${id}/overall`}
                    className="flex justify-around items-center w-full"
                  >
                    <FaInfo />
                    {
                      reusableTranslations.communitiesBar.overallBtn[
                        selectedLanguage
                      ]
                    }
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <button
                    onClick={leaveClub}
                    className="flex justify-around items-center w-full"
                  >
                    <BsFillDoorOpenFill />{" "}
                    {
                      reusableTranslations.communitiesBar.leaveBtn[
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
                    {reusableTranslations.managementBtn[selectedLanguage]}
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
                      <Link
                        to={`/edit-club/${document.id}`}
                        className="flex justify-around items-center w-full"
                      >
                        {
                          reusableTranslations.communitiesBar.editBtn[
                            selectedLanguage
                          ]
                        }{" "}
                        <FaPencilAlt />
                      </Link>
                    </MenuItem>

                    <MenuItem onClick={handleCloseManagent}>
                      <button
                        onClick={async () => deleteClub(document.id)}
                        className="flex justify-around items-center w-full"
                      >
                        {
                          reusableTranslations.communitiesBar.deleteBtn[
                            selectedLanguage
                          ]
                        }{" "}
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
        <>
          <div className="flex flex-col w-full h-full justify-between px-4 gap-5 flex-wrap">
            <div className="sm:h-full max-w-3xl  py-6 flex  flex-col lg:flex-row xl:flex-col gap-4">
              <div className="sm:w-36 sm:h-36 lg:w-64 lg:h-64">
                <img
                  className="w-full h-full rounded-full"
                  src={document.clubLogo}
                  alt=""
                />
              </div>
              <div className={`${isDarkModed ? "text-white" : "text-black"}`}>
                <p className="font-bold text-3xl">
                  {reusableTranslations.detailsText[selectedLanguage]}:{" "}
                </p>
                <div className="flex flex-col gap-2 p-1">
                  <p>
                    <span className="text-lg font-semibold">
                      {translations.clubObject.clubsName[selectedLanguage]}
                    </span>
                    : {document.clubsName}
                  </p>
                  <p>
                    <span className="text-lg font-semibold">
                      {translations.clubObject.community[selectedLanguage]}
                    </span>
                    :{" "}
                    {members.filter((member) => member.belongsTo === id).length}{" "}
                    {translations.clubObject.members[selectedLanguage]}
                  </p>
                  <p>
                    <span className="text-lg font-semibold">
                      {
                        translations.clubObject.pagesRequiredText[
                          selectedLanguage
                        ]
                      }
                    </span>
                    : {document.requiredPagesRead}{" "}
                    {reusableTranslations.pagesText[selectedLanguage]}
                  </p>
                </div>
                {document.description && document.description.trim() !== "" && (
                  <div class={`flex flex-col w-full ${isDarkModed ? "text-white" : "text-black"}`}>
                    <h2 class="text-3xl font-extralight pb-2">
                      {
                        formsTranslations.descriptionTextarea.label[
                          selectedLanguage
                        ]
                      }
                      :
                    </h2>
                    <p class={`overflow-y-scroll overflow-x-hidden h-40 py-2 pr-4 ${isDarkModed ? "text-white" : "text-black"} `}>
                      {document.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="sm:w-full xl:max-w-5xl mx-1 my-4">
<p className={`text-2xl font-semibold p-2 ${isDarkModed ? "text-white" : "text-black"}`}>Club's Data:</p>

              <Ranking
                communityObject={document}
                communityMembers={members.filter(
                  (member) => member.belongsTo === id
                )}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OverallClub;
