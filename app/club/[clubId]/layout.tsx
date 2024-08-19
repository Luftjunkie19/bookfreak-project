import ClubBar from "components/Sidebars/left/ClubBar";
import ClubSettingsLeftBar from "components/Sidebars/left/clubs/ClubSettingsLeftBar";
import ClubRightBar from "components/Sidebars/right/ClubRightBar";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex w-full ">
            <ClubBar />
            <ClubSettingsLeftBar/>
        
            {children}
            
            <ClubRightBar/>
        </div>
    );
}