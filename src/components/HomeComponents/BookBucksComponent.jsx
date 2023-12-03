import React from 'react';

import { FaBook } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { allOffers } from '../../assets/CreateVariables';
import { useAuthContext } from '../../hooks/useAuthContext';

function BookBucksComponent() {
  const { user } = useAuthContext();
  const selectedLangugage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const purchaseItem = async (offer) => {
    const response = await fetch(
      "http://127.0.0.1:5001/bookfreak-8d935/us-central1/stripeFunctions/createStripeCheckout",
      {
        method: "POST",
        headers: {
      "Content-Type": "application/json",
        'Connection': 'keep-alive',
            'Accept': '*',
        }
        ,
        body: JSON.stringify({
          quantity: 1, price: offer.id, customer: {
            id: user.uid,
            nickname: user.displayName,
            selectedOptionName: offer.name,
            priceForOffer: offer.id,
            priceInNumber: offer.price,
            boughtOption: offer.bucksToToUp,
         }}),
      }
    );

    const data = await response.json();

    navigate(`paymentForm/${data.clientSecret}/${data.sessioned.id}`)
     console.log(data);
  };
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center gap-4 m-2">
      {allOffers.map((offer) => (
        <div
          className=" min-w-[20rem] bg-accColor text-white p-2"
          key={offer.id}
        >
          <FaBook className=" text-2xl self-center" />
          <h2 className="book-bucks">{offer.name}</h2>
          <p>
            Price:{" "}
            {new Intl.NumberFormat(selectedLangugage, {
              style: "currency",
              currency: "EUR",
            }).format(offer.price)}
          </p>
          <button
            className="btn"
            onClick={()=>purchaseItem(offer)}
          >
            Buy now !
          </button>
        </div>
      ))}
    </div>
  );
}

export default BookBucksComponent;
