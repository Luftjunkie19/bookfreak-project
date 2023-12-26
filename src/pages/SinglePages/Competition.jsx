import '../stylings/scrollbarStyling.css';

import {
  useEffect,
  useState,
} from 'react';

import { increment } from 'firebase/database';
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
import { useParams } from 'react-router';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Button,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material';

import alertTranslations from '../../assets/translations/AlertMessages.json';
import competitionTranslations
  from '../../assets/translations/CompetitionsTranslations.json';
import translations from '../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import AllMembersModal from '../../components/AllMembersModal';
import CompetitionChat from '../../components/ChatComponents/CommunityChat';
import Loader from '../../components/Loader';
import Ranking from '../../components/Ranking';
import Warning from '../../components/WarningsComponents/Warning';
import { warningActions } from '../../context/WarningContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function Competition() {
  {
    /*{Math.round(timesDifference / (1000 * 60 * 60 * 24)) > 0
                    ? "The competition expires in"
                    : "has expired"}{" "} */
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  const [isPending, setIsPending] = useState(false);
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
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { id } = useParams();
  const { user } = useAuthContext();
  const [openState, setOpenState] = useState({
    open: false,
    message: "",
  });
  const [document, setDocument] = useState();
  const [members, setMembers] = useState([]);
  const { getDocument } = useRealtimeDocument();
  const { getDocuments } = useRealtimeDocuments();
  const navigate = useNavigate();
  const { removeFromDataBase, updateDatabase, addToDataBase } =
    useRealDatabase();

  const isWarningVisible = useSelector((state) => state.isWarningVisible);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadDocument = async () => {
    const documentEl = await getDocument("competitions", id);

    if (documentEl) {
      setDocument(documentEl);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadDocuments = async () => {
    const documentsEl = await getDocuments(`communityMembers/${id}/users`);

    if (documentsEl) {
      setMembers(documentsEl);
    }
  };

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const competitionExpirationDate =
    document && (document.expiresAt - new Date().getTime()) / 86400000;

  const deleteCompetition = async (id) => {
    setIsPending(true);
    if (
      !document.prizeHandedIn &&
      document.prize.moneyPrize &&
      !document.prize.itemPrize &&
      competitionExpirationDate > 0
    ) {
      const userDoc = await getDocument("users", document.createdBy.id);

      const response = await fetch(
        "http://127.0.0.1:5001/bookfreak-954da/us-central1/stripeFunctions/sendRefund",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Connection: "keep-alive",
            Accept: "*",
          },
          body: JSON.stringify({
            chargeId: document.chargeId,
          }),
        }
      );

      const { error } = await response.json();

      if (error) {
        setIsPending(false);
        setOpenState({ open: true, message: error });
        return;
      }

      updateDatabase(
        {
          ...userDoc,
          creditsAvailable: {
            ...userDoc.creditsAvailable,
            valueInMoney: increment(document.prize.moneyPrize.amount),
            balance: {
              ...userDoc.creditsAvailable.balance,
              0: {
                ...userDoc.creditsAvailable.balance["0"],
                amount: increment(document.prize.moneyPrize.amount),
              },
            },
          },
        },
        "users",
        userDoc.id
      );
      removeFromDataBase("competitions", id);
      removeFromDataBase("communityChats", id);
      removeFromDataBase("communityMembers", id);
      setIsPending(false);
      navigate("/");
    }

    if (
      competitionExpirationDate <= 0 &&
      !document.prizeHandedIn &&
      document.prize.moneyPrize &&
      !document.prize.itemPrize
    ) {
      setIsPending(false);
      setOpenState({
        open: true,
        message: "The winner has to claim the reward !",
      });
      return;
    } else {
      removeFromDataBase("competitions", id);
      removeFromDataBase("communityChats", id);
      removeFromDataBase("communityMembers", id);
      setIsPending(false);
      navigate("/");
    }

    toast.success(
      alertTranslations.notifications.successfull.remove[selectedLanguage]
    );
  };

  const dispatch = useDispatch();

  const leaveCompetition = async () => {
    const arrayWithoutYou = members.filter((doc) => doc.value.id !== user.uid);

    if (arrayWithoutYou && document.createdBy.id === user.uid) {
      dispatch(
        warningActions.openWarning({
          referedTo: document.id,
          typeOf: document.competitionTitle,
          collection: "competitions",
        })
      );
    } else {
      removeFromDataBase("communityMembers", `${id}/users/${user.uid}`);
      navigate("/");
      toast.success(
        alertTranslations.notifications.successfull.leave[selectedLanguage]
      );
    }
  };

  const sendJoiningRequest = async () => {
    try {
      addToDataBase("notifications", `${document.id}-${new Date().getTime()}`, {
        requestContent: `${user.displayName} sent a request to join ${document.competitionTitle}`,
        directedTo: `${document.createdBy.id}`,
        clubToJoin: `${document.id}`,
        isRead: false,
        requestTo: "competitions",
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

      toast.success(
        alertTranslations.notifications.successfull.send[selectedLanguage]
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`min-h-screen h-full ${
        document &&
        !members.find((member) => member.value.id === user.uid) &&
        "flex flex-col justify-center items-center"
      }`}
    >
      {isPending && <Loader />}

      {openState.open === true && (
        <>
          <Snackbar
            onClose={() => {
              setOpenState({ message: "", open: false });
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={openState.open}
            autoHideDuration={3000}
            severity="success"
            message={openState.message}
            action={
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  setOpenState({ message: "", open: false });
                }}
              >
                <FaX className=" text-red-500" /> Close
              </button>
            }
          />
        </>
      )}

      {document &&
        members.find(
          (member) => member.value.id === user.uid && member.belongsTo === id
        ) && (
          <div className="w-full flex justify-between items-center p-3 bg-primeColor sticky z-[9999] sm:top-16 xl:top-20 left-0">
            <div className="flex flex-col text-white items-center">
              <p>{document.competitionTitle}</p>

              <p>{document.competitionsName}</p>
            </div>

            {
              <div className="sm:flex sm:flex-col md:flex-row sm:justify-between sm:items-center gap-3 xl:hidden">
                <Button
                  className="text-white text-sm"
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
                  <MenuItem>
                    <Link
                      to={`/competition/${id}`}
                      className="flex justify-between items-center w-full gap-2"
                    >
                      <FaFacebookMessenger />{" "}
                      {
                        reuseableTranslations.communitiesBar.chatBtn[
                          selectedLanguage
                        ]
                      }
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    {" "}
                    <Link
                      className="flex justify-between items-center w-full gap-2"
                      to={`/competition/${id}/overall`}
                    >
                      <FaInfo />{" "}
                      {
                        reuseableTranslations.communitiesBar.overallBtn[
                          selectedLanguage
                        ]
                      }
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="flex justify-between items-center w-full gap-2"
                      onClick={leaveCompetition}
                    >
                      {
                        reuseableTranslations.communitiesBar.leaveBtn[
                          selectedLanguage
                        ]
                      }
                      <BsFillDoorOpenFill />
                    </button>
                  </MenuItem>
                </Menu>

                {document && document.createdBy.id === user.uid && (
                  <>
                    <Button
                      className="text-white text-sm"
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
                      {competitionExpirationDate >= 0 && (
                        <MenuItem>
                          <button
                            className="flex justify-between items-center w-full gap-2"
                            onClick={() =>
                              navigate(`/edit-competition/${document.id}`)
                            }
                          >
                            {
                              reuseableTranslations.communitiesBar.editBtn[
                                selectedLanguage
                              ]
                            }{" "}
                            <FaPencilAlt />
                          </button>
                        </MenuItem>
                      )}
                      <MenuItem>
                        <button
                          className="flex justify-between items-center w-full gap-2"
                          onClick={async () =>
                            await deleteCompetition(document.id)
                          }
                        >
                          {
                            reuseableTranslations.communitiesBar.deleteBtn[
                              selectedLanguage
                            ]
                          }{" "}
                          <FaTrashAlt />
                        </button>
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </div>
            }

            <div className="justify-around items-center sm:hidden xl:flex">
              <Link
                to={`/competition/${id}`}
                className="btn bg-transparent border-none text-white mx-2"
              >
                <FaFacebookMessenger />
                {reuseableTranslations.communitiesBar.chatBtn[selectedLanguage]}
              </Link>

              <Link
                className="btn border-none bg-transparent text-white mr-2"
                to={`/competition/${id}/overall`}
              >
                <FaInfo />{" "}
                {
                  reuseableTranslations.communitiesBar.overallBtn[
                    selectedLanguage
                  ]
                }
              </Link>

              <button
                className="btn btn-error text-white"
                onClick={leaveCompetition}
              >
                {
                  reuseableTranslations.communitiesBar.leaveBtn[
                    selectedLanguage
                  ]
                }{" "}
                <BsFillDoorOpenFill />
              </button>

              {document.createdBy.id === user.uid && (
                <div className="mx-2 flex justify-around items-center">
                  {competitionExpirationDate > 0 && (
                    <button
                      className="btn btn-info text-white"
                      onClick={() =>
                        navigate(`/edit-competition/${document.id}`)
                      }
                    >
                      {
                        reuseableTranslations.communitiesBar.editBtn[
                          selectedLanguage
                        ]
                      }
                      <FaPencilAlt />
                    </button>
                  )}

                  <button
                    className="btn btn-error text-white ml-2"
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
          </div>
        )}

      {document &&
        !members.find(
          (member) =>
            member.value.id === user.uid && member.belongsTo === document.id
        ) && (
          <div className="flex sm:flex-col xl:flex-row justify-between w-full items-center gap-4 p-4">
            <div className="h-full sm:w-full xl:w-2/5 gap-6 text-white flex flex-col items-center justify-between rounded-md py-4">
              <p className="sm:text-2xl lg:text-4xl font-bold">
                {document.competitionTitle}
              </p>
              <div className="flex sm:flex-col gap-4 xl:flex-row w-full justify-around items-center border-t-2 border-accColor p-4">
                <div>
                  <h3 className=" text-lg font-semibold">
                    {document.competitionsName}
                  </h3>
                  <AllMembersModal users={members} />
                  {/** 
                <p className=" font-medium">
                    {document.users.length}{" "}
                    {
                      competitionTranslation.competitionObject.membersAttending[
                        selectedLanguage
                      ]
                    }
                </p>
                */}

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
                {competitionExpirationDate > 0 && (
                  <button
                    className="btn bg-accColor hover:bg-info text-white border-none"
                    onClick={sendJoiningRequest}
                  >
                    {reuseableTranslations.joinTo.competition[selectedLanguage]}{" "}
                    <FaUserPlus />
                  </button>
                )}
              </div>
              {document && document.description.trim() !== "" && (
                <div class="flex flex-col text-white p-3 w-full">
                  {competitionExpirationDate > 0 && (
                    <p>
                      {
                        competitionTranslations.competitionObject.expiration
                          .notExpired.part1[selectedLanguage]
                      }{" "}
                      {
                        competitionTranslations.competitionObject.expiration
                          .notExpired.part2.notToday.expiresIN[selectedLanguage]
                      }
                      <span className="text-2xl font-bold text-red-500">
                        {Math.round(competitionExpirationDate) > 0 && (
                          <span>
                            {" "}
                            {Math.round(competitionExpirationDate)}{" "}
                            {
                              competitionTranslations.competitionObject
                                .expiration.notExpired.part2.notToday[
                                selectedLanguage
                              ]
                            }
                          </span>
                        )}
                      </span>
                    </p>
                  )}

                  {competitionExpirationDate <= 0 && (
                    <p>
                      {
                        competitionTranslations.competitionObject.expiration
                          .Expired.part1[selectedLanguage]
                      }{" "}
                      <span className="text-2xl font-bold text-red-500">
                        {" "}
                        {competitionExpirationDate <= -1
                          ? `${Math.round(competitionExpirationDate) * -1} ${
                              competitionTranslations.competitionObject
                                .expiration.Expired.part2.notToday[
                                selectedLanguage
                              ]
                            }`
                          : ` ${competitionTranslations.competitionObject.expiration.Expired.part2.today[selectedLanguage]}`}
                      </span>
                    </p>
                  )}
                  <h2 class="text-3xl font-extralight pb-2">
                    {translations.descriptionTextarea.label[selectedLanguage]}:
                  </h2>
                  <p class="overflow-y-scroll overflow-x-hidden h-40 py-2 pr-4">
                    {document.description}
                  </p>
                </div>
              )}
            </div>

            <Ranking
              communityObject={document}
              communityMembers={members.filter(
                (member) => member.belongsTo === document.id
              )}
              expirationTimeNumber={document.expiresAt}
              expirationTime={competitionExpirationDate}
            />
          </div>
        )}
      {document &&
        members.find(
          (member) => member.value.id === user.uid && member.belongsTo === id
        ) && <CompetitionChat collectionName="competitions" id={document.id} />}

      {isWarningVisible && <Warning deleteCompetition={leaveCompetition} />}
    </div>
  );
}

export default Competition;
