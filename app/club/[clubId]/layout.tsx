import ClubBar from "components/Sidebars/left/ClubBar";
import ClubRightBar from "components/Sidebars/right/ClubRightBar";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex h-screen">
            <ClubBar />
        
            {children}
            
            <ClubRightBar/>
        </div>
    );
}