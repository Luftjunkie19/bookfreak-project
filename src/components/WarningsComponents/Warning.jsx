import React from 'react';

import { increment } from 'firebase/database';
import { BsFillPersonFill } from 'react-icons/bs';
import { GiExitDoor } from 'react-icons/gi';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@mui/material';

import alertMessages from '../../assets/translations/AlertMessages.json';
import alertTranslations from '../../assets/translations/AlertMessages.json';
import { snackbarActions } from '../../context/SnackBarContext';
import { warningActions } from '../../context/WarningContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function Warning() {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const item = useSelector((state) => state.warning.referedTo);
  const { removeFromDataBase, updateDatabase } = useRealDatabase();
  const { getDocument } = useRealtimeDocument();
  const collectionName = useSelector((state) => state.warning.collection);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const communityName = useSelector((state) => state.warning.typeOf);
  const isVisible = useSelector((state) => state.warning.isWarningVisible);

  const deleteCommunity = async () => {
    console.log(item, collectionName);
    const document = await getDocument(collectionName, item);
    if (
      !document.prizeHandedIn &&
      document.prize.moneyPrize &&
      !document.prize.itemPrize
    ) {
      const userDoc = await getDocument("users", document.createdBy.id);

      const response = await fetch(
        "http://127.0.0.1:5001/bookfreak-954da/us-central1/stripeFunctions/sendRefund",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Connection: "keep-alive",
            Accept: "*",
          },
          body: JSON.stringify({
            chargeId: document.chargeId,
          }),
        }
      );

      const { error } = await response.json();

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
        <Dialog
          open={isVisible}
          TransitionComponent={React.forwardRef(
            function Transition(props, ref) {
              return <Slide direction="up" ref={ref} {...props} />;
            }
          )}
          keepMounted
          onClose={() => {
            dispatch(warningActions.closeWarning());
          }}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            {alertTranslations.leavingWarning.query[selectedLanguage]}{" "}
            {communityName}{" "}
            {selectedLanguage === "ger" &&
              alertTranslations.leavingWarning.query.part2[selectedLanguage]}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {alertTranslations.leavingWarning.consequences[selectedLanguage]}{" "}
              {communityName},{" "}
              {
                alertTranslations.leavingWarning.consequences.part2[
                  selectedLanguage
                ]
              }{" "}
              {selectedLanguage === "ger" && `${communityName}`}{" "}
              {selectedLanguage === "ger" &&
                `${alertTranslations.leavingWarning.consequences.part3[selectedLanguage]}.`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              className="btn w-32 bg-accColor text-white"
              onClick={() => {
                dispatch(warningActions.closeWarning());
              }}
            >
              Stay <BsFillPersonFill />
            </Button>
            <Button
              className="btn w-32 bg-red-500 text-white"
              onClick={() => {
                dispatch(warningActions.closeWarning());
                deleteCommunity();
                navigate("/");
                dispatch(snackbarActions.showMessage({message:`${alertTranslations.notifications.successfull.leave[
                  selectedLanguage
                ]}`, alertType:"success"}));
             
              }}
            >
              Leave <GiExitDoor />
            </Button>
          </DialogActions>
        </Dialog>
      )}

      
    </>
  );
}

export default Warning;
