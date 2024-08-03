import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@nextui-org/react";
import { useLogout } from "hooks/useLogout";
import Link from "next/link";
import { PiSignOutBold } from "react-icons/pi";

type Props = {
  userObject: any,
  userId:string
}

const UserDropDown = ({userObject, userId}:Props) => {
 const { logout } = useLogout();

  const signout = async () => {
    await logout();
  }

    return (
         <Dropdown className="sm:hidden lg:block" placement="bottom-start">
        <DropdownTrigger className="sm:hidden lg:flex">
                <User
                    as='button'
            avatarProps={{
              src: userObject.photoURL,
            }}
            className="transition-transform"
                    description={<p className=" uppercase text-green-300">{userObject.creditsAvailable && userObject.creditsAvailable.valueInMoney} {userObject.creditsAvailable && userObject.creditsAvailable.currency}</p>}
                    name={<p className=" text-white line-clamp-1">{userObject.nickname}</p>}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem as={'a'} href={`/profile/${userId}`} key="profile">
            Profile
          </DropdownItem>
          <DropdownItem as={'a'} href={`/profile/settings`} key="settings">
            My Settings
          </DropdownItem>
          <DropdownItem as={'a'} href={`/profile/dashboard`} key="dashboard">
            Dashboard
          </DropdownItem>
          <DropdownItem as={'a'} href={`/profile/${userId}/about`} key="help_and_feedback">
            Help & Feedback
          </DropdownItem>
          <DropdownItem onClick={signout} key="logout" color="danger">
           
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
}



export default UserDropDown