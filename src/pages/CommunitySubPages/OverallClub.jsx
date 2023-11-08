import React, {
  useEffect,
  useState,
} from 'react';

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
import { toast } from 'react-toastify';

import {
  Button,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import alertMessages from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/ClubsTranslations.json';
import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import reusableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import { warningActions } from '../../context/WarningContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

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
  const { getDocuments } = useRealtimeDocuments();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getDocument } = useRealtimeDocument();
  const [members, setMembers] = useState([]);
  const [document, setDocument] = useState();
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
    loadMembers();
    loadDocument();
  }, [loadDocument, loadMembers]);

  const getReadBooks = (id) => {
    return [].length;
  };

  const getlastBookRead = (id) => {
    const lastBookTitle = { title: null }.title;

    if (lastBookTitle) {
      return lastBookTitle;
    } else {
      return "No data yet.";
    }
  };

  const leaveClub = async () => {
    const arrayWithoutYou = members.filter((doc) => doc.value.id !== user.uid);

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
      alertMessages.notifications.successfull.leave[selectedLanguage]
    );
  };

  const deleteClub = async (id) => {
    removeFromDataBase("readersClubs", id);
    removeFromDataBase("communityChats", id);
    removeFromDataBase("communityMembers", id);

    navigate("/");
    toast.success(
      alertMessages.notifications.successfull.update[selectedLanguage]
    );
  };

  return (
    <div className="min-h-screen h-full">
      {document &&
        members.find((member) => {
          return member.value.id === user.uid && member.belongsTo === id;
        }) && (
          <div className="w-full flex justify-between items-center p-3">
            <div className="flex justify-between text-white items-center">
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={document.clubLogo}
                alt=""
                onClick={() => {
                  console.log(members);
                }}
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
                {reusableTranslations.communitiesBar.leaveBtn[selectedLanguage]}
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
                    }
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

      {document && (
        <>
          <div className="flex sm:flex-col xl:flex-row w-full h-full justify-between items-center px-4 gap-5 flex-wrap">
            <div className="xl:h-1/2 sm:h-full xl:w-1/4 sm:w-4/5 py-6 flex justify-around items-center flex-col md:flex-row xl:flex-col gap-4">
              <div className="sm:w-36 sm:h-36 lg:w-64 lg:h-64">
                <img
                  className="w-full h-full rounded-full"
                  src={document.clubLogo}
                  alt=""
                />
              </div>
              <div className="text-white">
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
            </div>

            <TableContainer
              component={Paper}
              className="sm:w-full xl:w-3/5 bg-accColor"
            >
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      className="bg-primeColor font-bold text-lg text-center"
                      sx={{ color: "#fff" }}
                    >
                      Avatar
                    </TableCell>
                    <TableCell
                      className="bg-primeColor text-center font-bold text-lg"
                      sx={{ color: "#fff" }}
                    >
                      Nickname
                    </TableCell>
                    <TableCell
                      className="bg-primeColor text-center font-bold text-lg"
                      sx={{ color: "#fff" }}
                    >
                      Books Read
                    </TableCell>
                    <TableCell
                      className="bg-primeColor font-bold text-lg text-center"
                      sx={{ color: "#fff" }}
                    >
                      Current book
                    </TableCell>
                    <TableCell
                      className="bg-primeColor font-bold text-lg text-center"
                      sx={{ color: "#fff" }}
                    >
                      Pages read
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {document &&
                    members
                      .filter((member) => member.belongsTo === id)
                      .map((user) => (
                        <TableRow
                          key={user.value.uid}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            className="border-r-white border-r-2"
                            sx={{ color: "#fff" }}
                          >
                            <Link to={`/user/profile/${user.value.id}`}>
                              <div className="w-16 h-16">
                                <img
                                  className="w-full h-full rounded-full"
                                  src={user.value.photoURL}
                                  alt=""
                                />
                              </div>
                            </Link>
                          </TableCell>

                          <TableCell
                            component="th"
                            scope="row"
                            className="border-r-white border-r-2"
                            sx={{ color: "#fff" }}
                          >
                            <p>{user.value.nickname}</p>
                          </TableCell>
                          <TableCell
                            sx={{ color: "#fff" }}
                            component="th"
                            scope="row"
                            className="border-r-white border-r-2"
                          >
                            <p className="text-center">
                              {getReadBooks(user.value.id)}{" "}
                              {getReadBooks(user.value.id) > 1
                                ? "books"
                                : "book"}
                            </p>
                          </TableCell>
                          <TableCell
                            sx={{ color: "#fff" }}
                            component="th"
                            scope="row"
                            className="border-r-white border-r-2"
                          >
                            <p className="text-center">
                              {getlastBookRead(user.value.id)}
                            </p>
                          </TableCell>
                          <TableCell
                            sx={{ color: "#fff" }}
                            component="th"
                            scope="row"
                          >
                            <p>
                              {[]
                                .filter((book) =>
                                  book.readers.find(
                                    (reader) =>
                                      reader.id === user.value.id &&
                                      reader.pagesRead === book.pagesNumber
                                  )
                                )
                                .reduce(
                                  (prev, cur) => prev + cur?.pagesNumber,
                                  0
                                )}{" "}
                              Pages
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default OverallClub;
