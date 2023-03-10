import { useState } from 'react';

import {
  getAuth,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const myAuth = getAuth();

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    await sendPasswordResetEmail(myAuth, email);

    toast.success("Email successfully sent");
    navigate("/");
  };

  return (
    <form onSubmit={submitForm}>
      <h2>Forgot a password?</h2>
      <p>No worries all sometimes forget 'bout something 😅</p>

      <label>
        <span>Email:</span>
        <input
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>

      <button className="btn">Send email</button>
    </form>
  );
}

export default ForgotPassword;
