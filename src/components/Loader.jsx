import './Loader.css';

import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

import loadingAnimation
  from '../assets/lottieAnimations/Animation - 1699205493311.json';

function Loader() {
  return (
    <motion.div
      className="loader-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ bounce: 0.5, duration: 0.5 }}
      exit={{ opacity: 0 }}
    >
      <Lottie animationData={loadingAnimation} />
    </motion.div>
  );
}

export default Loader;
