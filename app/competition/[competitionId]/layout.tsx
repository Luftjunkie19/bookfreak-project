import CompetitionLeftBar from "components/Sidebars/left/CompetitionLeftBar";
import CompetitionBar from "components/Sidebars/right/CompetitionBar";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex h-screen">
            <CompetitionLeftBar/>
            {children}
            <CompetitionBar/>
        </div>
    );
}