import React from "react";

import { FaPoop } from "react-icons/fa";

function NoInternet() {
  return (
    <div>
      <FaPoop />
      <h2>Sorry mate !</h2>
      <p>Something went wrong, check your Internet connection please.</p>
    </div>
  );
}

export default NoInternet;
