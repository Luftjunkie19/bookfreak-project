import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@nextui-org/react";
import Link from "next/link";

type Props = {
  userObject: any,
  userId:string
}

const UserDropDown = ({userObject, userId}:Props) => {
    return (
         <Dropdown placement="bottom-start">
        <DropdownTrigger>
                <User
                    as='button'
            avatarProps={{
              src: userObject.photoURL,
            }}
            className="transition-transform"
                    description={<p className=" uppercase text-green-300">{userObject.creditsAvailable.valueInMoney} {userObject.creditsAvailable.currency}</p>}
                    name={<p className=" text-white line-clamp-1">{userObject.nickname}</p>}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile">
            <Link href={`/profile/${userId}`}>
            Profile
            </Link>
          </DropdownItem>
          <DropdownItem key="settings">
            My Settings
          </DropdownItem>
          <DropdownItem key="dashboard">
            Dashboard
          </DropdownItem>
          <DropdownItem key="help_and_feedback">
            Help & Feedback
          </DropdownItem>
          <DropdownItem key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
}



export default UserDropDown