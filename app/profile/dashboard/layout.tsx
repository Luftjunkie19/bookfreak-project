import ProfileDashboardLeftBar from "components/Sidebars/left/ProfileDashboardLeftBar";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="h-screen w-full flex">
            <ProfileDashboardLeftBar />
            <div className="w-full h-full p-2">
            {children}
            </div>
        </div>
    );
}