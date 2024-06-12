import '../stylings/scrollbarStyling.css';
import '../stylings/backgrounds.css';
import '../../components/stylings/mui-stylings.css';

import { useState } from 'react';

import { BsFillDoorOpenFill } from 'react-icons/bs';
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
  FaUserPlus,
} from 'react-icons/fa';
import {
  FaUsers,
  FaX,
} from 'react-icons/fa6';
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
  Snackbar,
} from '@mui/material';

import alertTranslations from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/ClubsTranslations.json';
import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import reusableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import CompetitionChat from '../../components/ChatComponents/CommunityChat';
import Ranking from '../../components/Ranking';
import { snackbarActions } from '../../context/SnackBarContext';
import { warningActions } from '../../context/WarningContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function Club() {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  const { getDocuments } = useRealtimeDocuments();
  const { removeFromDataBase, addToDataBase } = useRealDatabase();
  const [message, setMessage] = useState({ open: false, message: null });
  const {document}=useGetDocument("readersClubs", id);
 const {documents: members}=useGetDocuments(`communityMembers/${id}/users`);



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
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const open = Boolean(anchorEl);
  const openMangement = Boolean(managmentEl);


  const deleteClub = async (id) => {
    removeFromDataBase("readersClubs", id);
    removeFromDataBase("communityChats", id);
    removeFromDataBase("communityMembers", id);

    navigate("/");
    dispatch(snackbarActions.showMessage({message:`${ alertTranslations.notifications.successfull.remove[selectedLanguage]}`, alertType:"success"}));

  };

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
    } else {
      removeFromDataBase(`communityMembers/${id}/users`, user.uid);
    }

    navigate("/");
    setMessage({
      open: true,
      message:
        alertTranslations.notifications.successfull.leave[selectedLanguage],
    });
  };

  const sendJoiningRequest = async () => {
    try {
      const ClubswithMembers = await getDocuments("communityMembers");

      const membersOfClubsEls = ClubswithMembers.map((club) => {
        return club.users;
      });

      const allMembersEls = membersOfClubsEls.map((object) => {
        return Object.values(object);
      });

      const finalConversion = allMembersEls.flat();

      if (
        finalConversion.find(
          (member) =>
            member.value.id === user.uid &&
            member.belongsTo.includes("readersClub")
        )
      ) {
        setMessage({
          open: true,
          message:
            alertTranslations.notifications.wrong.loyality[selectedLanguage],
        });

        return;
      }

      addToDataBase("notifications", `${document.id}-${new Date().getTime()}`, {
        requestContent: `${user.displayName} sent a request to join ${document.clubsName}`,
        directedTo: `${document.createdBy.id}`,
        clubToJoin: `${document.id}`,
        isRead: false,
        requestTo: "readersClubs",
        notificationTime: new Date().getTime(),
        joinerData: {
          label: user.displayName,
          belongsTo: document.id,
          value: {
            nickname: user.displayName,
            id: user.uid,
            photoURL: user.photoURL,
          },
        },
      });

      console.log(members);

      setMessage({
        open: true,
        message:
          alertTranslations.notifications.successfull.send[selectedLanguage],
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`min-h-screen h-full ${!isDarkModed && "pattern-bg"} `}
    >
      {document &&
        members.find((member) => {
          return member.value.id === user.uid && member.belongsTo === id;
        }) && (
          <div className="w-full flex justify-between items-center p-3 bg-primeColor z-[9999] sticky sm:top-16 xl:top-20 left-0">
            <div className={`flex justify-between  text-white items-center`}>
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
                className="btn text-white border-none bg-transparent"
              >
                <FaFacebookMessenger />{" "}
                {reusableTranslations.communitiesBar.chatBtn[selectedLanguage]}
              </Link>

              <Link
                className="btn text-white border-none bg-transparent"
                to={`/readers-clubs/${id}/overall`}
              >
                <FaInfo />{" "}
                {
                  reusableTranslations.communitiesBar.overallBtn[
                    selectedLanguage
                  ]
                }
              </Link>

              <button
                className="btn text-white border-none bg-error"
                onClick={leaveClub}
              >
                {reusableTranslations.communitiesBar.leaveBtn[selectedLanguage]}{" "}
                <BsFillDoorOpenFill />{" "}
              </button>
              {document && document.createdBy.id === user.uid && (
                <div className="mx-2 gap-2 flex justify-around items-center">
                  <button
                    className="btn text-white border-none bg-info"
                    onClick={() => navigate(`/edit-club/${document.id}`)}
                  >
                    {
                      reusableTranslations.communitiesBar.editBtn[
                        selectedLanguage
                      ]
                    }{" "}
                    <FaPencilAlt />
                  </button>

                  <button
                    className="btn text-white border-none bg-error"
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
                    className="flex justify-around items-center w-full"
                    to={`/readers-clubs/${id}`}
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
                    className="flex justify-around items-center w-full"
                    to={`/readers-clubs/${id}/overall`}
                  >
                    <FaInfo />{" "}
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

                    <MenuItem
                      onClick={async () => {
                        handleCloseManagent();

                        await deleteClub(document.id);
                      }}
                    >
                      <button className="flex justify-around items-center w-full">
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

      {document &&
        !members.find(
          (member) => member.value.id === user.uid && member.belongsTo === id
        ) && (
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
                               <button
                  className="btn max-w-72 bg-modalAccColor hover:bg-info text-white border-none"
                  onClick={sendJoiningRequest}
                >
                  {reusableTranslations.joinTo.club[selectedLanguage]}{" "}
                  <FaUserPlus />
                </button>
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
        )}

      {message.open && (
        <Snackbar
          onClose={() => {
            setMessage({ message: "", open: false });
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={message.open}
          autoHideDuration={3000}
          message={message.message}
          action={
            <button
              className="flex items-center gap-2"
              onClick={() => {
                setMessage({ message: "", open: false });
              }}
            >
              <FaX className=" text-red-500" /> Close
            </button>
          }
        />
      )}

      {document &&
        members.find((member) => {
          return member.value.id === user.uid && member.belongsTo === id;
        }) && (
          <CompetitionChat collectionName="readersClubs" id={document.id} />
        )}
    </div>
  );
}

export default Club;
