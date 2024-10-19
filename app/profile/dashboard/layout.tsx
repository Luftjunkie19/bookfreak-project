import ProfileDashboardBar from "components/Sidebars/left/profile/ProfileDashboardBar";


export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="w-full flex">
                <ProfileDashboardBar/>
            <div className="w-full overflow-y-auto sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.75rem)] h-full p-2">
            {children}
            </div>
        </div>
    );
}