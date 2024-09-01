import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select } from '@nextui-org/react';
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

type Props = {
    children: any,
    selectedArray: string[],
    label?:string,
    name?:string,
}

function SingleDropDown({ children, selectedArray, label, name, ...props }: Props) {
  const { register } = useForm();
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(selectedArray));
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

    const clickDropdown = () => {
        setIsDropDownOpen(!isDropDownOpen);
    }
    
  return (<Select
    {...props}
    name={name}
      label={<p className='text-white'>{label}</p>}
      placeholder={`Select ${label}`}
      className="max-w-xs w-full"
      labelPlacement='outside'
      classNames={{
        'trigger': 'bg-dark-gray text-white border-2 rounded-lg border-primary-color hover:bg-dark-gray focus:bg-dark-gray py-2', 
        'label': 'text-white text-sm',
        'value': 'text-sm text-white',
        'listbox': 'outline-none',
        'popoverContent': 'bg-dark-gray text-white border-2 rounded-lg border-primary-color',
        'listboxWrapper':'bg-dark-gray text-white'
      }}
    >
   {children}
    </Select>
  )
}

export default SingleDropDown