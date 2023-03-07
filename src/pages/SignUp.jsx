import './Login.css';

import { useState } from 'react';

import {
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaPhoneAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useLogin } from '../hooks/useLogin';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(email, password, displayName, userImg);

    await signUpUser(email, password, displayName, userImg);
  };

  const handleSelect = (e) => {
    setUserImgError(null);
    setUserImg(null);

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

    setUserImg(selected);
    setUserImgError(null);
  };

  return (
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

      <button className="btn">Sign up</button>

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
  );
}

export default SignUp;
