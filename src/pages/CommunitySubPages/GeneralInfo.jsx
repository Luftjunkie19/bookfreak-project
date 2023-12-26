import '../stylings/scrollbarStyling.css';

import React, { useState } from 'react';

import { increment } from 'firebase/database';
import { BsFillDoorOpenFill } from 'react-icons/bs';
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
} from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Button,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material';

import alertMessages from '../../assets/translations/AlertMessages.json';
import competitionTranslations
  from '../../assets/translations/CompetitionsTranslations.json';
import translations
  from '../../assets/translations/CompetitionsTranslations.json';
import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import AllMembersModal from '../../components/AllMembersModal';
import Loader from '../../components/Loader';
import Ranking from '../../components/Ranking';
import Warning from '../../components/WarningsComponents/Warning';
import { warningActions } from '../../context/WarningContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function GeneralInfo() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { getDocument } = useRealtimeDocument();
  const { getDocuments } = useRealtimeDocuments();
  const { removeFromDataBase, updateDatabase } = useRealDatabase();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const [openState, setOpenState] = useState({
    open: false,
    message: "",
  });
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
  const { documentData: document } = useGetDocument("competitions", id);
  const { documents: members } = useGetDocuments(
    `communityMembers/${id}/users`
  );

  const competitionExpirationDate =
    document && (document.expiresAt - new Date().getTime()) / 86400000;

  const deleteCompetition = async (id) => {
    setIsPending(true);
    if (
      competitionExpirationDate > 0 &&
      !document.prizeHandedIn &&
      document.prize.moneyPrize &&
      !document.prize.itemPrize
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
      console.log(error, userDoc);

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
      alertMessages.notifications.successfull.remove[selectedLanguage]
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
        alertMessages.notifications.successfull.leave[selectedLanguage]
      );
    }
  };

  const isWarningVisible = useSelector((state) => state.isWarningVisible);

  return (
    <div className="min-h-screen h-full">
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
          (member) =>
            member.value.id === user.uid && member.belongsTo === document.id
        ) && (
          <div className="w-full flex justify-between items-center p-3 bg-primeColor z-[99999] sticky top-[4.5rem] left-0">
            <div className="flex flex-col text-white items-center">
              <p>{document.competitionTitle}</p>
              <p>{document.competitionsName}</p>
            </div>

            <div className="sm:hidden xl:flex justify-around items-center">
              <Link
                to={`/competition/${id}`}
                className="btn border-none bg-transparent text-white mx-2"
              >
                <FaFacebookMessenger />{" "}
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
                }
                <BsFillDoorOpenFill />
              </button>

              {document.createdBy.id === user.uid && (
                <div className="mx-2 flex justify-around items-center">
                  {competitionExpirationDate >= 0 && (
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
                    className="btn btn-error ml-2 text-white"
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
                    {competitionExpirationDate >= 0 && (
                      <MenuItem
                        onClick={() => {
                          navigate(`/edit-competition/${document.id}`);
                          handleCloseManagent();
                        }}
                      >
                        <Link className="flex justify-around items-center w-full">
                          {
                            reuseableTranslations.communitiesBar.editBtn[
                              selectedLanguage
                            ]
                          }{" "}
                          <FaPencilAlt />
                        </Link>
                      </MenuItem>
                    )}

                    <MenuItem
                      onClick={() => {
                        handleCloseManagent();
                        deleteCompetition(document.id);
                      }}
                    >
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
        <div className="flex sm:flex-col xl:flex-row justify-between w-full items-center gap-4 py-4">
          <div className="h-full sm:w-full xl:w-2/5 gap-6 text-white flex flex-col items-center justify-between rounded-md py-4">
            <p className="sm:text-2xl lg:text-4xl font-bold">
              {document.competitionTitle}
            </p>
            <div className="flex sm:flex-col gap-4 2xl:flex-row w-full justify-around items-center border-t-2 border-accColor p-4">
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
                <AllMembersModal users={members} />
              </div>
            </div>
            <div className="self-start gap-3">
              {document.prize.moneyPrize &&
                document.prize.moneyPrize.amount > 0 && (
                  <div className="p-2">
                    <p className="font-bold text-4xl">Prize for the winner</p>
                    <span className="text-2xl text-yellow-500 font-semibold">
                      {(document.prize.moneyPrize.amount / 100).toFixed(2)}{" "}
                      {document.prize.moneyPrize.currency.toUpperCase()}
                    </span>
                  </div>
                )}
              {document.prize.itemPrize !== undefined && (
                <>
                  <p className="text-3xl font-bold">Details about the prize:</p>
                  <p className="text-lg font-semibold">
                    {document.prize.itemPrize.title}
                  </p>
                </>
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
                    <span className="text-2xl font-bold text-red-500">
                      {Math.round(competitionExpirationDate) > 0 && (
                        <span>
                          {
                            competitionTranslations.competitionObject.expiration
                              .notExpired.part2.notToday.expiresIN[
                              selectedLanguage
                            ]
                          }{" "}
                          {Math.round(competitionExpirationDate)}{" "}
                          {
                            competitionTranslations.competitionObject.expiration
                              .notExpired.part2.notToday[selectedLanguage]
                          }
                        </span>
                      )}
                      {Math.round(competitionExpirationDate) === 0 && (
                        <span>
                          {
                            competitionTranslations.competitionObject.expiration
                              .notExpired.part2.today[selectedLanguage]
                          }{" "}
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
                      {competitionExpirationDate <= -1
                        ? `${Math.round(competitionExpirationDate) * -1} ${
                            competitionTranslations.competitionObject.expiration
                              .Expired.part2.notToday[selectedLanguage]
                          }`
                        : ` ${competitionTranslations.competitionObject.expiration.Expired.part2.today[selectedLanguage]}`}
                    </span>
                  </p>
                )}

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
            expirationTimeNumber={document.expiresAt}
            communityMembers={members.filter(
              (member) => member.belongsTo === id
            )}
            communityObject={document}
            expirationTime={competitionExpirationDate}
          />
        </div>
      )}

      {isPending && <Loader />}

      {isWarningVisible && <Warning />}
    </div>
  );
}

export default GeneralInfo;
