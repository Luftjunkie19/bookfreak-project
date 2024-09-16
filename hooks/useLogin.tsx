import { useState } from 'react';


import { useRouter } from 'next/navigation';

import { useAuthContext } from './useAuthContext';
import { createClient } from 'lib/supabase/client';

export function useLogin() {
  const supabase = createClient();
  const [error, setError] = useState<string | null>("");
  const [isPending, setIsPending] = useState(false);
  const context = useAuthContext();

  const { dispatch } = context;

  const navigate = useRouter();

  const signInWithGoogle = async () => {
    setError(null);
    setIsPending(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        'provider': 'google',
      });

    
   

//       if (!documentExistence) {
//         const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;

//         const storage = getStorage();

//         const image = ref(storage, uploadPath);

//         const snapshot = await uploadBytes(image, res.user.photoURL as unknown as Blob);
//         await getDownloadURL(image);

//         const accountData={
//           accountData: {
//             id: res.user.uid,
//             nickname: res.user.displayName,
//             email: res.user.email,
//            }};

//            console.log(accountData);

// const fetchedObject= await createStripeAccount(accountData);

//         const stripeAccountData =  fetchedObject.data;
   
//         const accountLinkResponse=await createStripeAccountLink({accountId: (stripeAccountData as any).id});
//         console.log(accountLinkResponse);
  
//      const accountLinkObject = accountLinkResponse.data;
  
//         console.log(accountLinkObject);

        
//         console.log(stripeAccountData);

//         addToDataBase("users", res.user.uid, {
//           nickname: res.user.displayName,
//           email: res.user.email,
//           photoURL: res.user.photoURL,
//           description: "",
//           id: res.user.uid,
//           creditsAvailable:{ valueInMoney:0, currency:(stripeAccountData as any).default_currency },
//           stripeAccountData,
//           accountLinkObject:{...(accountLinkObject as any).accountLinkObject}
//         });
//       }

      // dispatch({ type: "LOGIN", payload: res.user });

      navigate.push("/");

      setError(null);
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
console.log(error);
      setError(error.message);
    }
  };

  const signInWithFacebook = async () => {
    setError(null);
    setIsPending(true);

    try {
       const { data, error } = await supabase.auth.signInWithOAuth({
         'provider': 'facebook',
      });

            console.log(data);
      // const documentExistence = await getDocument("users", res.user.uid);

      // console.log(documentExistence);

      //  if (!documentExistence) {
      //   const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;

      //   const storage = getStorage();

      //   const image = ref(storage, uploadPath);

      //   const snapshot = await uploadBytes(image, res.user.photoURL as unknown as Blob);
      //   await getDownloadURL(image);

      //   const fetchedObject= await createStripeAccount({
      //     accountData: {
      //       id: res.user.uid,
      //       nickname: res.user.displayName,
      //       email: res.user.email,
      //      }});
      //      console.log(fetchedObject);
        
      //           const stripeAccountData =  fetchedObject.data;
           
      //           const accountLinkResponse=await createStripeAccountLink({accountId: (stripeAccountData as any).id});
        
          
      //        const accountLinkObject = accountLinkResponse.data;
  
      //   console.log(accountLinkObject);

        
      //   console.log(stripeAccountData);

      //   addToDataBase("users", res.user.uid, {
      //     nickname: res.user.displayName,
      //     email: res.user.email,
      //     photoURL: res.user.photoURL,
      //     description: "",
      //     id: res.user.uid,
      //     stripeAccountData,
      //     accountLinkObject:{...(accountLinkObject as any).accountLinkObject},
      //      creditsAvailable:{ valueInMoney:0, currency:(stripeAccountData as any).default_currency },
      //   });
      // }

      // dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate.push("/");
    } catch (error) {
      setIsPending(false);

      setError(error.message);
    }
  };

  const signInWithGithub = async () => {
    setError(null);
    setIsPending(true);

    try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      'provider': 'github',
      });

            console.log(data);
    //   const documentExistence = await getDocument("users", res.user.uid);

    //   console.log(documentExistence);

    //  if (!documentExistence) {
    //     const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;

    //     const storage = getStorage();

    //     const image = ref(storage, uploadPath);

    //     const snapshot = await uploadBytes(image, res.user.photoURL as unknown as Blob);
    //     await getDownloadURL(image);

    //     const fetchedObject= await createStripeAccount({
    //       accountData: {
    //         id: res.user.uid,
    //         nickname: res.user.displayName,
    //         email: res.user.email,
    //        }});
        
    //       const stripeAccountData =  fetchedObject.data;
           
    //       const accountLinkResponse=await createStripeAccountLink({accountId: (stripeAccountData as any).id});
        
          
    //     const {accountLinkObject} = (accountLinkResponse as any).data;
  
    //     console.log(accountLinkObject,accountLinkResponse);

        
    //     console.log(stripeAccountData, fetchedObject);

    //     addToDataBase("users", res.user.uid, {
    //       nickname: res.user.displayName,
    //       email: res.user.email,
    //       photoURL: res.user.photoURL,
    //       description: "",
    //        creditsAvailable:{ valueInMoney:0, currency:(stripeAccountData as any).default_currency },
    //       id: res.user.uid,
    //       stripeAccountData,
    //        accountLinkObject:{...accountLinkObject.accountLinkObject},
    //     });
    //   }

    //   dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      navigate.push("/");
    } catch (error) {
      setIsPending(false);

      setError(error.message);
    }
  };


    const signInWithPassword = async (password: string, email: string) => {
           try {
               const { data, error } = await supabase.auth.signInWithPassword({
                   'email': email,
                   'password': password
               });

               if (data) console.log(data);

               if (error) {
                   throw new Error(error.message);
               }
        
    } catch (error) {
               console.log(error);
    }
    }

    const signUp = async (password: string, email: string) => {
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                'password': password,
            });

            if (data) console.log(data);

            if (error) {
                throw new Error(error.message)
            }
            
        } catch (error) {
            
        }
    }

  return {
    signInWithGoogle,
    signInWithFacebook,
    signInWithGithub,
    signInWithPassword,
    signUp,
    error,
    isPending,
  };
}
