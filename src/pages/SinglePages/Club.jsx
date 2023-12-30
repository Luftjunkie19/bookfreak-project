import '../stylings/scrollbarStyling.css';
import '../stylings/backgrounds.css';
import '../../components/stylings/mui-stylings.css';

import {
  useEffect,
  useState,
} from 'react';

import { BsFillDoorOpenFill } from 'react-icons/bs';
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
  FaUserPlus,
} from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
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
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function Club() {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { id } = useParams();
  const dispatch = useDispatch();
  const [document, setDocument] = useState(null);
  const [members, setMembers] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  const { getDocument } = useRealtimeDocument();
  const { getDocuments } = useRealtimeDocuments();
  const { removeFromDataBase, addToDataBase } = useRealDatabase();
  const [message, setMessage] = useState({ open: false, message: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadDocument = async () => {
    const loadDocumentEl = await getDocument("readersClubs", id);

    if (loadDocumentEl) {
      setDocument(loadDocumentEl);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadMembers = async () => {
    const memberElements = await getDocuments(`communityMembers/${id}/users`);

    if (memberElements) {
      setMembers(memberElements);
    }
  };

  useEffect(() => {
    loadDocument();
    loadMembers();
  }, [loadDocument, loadMembers]);

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
      className={`min-h-screen h-full ${!isDarkModed && "pattern-bg"} ${
        document &&
        !members.find(
          (member) => member.value.id === user.uid && member.belongsTo === id
        ) &&
        "flex justify-center items-center flex-col"
      }`}
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
          <div className={`flex justify-between items-center w-full h-full sm:flex-col xl:flex-row px-4 py-4 gap-6 ${isDarkModed ? "text-white" : 'text-black'}`}>
            <div className="sm:w-full xl:w-1/3 h-full  flex flex-col items-center justify-between rounded-md py-4">
              <div className="sm:w-36 sm:h-36 md:w-48 md:h-48 lg:h-64 lg:w-64">
                <img
                  className="w-full h-full rounded-full object-cover border-accColor border-2"
                  src={document.clubLogo}
                  alt=""
                />
              </div>
              <div className="flex gap-3 items-center sm:flex-col xl:flex-row w-full justify-around mt-6">
                <div className="flex flex-col gap-2">
                  <h3
                    className=" text-xl font-semibold text-center"
                    onClick={() => {
                      console.log(members);
                    }}
                  >
                    {document.clubsName}
                  </h3>
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
                  <p>
                    <span className="text-lg font-semibold">
                      {reusableTranslations.createdBy[selectedLanguage]}
                    </span>
                    :{" "}
                    <Link to={`/user/profile/${document.createdBy.id}`}>
                      {document.createdBy.displayName}
                    </Link>
                  </p>
                </div>

                <button
                  className="btn bg-accColor hover:bg-info text-white border-none"
                  onClick={sendJoiningRequest}
                >
                  {reusableTranslations.joinTo.club[selectedLanguage]}{" "}
                  <FaUserPlus />
                </button>
              </div>
              {document && document.description.trim() !== "" && (
                <div class="flex flex-col text-white p-3 w-full">
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
