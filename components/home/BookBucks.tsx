import React from 'react';

import { httpsCallable } from 'firebase/functions';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router';

import { functions } from '../../app/firebase';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';
import toast from 'react-hot-toast';

function BookBucksComponent() {
  const dispatch= useDispatch();
  const { user } = useAuthContext();
  const createStripeCheckout=httpsCallable(functions,"createStripeCheckout");
  const { getDocument } = useRealtimeDocument();
  const selectedLangugage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const navigate = useNavigate();
  const purchaseItem = async (offer) => {
    if (user) {
      try {
        const document = await getDocument("users", user.uid);
  
  
        const response = await createStripeCheckout({
          quantity: 1,
          price: offer.id,
          destinationId: document.stripeAccountData.id,
          customer: {
            id: user.uid,
            nickname: user.displayName,
            selectedOptionName: offer.name,
            priceForOffer: offer.id,
            priceInNumber: offer.price,
            boughtOption: offer.bucksToToUp,
            destinationId: document.stripeAccountData.id,
          },
          customerCurrency: document.stripeAccountData.default_currency,
        });
  
  
  
        const data = response.data;
  
        if ((data as any).error) {
          dispatch(snackbarActions.showMessage({message:(data as any).error.raw.message, alertType:"error"}))
         
        }
  
        console.log(data);
        navigate(`/paymentForm/${(data as any).clientSecret}/${(data as any).sessioned.id}`);
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error('You are not allowed to replenish your account in case you are not logged in.')
    }
  };

  return (
    <>
        {/* {allOffers.map((offer, i) => (
          <div className="sm:w-full md:w-[45%] lg:w-[30%] xl:max-w-sm flex-col flex gap-4 bg-accColor text-white p-2 rounded-md shadow-md">
            <div className="w-full flex sm:flex-col xl:flex-row gap-2">
              <img
                src={offerImages[i].src}
                className="sm:w-16 sm:h-16 lg:w-24 lg:h-24 rounded"
                alt=""
              />
              <div className="flex flex-col">
                <h2 className="font-semibold text-lg">{offer.name}</h2>
                <p className="text-sm">
                  Price:{" "}
                  {new Intl.NumberFormat(selectedLangugage, {
                    style: "currency",
                    currency: "USD",
                  }).format(offer.price)}
                </p>
              </div>
            </div>
            <button
              className="btn btn-success text-white text-sm self-end"
              onClick={(e) => {
                e.preventDefault();
                purchaseItem(offer);
              }}
            >
              Buy now!
            </button>
          </div>
        ))} */}
    </>
  );
}

export default BookBucksComponent;
