import './stylings/datepicker.css';

import {
  useRef,
  useState,
} from 'react';

import {
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { motion } from 'framer-motion';
import AvatarEditor from 'react-avatar-editor';
import {
  FaBook,
  FaImage,
  FaWindowClose,
} from 'react-icons/fa';
import { GiSwordsPower } from 'react-icons/gi';
import { RiTeamFill } from 'react-icons/ri';
import generateUniqueId from 'react-id-generator';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import uniqid from 'uniqid';

import {
  Alert,
  Autocomplete,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import {
  addOptions,
  bookCategories,
  competitionTypes,
} from '../assets/CreateVariables';
import alertMessages from '../assets/translations/AlertMessages.json';
import translations from '../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../assets/translations/ReusableTranslations.json';
import Loader from '../components/Loader';
import { useAuthContext } from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import { useFirestore } from '../hooks/useFirestore';
import { useOrderedCollection } from '../hooks/useOrderedCollection';

function Create() {
  const [book, setBook] = useState({
    author: "",
    title: "",
    pagesNumber: 1,
    category: null,
    bookCover: null,
  });

  const [competition, setCompetition] = useState({
    competitionTitle: "",
    competitionsName: "",
    expiresAt: null,
    description: "",
  });

  const [readersClub, setReadersClub] = useState({
    clubsName: "",
    clubLogo: null,
    description: "",
    requiredPagesRead: 0,
  });

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [usersReadPages, setUsersReadPages] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [editCover, setEditCover] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [radius, setRadius] = useState(0);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState("");
  const [attachedUsers, setAttachedUsers] = useState([]);
  const { addDocument } = useFirestore(
    selectedToAdd?.toLowerCase().trim() === ""
      ? "books"
      : selectedToAdd?.toLowerCase()
  );
  const { updateDocument } = useFirestore("users");

  const { documents } = useCollection("users");
  const { orderedDocuments } = useOrderedCollection("clubs");
  const { user } = useAuthContext();
  const editorRef = useRef();

  const clubsOwned = orderedDocuments.filter(
    (doc) => doc.createdBy.id === user.uid
  );

  const clubsJoined = orderedDocuments.map((doc) => {
    return doc.users.filter((member) => member.value.id === user.uid);
  });

  let notCurrentUsers = documents
    .filter((doc) => {
      return (
        doc.id !== user.uid &&
        !attachedUsers.some((member) => member.value.id === doc.id)
      );
    })
    .map((user) => {
      return {
        label: user.nickname,
        value: {
          nickname: user.nickname,
          id: user.id,
          photoURL: user.photoURL,
        },
      };
    });

  const navigate = useNavigate();

  const handleSelect = (e) => {
    setError(null);
    setEditCover(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected.size > 200000) {
      setError(alertMessages.notficactions.wrong.tooBigFile[selectedLanguage]);
      setEditCover(null);
      return;
    }

    if (!selected.type.includes("image")) {
      setError(alertMessages.notficactions.wrong.inAppropriateFile[selectedLanguage]);
      setEditCover(null);
      return;
    }

    if (selected === null) {
      setError(
        alertMessages.notifications.wrong.selectAnything[selectedLanguage]
      );
      setEditCover(null);
      return;
    }

    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditCover(fileReader.result);
      };
      setError(null);
      return;
    }
  };

  const handleSaveCover = async () => {
    const editorImg = editorRef.current
      .getImageScaledToCanvas()
      .toDataURL("image/jpg");

    const byteCharacters = atob(editorImg.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const storageRef = ref(
      getStorage(),
      `book-covers/${user.uid}/${
        book.title ? book.title : `book${uniqid()}`
      }.jpg`
    );
    await uploadBytes(storageRef, byteArray);
    const url = await getDownloadURL(storageRef);
    console.log(url);

    if (selectedToAdd.toLowerCase() === "books") {
      setBook((book) => {
        book.bookCover = url;
        return book;
      });
    } else {
      setReadersClub((club) => {
        club.clubLogo = url;
        return club;
      });
    }

    setEditCover(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      if (selectedToAdd.toLowerCase() === "books") {
        const uniqueId = generateUniqueId("book-");

        if (book.category.trim() === "") {
          setError(
            alertMessages.notifications.wrong.emptyMessage[selectedLanguage]
          );
          setIsPending(false);
          toast.error(
            alertMessages.notifications.wrong.emptyMessage[selectedLanguage]
          );
          return;
        }

        if (book.pagesNumber < usersReadPages) {
          setError(
            alertMessages.notifications.wrong.outOfSpaceReading[
              selectedLanguage
            ]
          );
          return;
        }

        const bookElement = {
          author: book.author,
          title: book.title,
          pagesNumber: book.pagesNumber,
          photoURL: book.bookCover,
          category: book.category,
          likesData: {
            likesAmount: 0,
            likedBy: [],
          },
          readers: [
            {
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              startedReading: hasStarted,
              hasFinished: usersReadPages === book.pagesNumber,
              pagesRead: usersReadPages,
              bookRate: 0,
              dateOfFinish: isCompleted ? Timestamp.fromDate(new Date()) : null,
              recension: "",
              id: user.uid,
            },
          ],
          createdBy: {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: Timestamp.fromDate(new Date()),
            id: user.uid,
          },
          id: uniqueId,
        };

        console.log(bookElement);

        await addDocument(bookElement);

        toast.success(
          alertMessages.notifications.successfull.create[selectedLanguage]
        );
      }

      if (selectedToAdd.toLowerCase() === "competitions") {
        const uniqueId = generateUniqueId("competition-");

        await addDocument({
          competitionTitle: competition.competitionTitle,
          competitionsName: competition.competitionsName,
          expiresAt: Timestamp.fromDate(new Date(competition.expiresAt)),
          messages: [],
          users: [
            {
              label: user.displayName,
              value: {
                nickname: user.displayName,
                id: user.uid,
                photoURL: user.photoURL,
              },
            },
          ],
          description: competition.description,
          createdBy: {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: Timestamp.fromDate(new Date()),
            id: user.uid,
          },
          id: uniqueId,
        });

        attachedUsers.map(async (member) => {
          await updateDocument(member.value.uid, {
            notifications: arrayUnion({
              notificationContent: `You've been invited by ${user.displayName} to join the ${competition.competitionsName} competition.`,
              directedTo: member.value.id,
              linkTo: `/competitions`,
              isRead: false,
              notificationId: uniqid(),
              notificationTime: Timestamp.fromDate(new Date()),
              addedTo: competition.competitionsName,
            }),
          });
        });
      }

      if (selectedToAdd.toLowerCase() === "clubs") {
        if (
          clubsOwned.length > 0 ||
          clubsJoined.filter((club) => club.length !== 0).length > 0
        ) {
          setIsPending(false);
          toast.error(
            alertMessages.notifications.wrong.loyality[selectedLanguage]
          );
          return;
        }

        const uniqueId = generateUniqueId("readersClub-");

        await addDocument({
          clubsName: readersClub.clubsName,
          clubLogo: readersClub.clubLogo,
          messages: [],
          description: readersClub.description,
          requiredPagesRead: readersClub.requiredPagesRead,
          users: [
            {
              label: user.displayName,
              value: {
                nickname: user.displayName,
                id: user.uid,
                photoURL: user.photoURL,
              },
            },
          ],
          createdBy: {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: Timestamp.fromDate(new Date()),
            id: user.uid,
          },
          id: uniqueId,
        });

        attachedUsers.map(async (member) => {
          await updateDocument(member.value.id, {
            notifications: arrayUnion({
              notificationContent: `You've been invited by ${user.displayName} to ${readersClub.clubsName} club.`,
              directedTo: member.value.id,
              linkTo: `/readers-clubs`,
              notificationId: uniqid(),
              isRead: false,
              notificationTime: Timestamp.fromDate(new Date()),
              addedTo: readersClub.clubsName,
            }),
          });
        });
      }

      setIsPending(false);
      setError(null);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen h-full w-full flex flex-col justify-center items-center">
      {editCover && (
        <div class="h-screen bg-imgCover w-screen fixed top-0 left-0 z-[9999]">
          <button
            className="btn absolute top-0 right-0 m-2"
            onClick={() => {
              setEditCover(null);
            }}
          >
            <FaWindowClose /> {reuseableTranslations.closeBtn[selectedLanguage]}
          </button>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <AvatarEditor
              image={editCover}
              ref={editorRef}
              width={300}
              height={300}
              borderRadius={radius}
              color={[0, 0, 0, 0.5]}
              scale={zoomLevel}
            />

            <label className="flex flex-col m-2">
              <span>Zoom level: x{zoomLevel}</span>
              <input
                className="range range-info"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoomLevel}
                onChange={(e) => setZoomLevel(+e.target.value)}
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
            </label>

            <label className="flex flex-col m-2">
              <span>Radius level: {radius / 100}x</span>
              <input
                className="range range-info"
                type="range"
                min={0}
                max={150}
                step={1.5}
                value={radius}
                onChange={(e) => setRadius(+e.target.value)}
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
            </label>

            <div className="flex justify-center items-center">
              <button
                className="btn bg-accColor mt-4 text-white"
                onClick={handleSaveCover}
              >
                {reuseableTranslations.saveBtn[selectedLanguage]}
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-full"
      >
        <div className="flex justify-around items-center h-full w-full sm:flex-col xl:flex-row">
          <div className="flex flex-col gap-2 p-4 sm:w-full xl:w-1/2 justify-center">
            <h2>{translations.selectionQuery[selectedLanguage]}?</h2>

            <Autocomplete
              renderInput={(params) => (
                <TextField {...params} label="Form type" />
              )}
              options={addOptions}
              className="sm:w-full lg:w-3/4 xl:w-1/2"
              onChange={(e, value) => {
                setSelectedToAdd(value);
                console.log(selectedToAdd);
              }}
              onInputChange={(e, value) => {
                setSelectedToAdd(value);
                console.log(selectedToAdd);
              }}
            />
          </div>

          <div className="p-4 sm:w-full lg:w-3/4 xl:w-1/2">
            {selectedToAdd === "Books" && (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="bg-accColor text-white p-6 rounded-lg w-full"
                >
                  <div className="flex flex-col justify-center items-center w-full gap-2 p-2">
                    <FaBook className="text-6xl font-bold" />
                    <p className="text-center">
                      {translations.topText.books[selectedLanguage]}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-2">
                    <label className="flex flex-col">
                      <span>
                        {translations.bookTitleInput.label[selectedLanguage]}:
                      </span>
                      <input
                        required
                        type="text"
                        className="input border-none outline-none w-full py-4 px-1"
                        onChange={(e) =>
                          setBook((book) => {
                            book.title = e.target.value;
                            return book;
                          })
                        }
                        placeholder={`${translations.bookTitleInput.placeholder[selectedLanguage]}`}
                      />
                    </label>
                    <label className="flex flex-col">
                      <span>
                        {translations.bookAuthorInput.label[selectedLanguage]}:
                      </span>
                      <input
                        required
                        type="text"
                        onChange={(e) =>
                          setBook((book) => {
                            book.author = e.target.value;
                            return book;
                          })
                        }
                        className="input border-none outline-none w-full py-4 px-1"
                        placeholder={`${translations.bookAuthorInput.placeholder[selectedLanguage]}`}
                      />
                    </label>

                    <label className="flex flex-col">
                      <span>
                        {translations.bookCategoryInput.label[selectedLanguage]}
                        :
                      </span>

                      <Autocomplete
                        className="text-white"
                        sx={{
                          color: "white",
                          borderColor: "white",
                          colorAdjust: "white",
                        }}
                        options={bookCategories}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={`${translations.bookCategoryInput.label[selectedLanguage]}`}
                          />
                        )}
                        onChange={(e, value) => {
                          setBook((book) => {
                            book.category = value;
                            return book;
                          });
                        }}
                        onInputChange={(e, value) => {
                          setBook((book) => {
                            book.category = value;
                            return book;
                          });
                        }}
                      />
                    </label>
                    <label className="flex flex-col">
                      <span>
                        {translations.selectImgBtn.label[selectedLanguage]}:
                      </span>
                      <div className="flex items-center justify-center">
                        <input
                          required
                          type="file"
                          onChange={handleSelect}
                          className="hidden"
                        />
                        <p className="btn btn-wide bg-primeColor text-white border-none hover:bg-lime-700">
                          {translations.selectImgBtn.text[selectedLanguage]}
                          <FaImage />
                        </p>
                      </div>
                    </label>

                    <label className="flex flex-col">
                      <span>
                        {translations.pagesAmountInput.label[selectedLanguage]}:
                      </span>

                      <input
                        min={0}
                        required
                        type="number"
                        onChange={(e) =>
                          setBook((book) => {
                            book.pagesNumber = +e.target.value;
                            return book;
                          })
                        }
                        placeholder={`${translations.pagesAmountInput.placeholder[selectedLanguage]}`}
                        className="input border-none outline-none w-full py-4 px-1"
                      />
                    </label>

                    <div className="form-control justify-center">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          {translations.hasStarted.query[selectedLanguage]}?
                        </span>

                        <input
                          type="checkbox"
                          className="checkbox"
                          onChange={(e) => {
                            setHasStarted(e.target.checked);
                          }}
                        />
                      </label>
                    </div>
                    {hasStarted && (
                      <>
                        <div className="form-control justify-center">
                          <label className="flex flex-col">
                            <span className="label-text">
                              {
                                translations.readPagesInput.label[
                                  selectedLanguage
                                ]
                              }
                              ?
                            </span>
                            <input
                              className="input border-none outline-none w-full py-4 px-1"
                              type="number"
                              value={usersReadPages}
                              min={0}
                              max={book.pagesNumber}
                              onChange={(e) => {
                                if (+e.target.value === book.pagesNumber) {
                                  setIsCompleted(true);
                                  return;
                                }

                                if (+e.target.value > book.pagesNumber) {
                                  setIsCompleted(false);
                                  setUsersReadPages(book.pagesNumber);
                                  return;
                                }

                                setUsersReadPages(+e.target.value);
                              }}
                            />
                          </label>
                        </div>

                        <div className="form-control justify-center">
                          <label className="label cursor-pointer">
                            <span className="label-text">
                              {translations.hasFinished.query[selectedLanguage]}
                              ?
                            </span>
                            <input
                              type="checkbox"
                              className="checkbox"
                              onChange={(e) => {
                                setIsCompleted(e.target.checked);
                                if (e.target.checked) {
                                  setUsersReadPages(book.pagesNumber);
                                } else {
                                  setUsersReadPages(0);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex w-full justify-center items-center my-4">
                    <button className="btn sm:w-full md:w-1/2 bg-primeColor">
                      {translations.submit[selectedLanguage]}
                    </button>
                  </div>

                  {error && (
                    <Alert className="bg-transparent" severity="error">
                      {error}
                    </Alert>
                  )}
                </form>
              </>
            )}
            {selectedToAdd === "Competitions" && (
              <form
                onSubmit={handleSubmit}
                className="bg-accColor text-white p-6 rounded-lg sm:w-full"
              >
                <div className="flex flex-col justify-center items-center gap-2 py-4 mb-2">
                  <GiSwordsPower className="text-6xl font-semibold" />
                  <p className="text-center">
                    {translations.topText.competitions[selectedLanguage]}
                  </p>
                </div>

                <div className="flex mb-4 w-full justify-around items-center sm:flex-col lg:flex-row gap-2">
                  <label className="flex flex-col sm:w-full xl:w-2/5">
                    <span>
                      {translations.bookTitleInput.label[selectedLanguage]}:
                    </span>
                    <input
                      type="text"
                      required
                      className="input border-none outline-none w-full py-4 px-1"
                      placeholder={`${translations.bookTitleInput.placeholder[selectedLanguage]}`}
                      onChange={(e) =>
                        setCompetition((competition) => {
                          competition.competitionTitle = e.target.value;
                          return competition;
                        })
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-2 sm:w-full xl:w-2/5">
                    <span>
                      {translations.expirationDateInput.label[selectedLanguage]}
                      :
                    </span>

                    <DatePicker
                      label={`${translations.expirationDateInput.label[selectedLanguage]}`}
                      className="myDatePicker w-full"
                      sx={{
                        svg: { color: "#fff" },
                        input: { color: "#fff" },
                      }}
                      onChange={(newValue) => {
                        console.log(new Date(newValue.$d));
                        setCompetition((competition) => {
                          competition.expiresAt = new Date(newValue.$d);
                          return competition;
                        });
                      }}
                    />
                  </label>
                </div>
                <div className="flex w-full justify-around items-center sm:flex-col lg:flex-row gap-2">
                  <label className="flex flex-col sm:w-full xl:w-2/5">
                    <span>
                      {translations.membersInput.label[selectedLanguage]}:
                    </span>
                    <CreatableSelect
                      className="text-black w-full"
                      isMulti
                      isClearable
                      isSearchable
                      options={notCurrentUsers}
                      onChange={(e) => {
                        setAttachedUsers(e);
                      }}
                    />
                  </label>

                  <label className="sm:w-full xl:w-2/5">
                    <span>
                      {translations.competitionCategory.label[selectedLanguage]}
                      :
                    </span>
                    <CreatableSelect
                      className="text-black w-full"
                      options={competitionTypes}
                      onChange={(e) => {
                        setCompetition((competition) => {
                          competition.competitionsName = e.value;
                          return competition;
                        });
                      }}
                    />
                  </label>
                </div>

                <label className="flex flex-col">
                  <span>
                    {translations.descriptionTextarea.label[selectedLanguage]}:
                  </span>
                  <textarea
                    className="outline-none h-48 resize-none py-1 rounded-lg"
                    placeholder={`${translations.descriptionTextarea.placeholder[selectedLanguage]}`}
                    onChange={(e) =>
                      setCompetition((competition) => {
                        competition.description = e.target.value;
                        return competition;
                      })
                    }
                  ></textarea>
                </label>

                <div className="flex justify-center items-center my-2 p-2 w-full ">
                  <button className="btn sm:w-full md:w-1/2">
                    {translations.submit[selectedLanguage]}
                  </button>
                </div>
                {error && (
                  <Alert className="bg-transparent" severity="error">
                    {error}
                  </Alert>
                )}
              </form>
            )}

            {selectedToAdd === "Clubs" && (
              <form
                onSubmit={handleSubmit}
                className="bg-accColor text-white p-6 rounded-lg"
              >
                <div className="flex flex-col justify-center items-center p-4">
                  <RiTeamFill className="text-4xl" />
                  <h2 className="text-2xl text-center py-2">
                    {translations.topText.clubs[selectedLanguage]}
                  </h2>
                  <p className="text-center">
                    {translations.topText.clubs.underText[selectedLanguage]}
                  </p>
                </div>

                <div className="flex w-full flex-wrap justify-around items-center gap-2">
                  <label className="flex flex-col sm:w-full lg:w-2/5">
                    <span>
                      {translations.clubsNameInput.label[selectedLanguage]}:
                    </span>
                    <input
                      required
                      type="text"
                      className="input border-none outline-none w-full py-4 px-1"
                      placeholder={`${translations.clubsNameInput.placeholder[selectedLanguage]}`}
                      onChange={(e) =>
                        setReadersClub((club) => {
                          club.clubsName = e.target.value;
                          return club;
                        })
                      }
                    />
                  </label>
                  <label className="flex flex-col sm:w-full lg:w-2/5">
                    <span>
                      {" "}
                      {translations.membersInput.label[selectedLanguage]}:
                    </span>
                    <CreatableSelect
                      className="text-black w-full"
                      options={notCurrentUsers}
                      isMulti
                      isClearable
                      isSearchable
                      onChange={(e) => {
                        setAttachedUsers(e);
                      }}
                    />
                  </label>
                  <label className="flex flex-col items-center sm:w-full lg:w-1/2 2xl:w-2/5">
                    <span>
                      {translations.clubsLogoInput.label[selectedLanguage]}:
                    </span>
                    <div className="flex items-center justify-center w-full p-2">
                      <input
                        type="file"
                        required
                        onChange={handleSelect}
                        className="hidden"
                      />
                      <p className="btn sm:w-full bg-primeColor text-white border-none hover:bg-lime-700">
                        {translations.selectImgBtn.text[selectedLanguage]}{" "}
                        <FaImage />
                      </p>
                    </div>
                  </label>

                  <label className="flex flex-col sm:w-full lg:w-1/2 2xl:w-2/5">
                    <span className="label-text">
                      {translations.requiredPagesToJoin.label[selectedLanguage]}
                    </span>
                    <input
                      className="input border-none outline-none w-full"
                      placeholder={`${translations.requiredPagesToJoin.placeholder[selectedLanguage]}`}
                      type="number"
                      min={0}
                      step={10}
                      onChange={(e) => {
                        setReadersClub((club) => {
                          club.requiredPagesRead = +e.target.value;
                          return club;
                        });
                      }}
                    />
                  </label>
                </div>
                <label className="flex flex-col">
                  <span>
                    {translations.descriptionTextarea.label[selectedLanguage]}:
                  </span>
                  <textarea
                    className="outline-none h-48 resize-none py-1 rounded-lg"
                    placeholder={`${translations.descriptionTextarea.placeholder[selectedLanguage]}`}
                    onChange={(e) =>
                      setReadersClub((club) => {
                        club.description = e.target.value;
                        return club;
                      })
                    }
                  ></textarea>
                </label>

                <div className="flex w-full justify-center items-center p-2 my-2">
                  <button className="btn sm:w-full md:w-1/2">
                    {translations.submit[selectedLanguage]}
                  </button>
                </div>

                {error && (
                  <Alert className="bg-transparent" severity="error">
                    {error}
                  </Alert>
                )}
              </form>
            )}

            {(selectedToAdd === "" || !selectedToAdd) && (
              <div className="flex flex-col justify-center items-center h-full sm:w-full lg:w-1/2">
                <div className="h-1/2 w-full border-2 p-16">
                  <h1 className="text-xl font-bold text-center">
                    {translations.nothingSelected[selectedLanguage]} 😥
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {isPending && <Loader />}
    </div>
  );
}

export default Create;
