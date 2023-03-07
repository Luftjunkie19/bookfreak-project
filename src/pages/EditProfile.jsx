import './EditProfile.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  updateEmail,
  updateProfile,
} from 'firebase/auth';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Loader from '../components/Loader';
import { useAuthContext } from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import { useDocument } from '../hooks/useDocument';
import { useFirestore } from '../hooks/useFirestore';
import { useUpdateDocs } from '../hooks/useUpdateDocs';
import { useUpdateChats } from '../hooks/useUpdateUserChat';

function EditProfile() {
  const { user } = useAuthContext();
  const { document } = useDocument("users", user.uid);

  const { ownedArray, partneredArray, updateOwnedChats, updatePartneredChats } =
    useUpdateChats();
  console.log(ownedArray, partneredArray);

  const defaultImg = user.photoURL;

  const [nickname, setNickname] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [profileImg, setProfileImg] = useState(defaultImg);
  const [imgError, setImgError] = useState(null);
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { updateDocument } = useFirestore("users");
  const { documents } = useCollection("books", [
    "createdBy.id",
    "==",
    user.uid,
  ]);

  console.log(user);

  const { updateDocs } = useUpdateDocs();

  const storage = getStorage();

  const navigate = useNavigate();

  useEffect(() => {
    if (document) {
      setDescription(document.description);
    }
  }, [document]);

  const handleImg = (e) => {
    setImgError(null);
    setIsPending(false);

    let selected = e.target.files[0];

    console.log(selected);

    if (selected.size > 100000) {
      setImgError(`The ${selected.name} is to big file`);
      return;
    }

    if (!selected.type.includes("image")) {
      setImgError("Selected file is not an Img");
      return;
    }

    if (selected === null) {
      setProfileImg(document.photoURL);
      return;
    }

    console.log(selected.type);

    setImgError(null);
    setProfileImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(nickname, email, profileImg, description);

    setIsPending(true);
    try {
      if (profileImg.type) {
        console.log("Will be continued");
        console.log(nickname, email, profileImg);

        const uploadPath = `profileImg/uid${user.uid}/${profileImg.name}`;

        const image = ref(storage, uploadPath);

        console.log(storage);

        console.log(image);

        const snapshot = await uploadBytes(image, profileImg);
        const photoURL = await getDownloadURL(image);

        await updateProfile(user, {
          displayName: nickname,
          photoURL: photoURL,
        });
        await updateDocument(user.uid, {
          nickname: nickname,
          email: email,
          photoURL: photoURL,
          description: description,
        });
        await updateEmail(user, email);
        updateDocs(documents, "books", nickname, email, photoURL);

        if (ownedArray.length > 0) {
          updateOwnedChats(photoURL, nickname);
        }

        if (partneredArray.length > 0) {
          updatePartneredChats(photoURL, nickname);
        }

        setIsPending(false);
        navigate(`/profile/${user.uid}`);
        toast.info("Change comitted successfully");
      } else {
        console.log(`Profile Pic hasn't been changed`);
        console.log(nickname, email, profileImg, description);

        await updateProfile(user, {
          displayName: nickname,
          photoURL: profileImg,
        });

        await updateDocument(user.uid, {
          nickname: nickname,
          email: email,
          photoURL: profileImg,
          description: description,
        });
        await updateEmail(user, email);
        updateDocs(documents, "books", nickname, email, profileImg);
        if (ownedArray.length > 0) {
          updateOwnedChats(profileImg, nickname);
        }

        if (partneredArray.length > 0) {
          updatePartneredChats(profileImg, nickname);
        }

        setIsPending(false);
        navigate(`/profile/${user.uid}`);
        toast.info("Change comitted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>
          Edit Profile <FaUserAlt />
        </h2>
        <p>Some changes? No worries! You can still edit your data 😉</p>

        <label>
          <span>Nickname:</span>
          <input
            type="text"
            required
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>

        <label>
          <span>Email:</span>
          <input
            type="email"
            required
            value={email}
            disabled={true}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <small>
          While logging with any auth-provider you cannot change your email or
          we're too dumb for it 😅 yet. Expect an development of the site sir.
        </small>

        <div className="file-upload">
          <label>
            <span>Choose Avatar: </span>
            <input type="file" onChange={handleImg} />
          </label>
        </div>

        <label>
          <span>Description:</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
        {!isPending && <button className="btn">Edit profile</button>}

        {isPending && (
          <button disabled className="btn">
            Loading...
          </button>
        )}

        {imgError && <p className="error">{imgError}</p>}
      </form>
      {isPending && <Loader />}
    </>
  );
}

export default EditProfile;
