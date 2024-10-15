'use client';
import { useQuery } from "@tanstack/react-query";
import ChatList from "components/chatList/chat-lists/ChatList";
import ChatBottomBar from "components/chatList/ChatBottomBar";
import ClubTopBar from "components/TopBar/ClubTopBar";
import { useAuthContext } from "hooks/useAuthContext";

export default function Page({ params }: { params: { clubId: string } }) {
    const { user } = useAuthContext();
    const { clubId } = params;
   const { data:document } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ where:{id:user?.id} }),
    }).then((res)=>res.json())
  })

    return (
         <div className="flex flex-col w-full  sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)]">
            {user && document && 
                <>
                <ClubTopBar/>
            <ChatList isAllowedToSee={document && user &&  document.members.find((member)=>member.id === user.id)} document={document} messages={document.chatMessages} documents={documents} user={user} />
                 <ChatBottomBar isAllowedToType={document && user && document.members.find((member)=>member.id === user.id) ? false : true}/> 
            </>
            }

        </div>
    );
}