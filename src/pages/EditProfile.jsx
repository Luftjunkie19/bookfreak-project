import "./EditProfile.css";

import { useEffect, useRef, useState } from "react";

import { updateEmail, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";
import AvatarEditor from "react-avatar-editor";
import { FaUserAlt, FaWindowClose } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../components/Loader";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useFirestore } from "../hooks/useFirestore";
import { useFormData } from "../hooks/useFormData";
import { useUpdateCommunities } from "../hooks/useUpdateCommunities";
import { useUpdateDocs } from "../hooks/useUpdateDocs";
import { useUpdateChats } from "../hooks/useUpdateUserChat";

function EditProfile() {
  const { user } = useAuthContext();
  const { ownedArray, partneredArray, updateOwnedChats, updatePartneredChats } =
    useUpdateChats();

  const { document } = useFormData("users", user.uid);
  const defaultImg = user.photoURL;

  const [nickname, setNickname] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [profileImg, setProfileImg] = useState(defaultImg);
  const [imgError, setImgError] = useState(null);
  const [description, setDescription] = useState("");
  const [editProfileImg, setEditProfileImg] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { updateDocument } = useFirestore("users");
  const editorRef = useRef();
  const { documents } = useCollection("books", [
    "createdBy.id",
    "==",
    user.uid,
  ]);

  const { updateDocs } = useUpdateDocs();

  const storage = getStorage();

  const navigate = useNavigate();

  const { updateComunities } = useUpdateCommunities();

  useEffect(() => {
    if (document) {
      setDescription(document.description);
    }
  }, [document]);

  const handleImg = (e) => {
    setImgError(null);
    setEditProfileImg(null);
    setIsPending(false);

    let selected = e.target.files[0];

    if (selected.size > 100000) {
      setImgError(`The ${selected.name} is to big file`);
      setEditProfileImg(null);
      return;
    }

    if (!selected.type.includes("image")) {
      setImgError("Selected file is not an Img");
      setEditProfileImg(null);
      return;
    }

    if (selected === null) {
      setProfileImg(document.photoURL);
      setEditProfileImg(null);
      return;
    }

    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditProfileImg(fileReader.result);
      };
      return;
    }

    setImgError(null);
  };

  const handleSaveAvatar = async () => {
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
      storage,
      `profileImg/uid${user.uid}/${user.displayName}.jpg`
    );
    await uploadBytes(storageRef, byteArray);
    const url = await getDownloadURL(storageRef);
    console.log(url);

    setProfileImg(url);
    setEditProfileImg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsPending(true);
    try {
      console.log(nickname, email, profileImg);

      updateComunities(
        {
          label: nickname,
          value: {
            nickname: nickname,
            photoURL: profileImg,
            id: user.uid,
          },
        },
        nickname,
        profileImg
      );

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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {editProfileImg && (
        <div className="loader-container">
          <button
            className="btn delete"
            onClick={() => {
              setEditProfileImg(null);
              setProfileImg(document.photoURL);
            }}
          >
            <FaWindowClose /> Close
          </button>

          <AvatarEditor
            image={editProfileImg}
            ref={editorRef}
            width={300}
            height={300}
            borderRadius={500}
            color={[0, 0, 0, 0.5]}
            scale={zoomLevel}
          />

          <label>
            <span>Zoom:</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoomLevel}
              onChange={(e) => setZoomLevel(+e.target.value)}
            />
          </label>

          <button className="btn" onClick={handleSaveAvatar}>
            Save Avatar
          </button>
        </div>
      )}

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

        {!editProfileImg && (
          <div className="file-upload">
            <label>
              <span>Choose Avatar: </span>
              <input type="file" onChange={handleImg} />
            </label>
          </div>
        )}

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
    </motion.div>
  );
}

export default EditProfile;
