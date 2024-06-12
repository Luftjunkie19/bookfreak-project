import '../Loader.css';

import React, { useState } from 'react';

import { useSelector } from 'react-redux';

function BookReaderForm({ closeForm, handleConfirm, pagesAmount, readerData }) {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [hasStarted, setHasStarted] = useState(
    readerData ? readerData.startedReading : false
  );
  const [hasFinished, setHasFinished] = useState(
    readerData ? readerData.hasFinished : false
  );
  const [readPages, setReadPages] = useState(
    readerData ? readerData.pagesRead : 0
  );

  const confirmForm = (e) => {
    e.preventDefault();
    handleConfirm(hasStarted, hasFinished, readPages);
    closeForm();
  };

  return (
    <div className="loader-container">
   
    </div>
  );
}

export default BookReaderForm;
