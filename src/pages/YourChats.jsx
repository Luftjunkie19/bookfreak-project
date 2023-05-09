import React from "react";

import { motion } from "framer-motion";

import MessagesBar from "../components/MessagesBar";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";

function YourChats() {
  const { user } = useAuthContext();
  const { documents } = useCollection("chats", [
    "users.partner.id",
    "==",
    user.uid,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MessagesBar partneredDocs={documents} />
    </motion.div>
  );
}

export default YourChats;
