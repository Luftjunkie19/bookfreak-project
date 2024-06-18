import React from 'react';

import { increment } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import { BsFillPersonFill } from 'react-icons/bs';
import { GiExitDoor } from 'react-icons/gi';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router';



import { functions } from '../../app/firebase';
import alertMessages from '../../assets/translations/AlertMessages.json';
import alertTranslations from '../../assets/translations/AlertMessages.json';
import { snackbarActions } from '../../context/SnackBarContext';
import { warningActions } from '../../context/WarningContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function Warning() {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const item = useSelector((state:any) => state.warning.referedTo);
  const { removeFromDataBase, updateDatabase } = useRealDatabase();
  const sendRefund= httpsCallable(functions, "sendRefund");
  const { getDocument } = useRealtimeDocument();
  const collectionName = useSelector((state:any) => state.warning.collection);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const communityName = useSelector((state:any) => state.warning.typeOf);
  const isVisible = useSelector((state:any) => state.warning.isWarningVisible);
const {document}=useGetDocument(collectionName, item);

  const deleteCommunity = async () => {

    if (
      !document.prizeHandedIn &&
      document.prize.moneyPrize &&
      !document.prize.itemPrize
    ) {
      const userDoc = await getDocument("users", document.createdBy.id);

      const response = await sendRefund({
        chargeId: document.chargeId,
      });


      const { error } =  (response.data as any);

      if (error) {
        return;
      }
      console.log(error, userDoc);

      updateDatabase(
        {
          ...userDoc,
          creditsAvailable: {
            ...userDoc.creditsAvailable,
            valueInMoney: increment(document.prize.moneyPrize.amount),
            balance: {
              ...userDoc.creditsAvailable.balance,
              0: {
                ...userDoc.creditsAvailable.balance["0"],
                amount: increment(document.prize.moneyPrize.amount),
              },
            },
          },
        },
        "users",
        userDoc.id
      );
      removeFromDataBase("competitions", document.id);
      removeFromDataBase("communityChats", document.id);
      removeFromDataBase("communityMembers", document.id);

      navigate("/");
    } else {
      removeFromDataBase("competitions", document.id);
      removeFromDataBase("communityChats", document.id);
      removeFromDataBase("communityMembers", document.id);

      navigate("/");
    }
    dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.remove[selectedLanguage]}`, alertType:"success"}))
    navigate("/");
  };

  const navigate = useNavigate();



  return (
    <>
      {document && (
        <div>
          {/**Manage leaving if you are owner */}
</div>
      )}

      
    </>
  );
}

export default Warning;
