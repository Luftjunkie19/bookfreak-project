import React from 'react'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Select} from "@nextui-org/react";
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
    <Select
      label={<p className='text-white'>{label}</p>}
      placeholder={`Select ${label}`}
      selectionMode="multiple"
      className="max-w-xs w-full"
      labelPlacement='outside'
      classNames={{
        'trigger': 'bg-dark-gray text-white border-2 rounded-lg border-primary-color hover:bg-dark-gray focus:bg-dark-gray py-2', 
        'label': 'text-white text-sm',
        'value': 'text-sm text-white',
        'mainWrapper': 'outline-none',
                'listbox': 'outline-none',
        'popoverContent': 'bg-dark-gray text-white border-2 rounded-lg border-primary-color',
      }}
    >
   {children}
    </Select>
  )
}

export default MultipleDropDown