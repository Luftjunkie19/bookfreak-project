import { auth } from 'app/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { useAuthContext } from './useAuthContext';

export function useLogout() {
  const { dispatch } = useAuthContext();
  const navigate = useRouter();

  const logout = async () => {
    try {
  

      await signOut(auth);

      navigate.push("/");

      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err.message);
    }
  };

  return { logout };
}
