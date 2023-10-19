import "./Loader.css";

import { motion } from "framer-motion";

import { Box, CircularProgress } from "@mui/material";

function Loader() {
  return (
    <motion.div
      className="loader-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box>
        <CircularProgress className="w-64 h-48" />
      </Box>
    </motion.div>
  );
}

export default Loader;
