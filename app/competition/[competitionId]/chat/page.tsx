'use client';
import ChatBar from "components/chatList/ChatBottomBar";
import ChatList from "components/chatList/chat-lists/ChatList";
import useGetCollection from "hooks/firestore/useGetCollection";
import { useRealDocument } from "hooks/firestore/useGetRealDocument";
import { useAuthContext } from "hooks/useAuthContext";

export default function Page({params}:{params:{competitionId:string}}) {
    const {competitionId}=params;
    const {document}=useRealDocument('competitions', competitionId);
    const {documents}=useGetCollection('users');
    const {user}=useAuthContext();
    return (
        <div className="flex flex-col w-full sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)]">
            {user && document && 
                <>
            <ChatList document={document} messages={document.chatMessages} documents={documents} user={user} isAllowedToSee={document && document.members.find((member)=>member.id === user.uid)} />
                <ChatBar isAllowedToType={Boolean(document && user && document.members && document.members.find((member)=>member.id === user.uid))}/> 
            </>
            }

        </div>
    );
}