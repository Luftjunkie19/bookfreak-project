import ProfileDashboardBar from "components/Sidebars/left/profile/ProfileDashboardBar";


export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="w-full flex">
                <ProfileDashboardBar/>
            <div className="w-full p-2">
            {children}
            </div>
        </div>
    );
}