import "./Login.css";

import { useRef, useState } from "react";

import { motion } from "framer-motion";
import AvatarEditor from "react-avatar-editor";
import { FaFacebook, FaGithub, FaGoogle, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useLogin } from "../hooks/useLogin";

function SignUp() {
  const {
    signUpUser,
    signInWithGoogle,
    signInWithFacebook,
    signInWithGithub,
    error,
    isPending,
  } = useLogin();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userImg, setUserImg] = useState(null);
  const [userImgError, setUserImgError] = useState(null);
  const [userEditImg, setUserEditImg] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const editorRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(email, password, displayName, userImg);

    await signUpUser(email, password, displayName, userImg);
  };

  const handleSelect = (e) => {
    setUserImgError(null);
    setUserImg(null);
    setUserEditImg(null);

    let selected = e.target.files[0];

    if (!selected) {
      setUserImgError("Please select any image.");
      return;
    }

    if (!selected.type.includes("image")) {
      setUserImgError("Please choose appropriate file type.");
      return;
    }

    if (selected.size > 100000) {
      setUserImgError("Your image is to big, choose the smaller one.");
      return;
    }

    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setUserEditImg(fileReader.result);
      };
      return;
    }

    setUserImgError(null);
  };

  const handleSaveImg = () => {
    const editorImg = editorRef.current
      .getImageScaledToCanvas()
      .toDataURL("image/jpg");

    const byteCharacters = atob(editorImg.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    setUserImg(byteArray);
    setUserEditImg(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {userEditImg && (
        <div className="loader-container">
          <AvatarEditor
            image={userEditImg}
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

          <button className="btn" onClick={handleSaveImg}>
            Save Avatar
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h2>Sign up to join us!</h2>

        <label>
          <span>Nickname:</span>
          <input
            type="text"
            required
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>

        <label>
          <span>Email:</span>
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          <span>Password:</span>
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label>
          <span>Avatar: </span>
          <input type="file" required onChange={handleSelect} />
        </label>

        {userImgError && <p className="error">{userImgError}</p>}

        {isPending && <button className="btn">Loading...</button>}

        {!isPending && <button className="btn">Sign up</button>}

        <Link to="/sign-in-with-phone">
          Sign in with Phone <FaPhoneAlt />
        </Link>

        <div className="buttons">
          <h3>You can also: </h3>
          <button className="btn login google" onClick={signInWithGoogle}>
            <div className="provider-logo">
              <FaGoogle />
            </div>
            Sign up with Google
          </button>
          <button className="btn login fb" onClick={signInWithFacebook}>
            <div className="provider-logo">
              <FaFacebook />
            </div>
            Sign up with Facebook
          </button>
          <button className="btn login github" onClick={signInWithGithub}>
            <div className="provider-logo">
              <FaGithub />
            </div>
            Sign up with Github
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </motion.div>
  );
}

export default SignUp;
