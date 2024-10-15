import React, { useState } from 'react'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Select, SelectProps, Selection} from "@nextui-org/react";
import { IoIosArrowDown } from 'react-icons/io';

type Props = {
    children: any,
    label?:string,
    name?:string,
} 

function MultipleDropDown({children, label, name, ...props}: Props) {
     const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

    


  return (
    <Select
      {...props}
      label={<p className='text-white'>{label}</p>}
      placeholder={`Select ${label}`}
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onChange={(e) => {
   new Set(e.target.value.split(","))
      }}
      className="max-w-xs w-full"
      name={name}
      labelPlacement='outside'
      classNames={{
        'base': '',
        'innerWrapper': '',
        'trigger': 'bg-dark-gray text-white border-2 rounded-lg border-primary-color hover:bg-dark-gray focus:bg-dark-gray py-2', 
        'label': 'text-white text-sm',
        'value': 'text-sm text-white',
        'mainWrapper': 'outline-none text-white',
                'listbox': 'outline-none',
        'popoverContent': 'bg-dark-gray text-white border-2 rounded-lg border-primary-color',
      }}
    >
      
   {children}
    </Select>
  )
}

export default MultipleDropDown