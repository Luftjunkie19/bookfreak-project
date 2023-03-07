import React from "react";

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
    <div>
      <MessagesBar partneredDocs={documents} />
    </div>
  );
}

export default YourChats;
