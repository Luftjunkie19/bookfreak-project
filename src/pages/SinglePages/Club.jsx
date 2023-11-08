import { useEffect, useState } from "react";

import { BsFillDoorOpenFill } from "react-icons/bs";
import {
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTrashAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Button, Menu, MenuItem } from "@mui/material";

import alertTranslations from "../../assets/translations/AlertMessages.json";
import translations from "../../assets/translations/ClubsTranslations.json";
import formsTranslations from "../../assets/translations/FormsTranslations.json";
import reusableTranslations from "../../assets/translations/ReusableTranslations.json";
import CompetitionChat from "../../components/ChatComponents/CommunityChat";
import Ranking from "../../components/Ranking";
import { warningActions } from "../../context/WarningContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocument from "../../hooks/useRealtimeDocument";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

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
  const { removeFromDataBase } = useRealDatabase();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadDocument = async () => {
    const loadDocumentEl = await getDocument("readersClubs", id);

    if (loadDocumentEl) {
      setDocument(loadDocumentEl);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadMembers = async () => {
    const memberElements = await getDocuments("communityMembers");

    const realObjects = memberElements.map((bookReader) => {
      return bookReader.users;
    });

    const newArray = realObjects.map((obj) => {
      const nestedObject = Object.values(obj)[0];

      return nestedObject;
    });

    setMembers(newArray);
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

  const open = Boolean(anchorEl);
  const openMangement = Boolean(managmentEl);

  {
    /*  const joinedClub = documents.map((doc) => {
    return doc.users.filter((member) => member.value.id === user.uid);
  });
*/
  }
  const deleteClub = async (id) => {
    removeFromDataBase("readersClubs", id);
    removeFromDataBase("communityChats", id);
    removeFromDataBase("communityMembers", id);

    navigate("/");
    toast.success(
      alertTranslations.notifications.successfull.remove[selectedLanguage]
    );
  };

  const leaveClub = async () => {
    const arrayWithoutYou = document.users.filter(
      (doc) => doc.value.id !== user.uid
    );

    if (arrayWithoutYou && document.createdBy.id === user.uid) {
      dispatch(
        warningActions.openWarning({
          referedTo: document.id,
          typeOf: "club",
          collection: "clubs",
        })
      );
      return;
    }

    navigate("/");
    toast.success(
      alertTranslations.notifications.successfull.leave[selectedLanguage]
    );
  };

  const sendJoiningRequest = async () => {
    try {
      {
        /** 
      if (joinedClub.filter((club) => club.length !== 0).length > 0) {
        toast.error(
          alertTranslations.notifications.wrong.loyality[selectedLanguage]
        );
        return;
      }

      const clubObject = doc(getFirestore(), "users", document.createdBy.id);

      await updateDoc(clubObject, {
        notifications: arrayUnion({
          requestContent: `${user.displayName} sent a request to join ${document.clubsName}`,
          directedTo: `${document.createdBy.id}`,
          clubToJoin: `${document.id}`,
          isRead: false,
          requestTo: "clubs",
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
*/
      }
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
          <div className="w-full flex justify-between items-center p-3 bg-accColor">
            <div className="flex justify-between text-white items-center">
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={document.clubLogo}
                alt=""
              />
              <p className="ml-2">{document.clubsName}</p>
            </div>

            <div className="sm:hidden xl:flex justify-around items-center">
              <Link to={`/readers-clubs/${id}`} className="btn mx-2">
                <FaFacebookMessenger />{" "}
                {reusableTranslations.communitiesBar.chatBtn[selectedLanguage]}
              </Link>

              <Link className="btn mr-2" to={`/readers-clubs/${id}/overall`}>
                <FaInfo />{" "}
                {
                  reusableTranslations.communitiesBar.overallBtn[
                    selectedLanguage
                  ]
                }
              </Link>

              <button className="btn" onClick={leaveClub}>
                {reusableTranslations.communitiesBar.leaveBtn[selectedLanguage]}{" "}
                <BsFillDoorOpenFill />{" "}
              </button>
              {document && document.createdBy.id === user.uid && (
                <div className="mx-2 flex justify-around items-center">
                  <button
                    className="btn"
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
                    className="btn ml-2"
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
                      <Link className="flex justify-around items-center w-full">
                        {
                          reusableTranslations.communitiesBar.editBtn[
                            selectedLanguage
                          ]
                        }{" "}
                        <FaPencilAlt />
                      </Link>
                    </MenuItem>

                    <MenuItem onClick={handleCloseManagent}>
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
          <div className="flex justify-between items-center w-full h-full sm:flex-col xl:flex-row px-4 py-4 gap-6">
            <div className="sm:w-full xl:w-1/3 h-full text-white flex flex-col items-center justify-between rounded-md py-4">
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
