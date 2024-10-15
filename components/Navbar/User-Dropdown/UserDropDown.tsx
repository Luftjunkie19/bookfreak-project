'use client';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useLogout } from "hooks/useLogout";
import Link from "next/link";
import { PiSignOutBold } from "react-icons/pi";

type Props = {
  userId?:string
}

const UserDropDown = ({ userId }: Props) => {
  
    const { data:document } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id:userId, include:undefined}),
    }).then((res)=>res.json())
  })


 const { logout } = useLogout();

  const signout = async () => {
    await logout();
  }

    return (
      <>
        {userId && document && document.data &&
       <Dropdown className="sm:hidden lg:block" placement="bottom-start">
        <DropdownTrigger className="sm:hidden lg:flex">
                <User
                    as='button'
            avatarProps={{
              src: document.data.photoURL,
            }}
            className="transition-transform"
                    description={<p className=" uppercase text-green-300">{document.data.creditsAvailable && document.data.creditsAvailable.valueInMoney} {document.data.creditsAvailable && document.data.creditsAvailable.currency}</p>}
                    name={<p className=" text-white line-clamp-1">{document.data.nickname}</p>}
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
        }
      </>
    );
}



export default UserDropDown