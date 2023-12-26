import React, { useState } from 'react';

import { increment } from 'firebase/database';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaX } from 'react-icons/fa6';
import { GiExitDoor } from 'react-icons/gi';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Snackbar,
} from '@mui/material';

import alertMessages from '../../assets/translations/AlertMessages.json';
import alertTranslations from '../../assets/translations/AlertMessages.json';
import { warningActions } from '../../context/WarningContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function Warning() {
  const [message, setMessage] = useState({ open: false, message: null });
  const { user } = useAuthContext();
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
    toast.success(
      alertMessages.notifications.successfull.remove[selectedLanguage]
    );
    navigate("/");
    setMessage({
      open: true,
      message:
        alertTranslations.notifications.successfull.remove[selectedLanguage],
    });
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();

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
                toast.success(
                  alertTranslations.notifications.successfull.leave[
                    selectedLanguage
                  ]
                );
              }}
            >
              Leave <GiExitDoor />
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {message.open && (
        <Snackbar
          onClose={() => {
            setMessage({ message: "", open: false });
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={message.open}
          autoHideDuration={3000}
          message={message.message}
          action={
            <button
              className="flex items-center gap-2"
              onClick={() => {
                setMessage({ message: "", open: false });
              }}
            >
              <FaX className=" text-red-500" /> Close
            </button>
          }
        />
      )}
    </>
  );
}

export default Warning;
