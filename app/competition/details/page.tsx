import '../stylings/scrollbarStyling.css';
import '../stylings/backgrounds.css';

import React, { useState } from 'react';

import { increment } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import { BsFillDoorOpenFill } from 'react-icons/bs';
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
} from 'react-icons/fa';
import {
  FaBook,
  FaMoneyBillWave,
  FaTicket,
  FaTicketSimple,
  FaUser,
} from 'react-icons/fa6';
import { FiType } from 'react-icons/fi';
import { GrUserManager } from 'react-icons/gr';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router';
import { Link } from 'react-router-dom';

import {
  Button,
  Menu,
  MenuItem,
} from '@mui/material';

import { functions } from '../../';
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
import { snackbarActions } from '../../context/SnackBarContext';
import { warningActions } from '../../context/WarningContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function GeneralInfo() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [managmentEl, setManagmentEl] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { getDocument } = useRealtimeDocument();
  const { removeFromDataBase, updateDatabase } = useRealDatabase();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const sendRefund=httpsCallable(functions, "sendRefund");
const dispatch=useDispatch();
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
  const { document } = useGetDocument("competitions", id);
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

      const response =  await sendRefund({
        chargeId: document.chargeId,
      });
   

      const { error } =  response.data;

      if (error) {
        setIsPending(false);
        dispatch(snackbarActions.showMessage({message:error, alertType:"error"}));
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
      dispatch(snackbarActions.showMessage({message:"The winner has to claim the reward", alertType:"error"}));
      return;
    } else {
      removeFromDataBase("competitions", id);
      removeFromDataBase("communityChats", id);
      removeFromDataBase("communityMembers", id);
      setIsPending(false);
      navigate("/");
    }
    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.remove[selectedLanguage]}`, alertType:"success"}))
  };


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
      dispatch(snackbarActions.showMessage({message:`${ alertMessages.notifications.successfull.leave[selectedLanguage]}`, alertType:"success"}));
    }
  };

  const isWarningVisible = useSelector((state) => state.isWarningVisible);
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  return (
    <div className={`min-h-screen h-full ${!isDarkModed && "pattern-bg"}`}>
      {isPending && <Loader />}

      {document &&
        members.find(
          (member) =>
            member.value.id === user.uid && member.belongsTo === document.id
        ) && (
          <div className="w-full flex justify-between items-center p-3 bg-primeColor z-[99999] sticky sm:top-0 xl:top-[4.5rem] left-0">
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
        <div className="flex flex-col justify-between max-w-[95rem] gap-4 py-4">
          <div className={`h-full ${isDarkModed ? "text-white" : "text-black"} max-w-6xl flex flex-col items-center rounded-md py-4`}>
            <p className="sm:text-2xl lg:text-4xl font-bold border-b-2 border-accColor  p-4">
              {document.competitionTitle}
            </p>


            <div className="self-start sm:flex-col-reverse lg:flex-row px-2 py-6 flex gap-4 items-center">
               <AllMembersModal users={members} />
              {competitionExpirationDate > 0 && (
                  <p className="text-xl">
                    {
                      competitionTranslations.competitionObject.expiration
                        .notExpired.part1[selectedLanguage]
                    }{" "}
                    <span className="text-3xl font-bold text-red-500">
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
                  <p className="text-xl">
                    {
                      competitionTranslations.competitionObject.expiration
                        .Expired.part1[selectedLanguage]
                    }{" "}
                    <span className="text-3xl font-bold text-red-500">
                      {competitionExpirationDate <= -1
                        ? `${Math.round(competitionExpirationDate) * -1} ${
                            competitionTranslations.competitionObject.expiration
                              .Expired.part2.notToday[selectedLanguage]
                          }`
                        : ` ${competitionTranslations.competitionObject.expiration.Expired.part2.today[selectedLanguage]}`}
                    </span>
                  </p>
                )}
            </div>
            
           
              <div className="flex sm:flex-wrap sm:justify-around lg:justify-start lg:flex-nowrap lg:flex-row gap-4 w-full px-2" >

                <div className=" bg-accColor justify-between px-2 py-4 max-w-xs w-full rounded-lg flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <FiType size={36} />
                    <p className="text-2xl">Type</p>
                  </div>
                  <p className="text-lg">{document.competitionsName}</p>
                </div>
                
                <div className="bg-accColor justify-between px-2 py-4 max-w-xs w-full rounded-lg flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <FaUser size={36}/>
                    <p className="text-2xl"> {members.filter((member) => member.belongsTo === document.id).length}</p>
                  </div>
                  <p className="text-lg">{
                    translations.competitionObject.membersAttending[
                      selectedLanguage
                    ]
                  }</p>
                </div>

           <div className="bg-accColor justify-between px-2 py-4 max-w-xs w-full rounded-lg flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <GrUserManager size={32} />
     <Link
                    className="link hover:text-yellow-400 duration-500 transition-all"
                    to={`/user/profile/${document.createdBy.id}`}
                  >
          <img className="w-12 h-12 rounded-full" src={document.createdBy.photoURL} alt="" />    
                  </Link>
            </div>
             
          <p className="text-lg">{reuseableTranslations.createdBy[selectedLanguage]}</p>
           </div>
              
               {document.prize.moneyPrize &&
                document.prize.moneyPrize.amount > 0 && (
                <div className="bg-accColor justify-between px-2 py-4 max-w-xs w-full rounded-lg flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <FaMoneyBillWave />
                    <span className="text-2xl text-yellow-500 font-semibold">
                      {(document.prize.moneyPrize.amount / 100).toFixed(2)}{" "}
                      {document.prize.moneyPrize.currency.toUpperCase()}
                    </span>
                  </div>
                    <p className="font-bold text-yellow-500 text-lg">{translations.competitionObject.prizeFor[selectedLanguage]}</p>
                  </div>
                )}
              {document.prize.itemPrize !== undefined && (
                <div className="bg-accColor justify-between px-2 py-4 max-w-xs w-full rounded-lg flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    {document.prize.itemPrize.typeOfPrize === "book" ? <FaBook size={36} /> : document.prize.itemPrize.typeOfPrize === "ticket" ? <FaTicket size={36}/> : <FaTicketSimple size={36}/>}
                      <p className="text-2xl capitalize font-semibold">
                    {document.prize.itemPrize.typeOfPrize}
                  </p>
                  </div>
                  <p className=" text-lg font-bold text-yellow-500">{translations.competitionObject.prizeFor[selectedLanguage]}</p>
                </div>
              )}
                
              </div>
         

            <div className="self-start gap-3 py-2 w-full">
            <p className="text-2xl font-bold">{translations.competitionObject.prizeDetails[selectedLanguage]}:</p>
             {document.prize.itemPrize !== undefined && (
                <div className="m-1 max-w-lg px-2 py-1 h-48 bg-accColor/20 rounded-lg border border-primeColor overflow-y-auto">
                  <p className="text-base font-semibold">
                    {document.prize.itemPrize.title}
                  </p>
                </div>
              )}
                
            </div>

            {document && document.description.trim() !== "" && (
              <div class={`flex flex-col gap-2 ${isDarkModed ? "text-white" : "text-black"} w-full`}>

                <h2 class="text-3xl font-bold">
                  {
                    formsTranslations.descriptionTextarea.label[
                      selectedLanguage
                    ]
                  }
                  :
                </h2>
                <p class="overflow-y-scroll overflow-x-hidden h-40 p-2 rounded-lg bg-accColor/20 max-w-xl mx-2">
                  {document.description}
                </p>
              </div>
            )}
                         
          </div>
          <div className="max-w-3xl p-2">    
          <Ranking
            expirationTimeNumber={document.expiresAt}
            communityMembers={members.filter(
              (member) => member.belongsTo === id
            )}
            communityObject={document}
            expirationTime={competitionExpirationDate}
          />
</div>
        </div>
      )}

      {isPending && <Loader />}

      {isWarningVisible && <Warning />}
    </div>
  );
}

export default GeneralInfo;
