'use client';
import { useQuery } from "@tanstack/react-query";
import CompetitionTopBar from "components/TopBar/CompetitionTopBar";
import ChatBar from "components/chatList/ChatBottomBar";
import ChatList from "components/chatList/chat-lists/ChatList";
import { useAuthContext } from "hooks/useAuthContext";
import { Suspense } from "react";

export default function Page({params}:{params:{competitionId:string}}) {
    const {competitionId}=params;
    const {user}=useAuthContext();
    const { data: document } = useQuery({
        queryKey:['competition'],
        queryFn: () => fetch('/api/supabase/competition/get', {
          method: 'POST',
          headers:{
            'Content-Type':'application/json',
          }, 
          body:JSON.stringify({id:competitionId, include:{
                    members: {
                        include: {
                          user:true,
                      },
            },
          'chat':{'include':{'messages':true}},
            rules:true,
              }})
        }).then((res)=>res.json())
      });

      
 
    return (
        <div className="flex flex-col w-full sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)]">
            {user && document &&
              <>     
              
              <CompetitionTopBar/>
              <Suspense fallback={<div className=" w-full sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] flex h-full justify-center items-center">
                 <p className="text-white">
                    Loading...
                 </p>
                    </div>}>
                    
          <ChatList document={document.data} messages={document.data.Chat.messages} documents={document.data.Chat} user={user} isAllowedToSee={document && document.data && document.data.members.find((member)=>member.user.id === user.id) ? true : null} />
                    </Suspense>

              
              <ChatBar isAllowedToType={document && user && document.data.members && document.data.members.find((member)=>member.user.id === user.id) ? false : true}/> 
      
              </>

            }

        </div>
    );
}