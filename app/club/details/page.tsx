import '../stylings/scrollbarStyling.css';

import React, { useState } from 'react';

import { BsFillDoorOpenFill } from 'react-icons/bs';
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
} from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa6';
import {
  GiBookmarklet,
  GiRibbonShield,
} from 'react-icons/gi';
import { GrUserManager } from 'react-icons/gr';
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
           <div className={`flex justify-between w-full h-full flex-col  px-4 py-4 gap-6 ${isDarkModed ? "text-white" : 'text-black'}`}>
            <div className="sm:w-full max-w-7xl h-full flex flex-col rounded-md py-4">
              <div className="sm:w-36 sm:h-36 md:w-48 md:h-48 lg:h-64 lg:w-64 sm:self-center lg:self-start">
                <img
                  className="w-full h-full rounded-full object-cover border-accColor border-2"
                  src={document.clubLogo}
                  alt=""
                />
              </div>
              <div className="flex sm:flex-wrap sm:justify-around lg:justify-start lg:flex-nowrap gap-6 w-full mt-6">
                
                  <div className="flex sm:w-72 lg:w-80 flex-col gap-8 p-4 rounded-lg bg-accColor">
                  <div className="flex justify-between items-center w-full">
                    <GiRibbonShield size={36}/>
                  <p className="text-lg">Club</p>  
                  </div>
                    <p className=" font-semibold"> {document.clubsName}</p>
              </div>
              
                   
                  <div className="flex sm:w-72 lg:w-80 flex-col gap-8 p-4 rounded-lg bg-accColor">
                  <div className="flex justify-between items-center w-full">
                    <FaUsers size={36}/>
                  <p className="text-lg">{members.filter((member) => member.belongsTo === id).length}</p>  
                  </div>
                    <p className="  font-semibold">{translations.clubObject.members[selectedLanguage]}</p>
              </div>

          
                 <div className="flex sm:w-72 lg:w-80 flex-col gap-8 p-4 rounded-lg bg-accColor">
                  <div className="flex justify-between items-center w-full">
                    <GiBookmarklet size={36}/>
                  <p className="text-lg">{document.requiredPagesRead}</p>  
                  </div>
                    <p className=" font-semibold">  {
                        translations.clubObject.pagesRequiredText[
                          selectedLanguage
                        ]
                      }</p>
              </div>

                <div className="flex sm:w-72 lg:w-80 flex-col gap-8 p-4 rounded-lg bg-accColor">
                  <div className="flex justify-between items-center w-full">
                    <GrUserManager size={36}/>
                     <Link to={`/user/profile/${document.createdBy.id}`}>
                <img src={document.createdBy.photoURL} alt="" className="w-10 h-10 rounded-full"/>
                    </Link>
                  </div>
                    <p className=" font-semibold">{reusableTranslations.createdBy[selectedLanguage]}</p>
              </div>
                
                
              </div>
              {document && document.description.trim() !== "" && (
                <div class="flex flex-col gap-4 text-white py-3 w-full">

                  <h2 class="text-3xl font-extralight ">
                    {
                      formsTranslations.descriptionTextarea.label[
                        selectedLanguage
                      ]
                    }
                    :
                  </h2>
                  <p class="overflow-y-scroll max-w-xl bg-accColor/60 rounded-lg overflow-x-hidden h-40 p-2">
                    {document.description}
                  </p>
                 
                </div>
              )}
            </div>

            <Ranking
              communityId={id}
              communityMembers={members.filter((member) => {
                return member.belongsTo === id;
              })}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default OverallClub;
