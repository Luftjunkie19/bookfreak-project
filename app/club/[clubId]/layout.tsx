'use client';
import ClubDrawer from "components/drawer/club/ClubDrawer";
import Drawer from "components/drawer/Drawer";
import ClubBar from "components/Sidebars/left/ClubBar";
import ClubSettingsLeftBar from "components/Sidebars/left/clubs/ClubSettingsLeftBar";
import ClubRightBar from "components/Sidebars/right/ClubRightBar";
import { useState } from "react";
import { useSwipeable } from 'react-swipeable';

export default function Layout({children}: {children: React.ReactNode}) {
const [isSwiped, setIsSwiped]=useState(false);
    const handlers = useSwipeable({
        swipeDuration: 400,
onSwipedRight:(eventData)=> setIsSwiped(true),
onTap:(eventData)=> setIsSwiped(false),

      });


    return (
        <div {...handlers} className="flex w-full overflow-x-hidden relative top-0 left-0">
            <ClubBar />
            <ClubSettingsLeftBar/>
        <ClubDrawer isSwiped={isSwiped}/>
            {children}
            
            <ClubRightBar/>
        </div>
    );
}