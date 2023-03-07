import './Login.css';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Timestamp } from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import generateUniqueId from 'react-id-generator';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import Loader from '../components/Loader';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFirestore } from '../hooks/useFirestore';

function Create() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [pagesNumber, setPagesNumber] = useState(0);
  const [readPages, setReadPages] = useState(0);
  const [cover, setCover] = useState(null);
  const [error, setError] = useState("");
  const [isNotCompleted, setIsNotCompleted] = useState(true);
  const [recension, setRecension] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { addDocument } = useFirestore("books");
  const { user } = useAuthContext();

  const recensionArea = useRef();

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
    }

    console.log(recensionArea.current);
  }, [recensionArea, readPages, pagesNumber, isNotCompleted]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const uploadPath = `cover/uid${user.uid}/${cover.name}`;

      const storage = getStorage();

      const image = ref(storage, uploadPath);

      const snapshot = await uploadBytes(image, cover);
      const photoURL = await getDownloadURL(image);

      const uniqueId = generateUniqueId("book-");

      console.log(cover);

      if (readPages > pagesNumber) {
        setError(
          "The amount of read pages cannot be higher than the amount of overall pages of the book."
        );
        setIsPending(false);
        toast.dark("Tell me, how have you done it?");
        return;
      }

      await addDocument({
        author,
        title,
        pagesNumber,
        readPages,
        photoURL,
        createdBy: {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: Timestamp.fromDate(new Date()),
          id: user.uid,
        },
        recension: {
          content: recension,
          timeOfRecension: Timestamp.fromDate(new Date()),
        },
        id: uniqueId,
      });

      setIsPending(false);
      setError(null);
      toast.success("Book added successfully");
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
    <>
      <form onSubmit={handleSubmit}>
        <h2>Add new Book</h2>

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
          <textarea
            ref={recensionArea}
            onChange={(e) => setRecension(e.target.value)}
          ></textarea>
        </label>

        <label>
          <span>Cover: </span>
          <input type="file" required onChange={handleSelect} />
        </label>

        {error && <p className="wrong">{error}</p>}

        <button className="btn">Add new Book</button>
      </form>

      {isPending && <Loader />}
    </>
  );
}

export default Create;
