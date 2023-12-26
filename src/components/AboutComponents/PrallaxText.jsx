import React from "react";

import { motion } from "framer-motion";

function ParallaxText({ children }) {
  return (
    <motion.div
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
      animate={{ x: "100%" }}
      initial={{ x: "-100%" }}
      transition={{ ease: "linear", duration: 5, repeat: Infinity }}
      className=" text-8xl text-white"
    >
      {children}
    </motion.div>
  );
}

export default ParallaxText;
