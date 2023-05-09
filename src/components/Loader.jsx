import "./Loader.css";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import pageLoader from "../assets/giphy-book.gif";

function Loader() {
  const loadingText = "Loading...";
  const [animatedText, setAnimatedText] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    let currentIndex = loadingText.length;

    setInterval(() => {
      setAnimatedText(loadingText.substring(0, currentIndex));
      currentIndex--;

      if (currentIndex <= 0) {
        currentIndex = loadingText.length;
        setAnimatedText("");
      }
    }, 1000);
  }, [loadingText]);

  return (
    <motion.div
      className="loader-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img src={pageLoader} alt="" />
      <h2>{animatedText}</h2>
    </motion.div>
  );
}

export default Loader;
