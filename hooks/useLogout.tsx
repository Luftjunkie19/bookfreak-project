import { useRouter } from 'next/navigation';

import { useAuthContext } from './useAuthContext';
import { createClient } from 'lib/supabase/client';

export function useLogout() {
  const supabase = createClient();
  const { dispatch } = useAuthContext();
  const navigate = useRouter();

  const logout = async () => {
    try {
  

      await supabase.auth.signOut();

      navigate.push("/");

      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err.message);
    }
  };

  return { logout };
}
