import { useRouter } from 'next/navigation';

import { useAuthContext } from './useAuthContext';
import { createClient } from 'lib/supabase/client';

export function useLogout() {
  const supabase = createClient();
  const { dispatch } = useAuthContext();
  const navigate = useRouter();

  const logout = async () => {
    try {
  

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message, {
          'cause':error.cause
        })
      }

      navigate.push("/");

      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err.message);
    }
  };

  return { logout };
}
