import "./Loader.css";

import { useEffect, useState } from "react";

import pageLoader from "../assets/giphy-book.gif";

function Loader() {
  const loadingText = "Loading...";
  let letterArray = [];
  let currentIndex = 0;
  const [animatedText, setAnimatedText] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function showText() {
    const characters = loadingText.split("");

    setInterval(() => {
      letterArray.push(characters[currentIndex]);
      currentIndex++;

      if (currentIndex >= characters.length) {
        currentIndex = 0;
        letterArray = [];
      }

      const animatedText = letterArray.join("");
      setAnimatedText(animatedText);
    }, 2000);
  }

  useEffect(() => {
    showText();
  }, [showText]);

  return (
    <div className="loader-container">
      <img src={pageLoader} alt="" />
      <h2>{animatedText}</h2>
    </div>
  );
}

export default Loader;
