import ChatList from "components/chatList/chat-lists/ChatList";
import ChatBottomBar from "components/chatList/ChatBottomBar";
import useGetCollection from "hooks/firestore/useGetCollection";
import { useRealDocument } from "hooks/firestore/useGetRealDocument";
import { useAuthContext } from "hooks/useAuthContext";

export default function Page({ params }: { params: { clubId: string } }) {
    const { user } = useAuthContext();
    const { clubId } = params;
    const { document } = useRealDocument('clubs', clubId);
    const { documents } = useGetCollection('users');

    return (
         <div className="flex flex-col w-full h-screen">
            {user && document && 
                <>
                
            <ChatList document={document} messages={document.chatMessages} documents={documents} user={user} isAllowedToSee={document.members.find((member)=>member.id === user.uid)} />
                {document.members.find((member)=>member.id === user.uid)  && user ? <ChatBottomBar isAllowedToType={true}/> : <ChatBottomBar isAllowedToType={false}/> }
            </>
            }

        </div>
    );
}