import React from 'react'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { IoIosArrowDown } from 'react-icons/io';

type Props = {
    children: any,
    selectedArray: string[],
    label?:string
}

function MultipleDropDown({children, selectedArray, label }: Props) {
     const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

    


    return (
      <div className="flex gap-1 flex-col">
        {label && <p className="text-white">{label}</p>}     
   <Dropdown>
      <DropdownTrigger>
         <div  className="max-w-xs h-fit text-white w-full flex justify-between items-center p-2 bg-dark-gray border-2 rounded-lg border-primary-color">
                  <p>Select {label}</p>
                     <IoIosArrowDown />
                  </div>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Multiple selection example"
        variant="flat"
        closeOnSelect={false}
        disallowEmptySelection
        selectionMode="multiple"
      >
       {children}
      </DropdownMenu>
            </Dropdown>
            </div>
  )
}

export default MultipleDropDown