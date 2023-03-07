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

function Login() {
  const {
    signInNormally,
    signInWithGithub,
    signInWithGoogle,
    signInWithFacebook,
    error,
    isPending,
  } = useLogin();

  console.log(isPending);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    signInNormally(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login to join us!</h2>

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

      <button className="btn">Login</button>
      <Link to="/forgot-password">Forgot password?</Link>
      <Link to="/login-with-phone">
        Log in with Phone <FaPhoneAlt />
      </Link>

      <div className="buttons">
        <h3>You can also: </h3>
        <button className="btn login google" onClick={signInWithGoogle}>
          <div className="provider-logo">
            <FaGoogle />
          </div>
          Log in with Google
        </button>
        <button className="btn login fb" onClick={signInWithFacebook}>
          <div className="provider-logo">
            <FaFacebook />
          </div>
          Log in with Facebook
        </button>
        <button className="btn login github" onClick={signInWithGithub}>
          <div className="provider-logo">
            <FaGithub />
          </div>
          Log in with Github
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    </form>
  );
}

export default Login;
