import "./Login.css";
import "./Create.css";

import { useEffect, useRef, useState } from "react";

import { Timestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";
import { FaBook, FaTrophy, FaUsers } from "react-icons/fa";
import generateUniqueId from "react-id-generator";
import { useNavigate } from "react-router";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";

import Loader from "../components/Loader";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useFirestore } from "../hooks/useFirestore";
import { useOrderedCollection } from "../hooks/useOrderedCollection";
import { usePushNotifications } from "../hooks/usePushNotifications";

function Create() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [pagesNumber, setPagesNumber] = useState(0);
  const [readPages, setReadPages] = useState(0);
  const [cover, setCover] = useState(null);
  const [error, setError] = useState("");
  const [isNotCompleted, setIsNotCompleted] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [category, setCategory] = useState("");
  const [selectedToAdd, setSelectedToAdd] = useState("");
  const { addDocument } = useFirestore(
    selectedToAdd.toLowerCase() === "" ? "books" : selectedToAdd.toLowerCase()
  );
  const { documents } = useCollection("users");
  const { orderedDocuments } = useOrderedCollection("competitions");
  const { user } = useAuthContext();
  const recensionArea = useRef();
  const [competitionsName, setCompetitionsName] = useState("");
  const [description, setDescription] = useState("");
  const [attachedUsers, setAttachedUsers] = useState([]);
  const { pushNotification } = usePushNotifications();
  const [isRecommendable, setIsRecommendable] = useState(false);
  const [expirationDate, setExpirationDate] = useState();

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

  const addOptions = [
    { value: "Books", label: "Books" },
    { value: "Competitions", label: "Competitions" },
    { value: "Clubs", label: "Clubs" },
  ];

  const bookCategories = [
    { value: "Fiction", label: "Fiction" },
    { value: "Non-fiction", label: "Non-fiction" },
    { value: "Crime", label: "Crime" },
    {
      value: "Science fiction and fantasy",
      label: "Science fiction and fantasy",
    },
    {
      value: "Children's and young adult literature",
      label: "Children's and young adult literature",
    },
    {
      value: "Travel and adventure literature",
      label: "Travel and adventure literature",
    },
    {
      value: "Popular science and popular history",
      label: "Popular science and popular history",
    },
    {
      value: "Self-help and personal development",
      label: "Self-help and personal development",
    },
    {
      value: "History and culture",
      label: "History and culture",
    },
    { value: "Art and design", label: "Art and design" },
    { value: "Business and economics", label: "Business and economics" },
    { value: "Psychology and philosophy", label: "Psychology and philosophy" },
    { value: "Health and medicine", label: "Health and medicine" },
    { value: "Erotic literature", label: "Erotic literature" },
  ];

  const competitionTypes = [
    { value: "First read, first served", label: "First read, first served" },
    {
      value: "Lift others, rise",
      label: "Lift others, rise",
    },
    { value: "Teach to fish", label: "Teach to fish" },
  ];

  useEffect(() => {
    if (pagesNumber === readPages) {
      setIsNotCompleted(false);
      recensionArea.current.disabled = isNotCompleted;
      recensionArea.current.placeholder = "Now you can type your recension 😄";
    } else {
      setIsNotCompleted(true);
      recensionArea.current.disabled = isNotCompleted;
      recensionArea.current.placeholder =
        "So long the book won't have the book read, so long will you wait to give a recension 😋.";
      recensionArea.current.value = "";
      setIsRecommendable(false);
    }
  }, [recensionArea, readPages, pagesNumber, isNotCompleted]);

  const condition = readPages === pagesNumber;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      if (selectedToAdd === "Books") {
        const uploadPath = `cover/uid${user.uid}/${cover.name}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, cover);
        const photoURL = await getDownloadURL(image);

        const uniqueId = generateUniqueId("book-");

        if (readPages > pagesNumber) {
          setError(
            "The amount of read pages cannot be higher than the amount of overall pages of the book."
          );
          setIsPending(false);
          toast.dark("Tell me, how have you done it?");
          return;
        }

        if (category.trim() === "") {
          setError("Category field is empty.");
          setIsPending(false);
          toast.error("You cannot leave category field empty");
          return;
        }

        const recensionContent = recensionArea.current.value;

        await addDocument({
          author,
          title,
          pagesNumber,
          readPages,
          photoURL,
          category,
          isRecommendable,
          favouriteCount: 0,
          createdBy: {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: Timestamp.fromDate(new Date()),
            id: user.uid,
          },
          recension: {
            content: recensionContent,
            timeOfRecension: Timestamp.fromDate(new Date()),
          },
          id: uniqueId,
        });

        toast.success("Book added successfully");
      }

      if (selectedToAdd === "Competitions") {
        if (competitionsName.trim() === "" || attachedUsers.length < 2) {
          setIsPending(false);
          toast.error("At least 2 users needed to create a club.");
          return;
        }

        const uniqueId = generateUniqueId("competition-");

        await addDocument({
          competitionTitle: title,
          competitionsName,
          expiresAt: Timestamp.fromDate(expirationDate),
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
            ...attachedUsers,
          ],
          description,
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
          await pushNotification({
            notificationContent: `You've been added by ${user.displayName} to ${title} competition.`,
            directedTo: member.value.id,
            linkTo: `/competitions`,
            isRead: false,
            notificationTime: Timestamp.fromDate(new Date()),
            changeConcering: user.photoURL,
          });
        });
      }

      if (selectedToAdd === "Clubs") {
        if (attachedUsers.length < 1) {
          setIsPending(false);
          toast.error("Nie Pojebało Cię synu?");
          return;
        }

        const uploadPath = `clubLogo/uid${user.uid}/${cover.name}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, cover);
        const photoURL = await getDownloadURL(image);

        const uniqueId = generateUniqueId("readersClub-");

        await addDocument({
          clubsName: title,
          clubLogo: photoURL,
          messages: [],
          description,
          users: [
            {
              label: user.displayName,
              value: {
                nickname: user.displayName,
                id: user.uid,
                photoURL: user.photoURL,
              },
            },
            ...attachedUsers,
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
          await pushNotification({
            notificationContent: `You've been added by ${user.displayName} to ${title} club.`,
            directedTo: member.value.id,
            linkTo: `/readers-clubs`,
            isRead: false,
            notificationTime: Timestamp.fromDate(new Date()),
            changeConcering: user.photoURL,
          });
        });
      }

      setIsPending(false);
      setError(null);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSelect = (e) => {
    setCover(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected.size > 200000) {
      setError("Too big file's been uploaded.");
      return;
    }

    if (!selected.type.includes("image")) {
      setError("Inappropriate type of file.");
      return;
    }

    if (!selected) {
      setError("Select any image, you have.");
      return;
    }

    setCover(selected);
    setError(null);
  };

  return (
    <div className="side">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="search-container">
          <div>
            <h2>Which part would you like to broaden?</h2>

            <CreatableSelect
              isClearable
              isSearchable
              options={addOptions}
              onChange={(e) => setSelectedToAdd(e.value)}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            style={
              selectedToAdd === "Books"
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            <h2>
              Add new Book <FaBook />
            </h2>

            <label>
              <span>Author:</span>
              <input
                type="text"
                required
                onChange={(e) => setAuthor(e.target.value)}
              />
            </label>

            <label>
              <span>Title:</span>
              <input
                type="text"
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label>
              <span>Category:</span>
              <CreatableSelect
                required
                className="select-input"
                isClearable
                isSearchable
                options={bookCategories}
                onChange={(e) => {
                  const selectedOption =
                    e && e.value ? e : { value: "", label: "" };
                  setCategory(selectedOption.value);
                }}
              />
            </label>

            <label>
              <span>Pages:</span>
              <input
                type="number"
                min={1}
                required
                onChange={(e) => setPagesNumber(+e.target.value)}
              />
            </label>

            <label>
              <span>Read pages:</span>
              <input
                type="number"
                min={0}
                required
                onChange={(e) => setReadPages(+e.target.value)}
              />
            </label>

            <label>
              <span>Recension:</span>
              <textarea ref={recensionArea}></textarea>
            </label>

            <label>
              <span>Cover: </span>
              <input type="file" required onChange={handleSelect} />
            </label>

            {condition && (
              <div>
                <div className="condition-area">
                  <h2>Is this book recomendable?</h2>
                  <div className="pages-buttons">
                    <button
                      className={`btn yes ${isRecommendable ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsRecommendable(true);
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className={`btn no ${!isRecommendable ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsRecommendable(false);
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && <p className="wrong">{error}</p>}

            <button className="btn">Add new Book</button>
          </form>

          <form
            onSubmit={handleSubmit}
            style={
              selectedToAdd === "Competitions"
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            <h2>
              Add new Competition <FaTrophy />
            </h2>

            <label>
              <span>Title:</span>
              <input
                type="text"
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label>
              <span>Competition's type:</span>
              <CreatableSelect
                required
                className="select-input"
                isClearable
                isSearchable
                options={competitionTypes}
                onChange={(e) => setCompetitionsName(e.value)}
              />
            </label>

            <label>
              <span>Expiration date:</span>
              <input
                className="input-date"
                type="date"
                required
                onChange={(e) => {
                  setExpirationDate(new Date(e.target.value));
                }}
              />
            </label>

            <label>
              <span>Users:</span>
              <CreatableSelect
                required
                className="select-input"
                isClearable
                isSearchable
                isMulti
                options={notCurrentUsers}
                onChange={(e) => {
                  setAttachedUsers(e);
                }}
              />
            </label>

            <label>
              <span>Description:</span>
              <textarea
                required
                placeholder="What's this competition about, what's to win?"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </label>

            {error && <p className="wrong">{error}</p>}

            <button className="btn">Add new Competition</button>
          </form>

          <form
            onSubmit={handleSubmit}
            style={
              selectedToAdd === "Clubs"
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            <h2>
              Add new Reader's Club <FaUsers />
            </h2>

            <label>
              <span>Club's name:</span>
              <input
                type="text"
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label>
              <span>Users:</span>
              <CreatableSelect
                required
                className="select-input"
                isClearable
                isSearchable
                isMulti
                options={notCurrentUsers}
                onChange={(e) => {
                  setAttachedUsers(e);
                }}
              />
            </label>

            <label>
              <span>Club's logo: </span>
              <input type="file" required onChange={handleSelect} />
            </label>

            <label>
              <span>Description:</span>
              <textarea
                required
                placeholder="Tell the users, what are you in this club doing."
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </label>

            {error && <p className="wrong">{error}</p>}

            <button className="btn">Add new Club</button>
          </form>

          {isPending && <Loader />}
        </div>
      </motion.div>
    </div>
  );
}

export default Create;
