import "../stylings/backgrounds.css";

import { useParams } from "react-router";

import MessageArea from "../../components/ChatComponents/MessageArea";
import MessagesBar from "../../components/ChatComponents/MessagesBar";

function MessagesHolder() {
  const { chatId } = useParams();

  return (
    <div className="min-h-screen h-full grid grid-cols-4">
      <div className="sm:hidden xl:block xl:p-2 border-r-2 border-accColor mr-2 pattern-bg">
        <MessagesBar />
      </div>
      <MessageArea chatId={chatId} messagedUser={""} />
    </div>
  );
}

export default MessagesHolder;
