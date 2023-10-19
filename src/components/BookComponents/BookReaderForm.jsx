import "../Loader.css";

import React, { useState } from "react";

import { FaBookOpen } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { useSelector } from "react-redux";

import formsTranslations from "../../assets/translations/FormsTranslations.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";

function BookReaderForm({ closeForm, handleConfirm, pagesAmount, readerData }) {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [hasStarted, setHasStarted] = useState(
    readerData ? readerData.hasFinished : false
  );
  const [hasFinished, setHasFinished] = useState(
    readerData ? readerData.startedReading : false
  );
  const [readPages, setReadPages] = useState(
    readerData ? readerData.pagesRead : 0
  );

  const confirmForm = (e) => {
    e.preventDefault();
    handleConfirm(hasStarted, hasFinished, readPages);
  };

  return (
    <div className="loader-container">
      <button
        className="btn absolute right-0 top-0 m-2 bg-error text-white"
        onClick={closeForm}
      >
        {reuseableTranslations.closeBtn[selectedLanguage]} <GrClose />
      </button>

      <form
        onSubmit={confirmForm}
        className="flex flex-col items-center justify-center gap-5"
      >
        <FaBookOpen className="text-4xl" />
        <h2 className="text-3xl font-semibold text-white">Update your book</h2>
        <p>Wanna add some changes? Here you are !</p>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">
              {formsTranslations.hasStarted.query[selectedLanguage]}
            </span>
            <input
              value={hasStarted}
              checked={hasStarted}
              type="checkbox"
              className="checkbox checkbox-primary"
              onChange={(e) => {
                setHasStarted(e.target.checked);
              }}
            />
          </label>
        </div>

        {hasStarted && (
          <>
            <label className="flex flex-col w-full">
              <span>
                {formsTranslations.pagesAmountInput.label[selectedLanguage]}:{" "}
              </span>
              <input
                type="number"
                className="outline-none rounded-md p-2 w-full"
                value={readPages}
                min={1}
                max={pagesAmount}
                required
                onChange={(e) => setReadPages(+e.target.value)}
              />
            </label>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">
                  {formsTranslations.hasFinished.query[selectedLanguage]}
                </span>
                <input
                  type="checkbox"
                  checked={pagesAmount === readPages}
                  className="checkbox checkbox-primary"
                  onChange={(e) => {
                    setHasFinished(e.target.checked);
                    console.log(e.target.checked);
                    if (e.target.checked === true) {
                      setReadPages(pagesAmount);
                    } else {
                      setReadPages(0);
                    }
                  }}
                />
              </label>
            </div>
          </>
        )}

        <button className="btn bg-accColor text-white btn-wide my-2">
          {reuseableTranslations.updateStatus[selectedLanguage]}
        </button>
      </form>
    </div>
  );
}

export default BookReaderForm;
