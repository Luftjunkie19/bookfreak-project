import {
  getAuth,
  signOut,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from './useAuthContext';

export function useLogout() {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const myAuth = getAuth();

      await signOut(myAuth);

      navigate("/");

      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err.message);
    }
  };

  return { logout };
}
