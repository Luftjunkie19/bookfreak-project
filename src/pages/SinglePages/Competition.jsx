import '../stylings/scrollbarStyling.css';
import '../stylings/backgrounds.css';

import { useState } from 'react';

import { increment } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import { BsFillDoorOpenFill } from 'react-icons/bs';
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
  FaUserPlus,
} from 'react-icons/fa';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useParams } from 'react-router';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  Button,
  Menu,
  MenuItem,
} from '@mui/material';

import { functions } from '../../';
import alertTranslations from '../../assets/translations/AlertMessages.json';
import competitionsTranslations
  from '../../assets/translations/CompetitionsTranslations.json';
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
import { snackbarActions } from '../../context/SnackBarContext';
import { warningActions } from '../../context/WarningContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function Competition() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const sendRefund=httpsCallable(functions, 'sendRefund');
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


  const { getDocument } = useRealtimeDocument();
  const navigate = useNavigate();
  const { removeFromDataBase, updateDatabase, addToDataBase } =
    useRealDatabase();

  const isWarningVisible = useSelector((state) => state.isWarningVisible);

const {document}=useGetDocument("competitions", id);
const {documents:members}=useGetDocuments(`communityMembers/${id}/users`);

  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
 

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

      const response=  await sendRefund({
        chargeId: document.chargeId,
      });

      
      const { error } = response.data;

      if (error) {
        setIsPending(false);
        dispatch(snackbarActions.showMessage({message:error, alertType:"error"}));
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
      dispatch(snackbarActions.showMessage({message:alertTranslations.notifications.wrong.winnerClaimError, alertType:"error"}));
      return;
    } else {
      removeFromDataBase("competitions", id);
      removeFromDataBase("communityChats", id);
      removeFromDataBase("communityMembers", id);
      setIsPending(false);
      navigate("/");
    }

    dispatch(snackbarActions.showMessage({message:`${alertTranslations.notifications.successfull.remove[selectedLanguage]}`, alertType:"success"}));

   
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
      dispatch(snackbarActions.showMessage({message:`${alertTranslations.notifications.successfull.leave[selectedLanguage]}`, alertType:"success"}));
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
      dispatch(snackbarActions.showMessage({message:`${alertTranslations.notifications.successfull.send[selectedLanguage]}`, alertType:"success"}));
   
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
      } ${!isDarkModed && "pattern-bg"}`}
    >
      {isPending && <Loader />}

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
          <div className="flex sm:flex-col xl:flex-row justify-between w-full gap-4 p-2 py-6">
            <div className={`h-full sm:w-full max-w-4xl gap-6 flex flex-col items-center justify-between rounded-md py-4 ${isDarkModed ? "text-white" : 'text-black'}`}>
              <p className="sm:text-2xl lg:text-4xl font-bold">
                {document.competitionTitle}
              </p>
              <div className="flex sm:flex-col gap-4 2xl:flex-row w-full justify-around border-t-2 border-accColor p-4">
                <div className='self-start'>
                  <h3 className=" text-lg font-semibold">
                    {document.competitionsName}
                  </h3>
                  <AllMembersModal users={members} />
             

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
                    className="btn bg-accColor hover:bg-info text-white border-none max-w-80"
                    onClick={sendJoiningRequest}
                  >
                    {reuseableTranslations.joinTo.competition[selectedLanguage]}{" "}
                    <FaUserPlus />
                  </button>
                )}
              </div>

              <div className="self-start gap-3">
              {document.prize.moneyPrize &&
                document.prize.moneyPrize.amount > 0 && (
                  <div className="p-2">
                    <p className="font-bold text-4xl">{competitionsTranslations.competitionObject.prizeFor[selectedLanguage]}</p>
                    <span className="text-2xl text-yellow-500 font-semibold">
                      {(document.prize.moneyPrize.amount / 100).toFixed(2)}{" "}
                      {document.prize.moneyPrize.currency.toUpperCase()}
                    </span>
                  </div>
                )}
              {document.prize.itemPrize !== undefined && (
                <>
                  <p className="text-3xl font-bold">{competitionsTranslations.competitionObject.prizeDetails[selectedLanguage]}:</p>
                  <p className="text-lg font-semibold">
                    {document.prize.itemPrize.title}
                  </p>
                </>
              )}
            </div>
              {document && document.description.trim() !== "" && (
                <div className={`flex flex-col ${isDarkModed ? "text-white" : 'text-black'} p-3 w-full`}>
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
