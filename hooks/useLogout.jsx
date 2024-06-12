import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { auth } from '../';
import { useAuthContext } from './useAuthContext';

export function useLogout() {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    try {
  

      await signOut(auth);

      navigate("/");

      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err.message);
    }
  };

  return { logout };
}
