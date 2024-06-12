import "./Loader.css";

import { motion } from "framer-motion";
import Lottie from "lottie-react";

import loadingAnimation from "../assets/lottieAnimations/Animation - 1702816275398.json";

function FailLoader() {
  return (
    <motion.div
      className="loader-container"
      initial={{ opacity: 0 }}
      transition={{ bounce: 0.5, duration: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Lottie animationData={loadingAnimation} />
    </motion.div>
  );
}

export default FailLoader;
