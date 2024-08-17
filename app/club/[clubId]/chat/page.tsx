'use client';
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
         <div className="flex flex-col w-full  sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)]">
            {user && document && 
                <>
            <ChatList isAllowedToSee={document.members.find((member)=>member.id === user.uid)} document={document} messages={document.chatMessages} documents={documents} user={user} />
                 <ChatBottomBar isAllowedToType={!document.members.find((member)=>member.id === user.uid) ? false : true}/> 
            </>
            }

        </div>
    );
}