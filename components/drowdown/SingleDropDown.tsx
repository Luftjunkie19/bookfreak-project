import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectProps } from '@nextui-org/react';
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

type Props = {
    children: any,
    label?:string,
  name?: string,
  selectedKeys: Set<string>,
    selectedValue?:string | number | readonly string[] 
} & SelectProps

function SingleDropDown({ children, label,selectedKeys,selectedValue,  name, ...props }: Props) {
  const { register } = useForm();
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);



    const clickDropdown = () => {
        setIsDropDownOpen(!isDropDownOpen);
    }
    
  return (<Select
    {...props}
    name={name}
      label={<p className='text-white'>{label}</p>}
      placeholder={`Select ${label}`}
      className="max-w-xs w-full text-white"
      value={selectedValue}
    labelPlacement='outside'
      classNames={{
        'trigger': 'bg-dark-gray text-white border-2 rounded-lg border-primary-color hover:bg-dark-gray focus:bg-dark-gray py-2', 
        'label': 'text-white text-sm',
        'value': 'text-sm text-white',
        'listbox': 'outline-none',
        'popoverContent': 'bg-dark-gray text-white border-2 rounded-lg border-primary-color',
        'listboxWrapper': 'bg-dark-gray text-white',
        
      }}
    >
   {children}
    </Select>
  )
}

export default SingleDropDown