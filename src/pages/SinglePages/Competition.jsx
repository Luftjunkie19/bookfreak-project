import { useState } from "react";

import {
  arrayUnion,
  doc,
  getFirestore,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { BsFillDoorOpenFill } from "react-icons/bs";
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button, Menu, MenuItem } from "@mui/material";

import alertTranslations from "../../assets/translations/AlertMessages.json";
import competitionTranslation from "../../assets/translations/CompetitionsTranslations.json";
import translations from "../../assets/translations/FormsTranslations.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";
import CompetitionChat from "../../components/ChatComponents/CommunityChat";
import Ranking from "../../components/Ranking";
import { warningActions } from "../../context/WarningContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";

function Competition() {
  {
    /*{Math.round(timesDifference / (1000 * 60 * 60 * 24)) > 0
                    ? "The competition expires in"
                    : "has expired"}{" "} */
  }
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
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { id } = useParams();
  const { user } = useAuthContext();
  const { document } = useDocument("competitions", id);
  const navigate = useNavigate();
  const { deleteDocument, updateDocument } = useFirestore("competitions");
  const deleteCompetition = async (id) => {
    await deleteDocument(id);
    navigate("/");

    toast.success(
      alertTranslations.notifications.successfull.remove[selectedLanguage]
    );
  };

  const dispatch = useDispatch();

  const expirationTime =
    document && new Date(document.expiresAt.toDate()).getTime();

  let timesDifference = expirationTime - new Date().getTime();

  const leaveCompetition = async () => {
    const arrayWithoutYou = document.users.filter(
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
    }

    await updateDocument(document.id, {
      users: arrayWithoutYou,
    });

    navigate("/");
    toast.success(
      alertTranslations.notifications.successfull.leave[selectedLanguage]
    );
  };

  const sendJoiningRequest = async () => {
    try {
      const documentObject = doc(
        getFirestore(),
        "users",
        document.createdBy.id
      );

      await updateDoc(documentObject, {
        notifications: arrayUnion({
          requestContent: `${user.displayName} sent a request to join ${document.competitionTitle}`,
          directedTo: `${document.createdBy.id}`,
          clubToJoin: `${document.id}`,
          isRead: false,
          requestTo: "competitions",
          notificationTime: Timestamp.fromDate(new Date()),
          joinerData: {
            label: `${user.displayName}`,
            value: {
              id: `${user.uid}`,
              nickname: `${user.displayName}`,
              photoURL: `${user.photoURL}`,
            },
          },
        }),
      });

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
        !document.users.find((member) => member.value.id === user.uid) &&
        "flex flex-col justify-center items-center"
      }`}
    >
      {document &&
        document.users.find((member) => member.value.id === user.uid) && (
          <div className="w-full flex justify-between items-center p-3 bg-accColor">
            <div className="flex flex-col text-white items-center">
              <p>{document.competitionTitle}</p>

              <p>{document.competitionsName}</p>
            </div>

            {
              <div className="sm:flex sm:flex-col md:flex-row sm:justify-between sm:items-center gap-5 xl:hidden">
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
              <Link to={`/competition/${id}`} className="btn mx-2">
                <FaFacebookMessenger />
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
                }{" "}
                <BsFillDoorOpenFill />
              </button>

              {document.createdBy.id === user.uid && (
                <div className="mx-2 flex justify-around items-center">
                  {Math.round(timesDifference / (1000 * 60 * 60 * 24)) > 0 && (
                    <button
                      className="btn"
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
          </div>
        )}

      {document &&
        document.users.filter((member) => {
          return member.value.id === user.uid;
        }).length === 0 && (
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
                  <p className=" font-medium">
                    {document.users.length}{" "}
                    {
                      competitionTranslation.competitionObject.membersAttending[
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

                <button
                  className="btn bg-accColor hover:bg-info text-white border-none"
                  onClick={sendJoiningRequest}
                >
                  {reuseableTranslations.joinTo.competition[selectedLanguage]}{" "}
                  <FaUserPlus />
                </button>
              </div>
              {document && document.description.trim() !== "" && (
                <div class="flex flex-col text-white p-3 w-full">
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
              users={document.users}
              rankingOf={"competition"}
              timeDifference={timesDifference}
            />
          </div>
        )}
      {document &&
        document.users.find((member) => member.value.id === user.uid) && (
          <CompetitionChat collectionName="competitions" id={document.id} />
        )}
    </div>
  );
}

export default Competition;
