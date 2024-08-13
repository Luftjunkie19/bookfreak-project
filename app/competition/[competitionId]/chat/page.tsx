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
        <div className="flex flex-col w-full h-screen">
            {user && document && 
                <>
                
            <ChatList document={document} messages={document.chatMessages} documents={documents} user={user} isAllowedToSee={document.members.find((member)=>member.id === user.uid)} />
                {document.members.find((member)=>member.id === user.uid)  && user ? <ChatBar isAllowedToType={true}/> : <ChatBar isAllowedToType={false}/> }
            </>
            }

        </div>
    );
}