import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import React, { useMemo, useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

type Props = {
    children: any,
    selectedArray: string[],
    label?:string
}

function SingleDropDown({ children, selectedArray, label }: Props) {
    
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(selectedArray));
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

    const clickDropdown = () => {
        setIsDropDownOpen(!isDropDownOpen);
    }
    
    return (<div className="flex gap-1 flex-col">
        {label && <p className="text-white">{label}</p>}     
        <Dropdown classNames={{
            'content': 'bg-dark-gray border-2 border-primary-color',
            
 }}>
      <DropdownTrigger>
        <div onClick={clickDropdown} className="max-w-xs text-white w-full flex justify-between items-center p-2 bg-dark-gray border-2 rounded-lg border-primary-color">
                    <p>Select Genre</p>
                    {isDropDownOpen ? <IoIosArrowUp/> : <IoIosArrowDown />}
                  </div>
      </DropdownTrigger>
            <DropdownMenu 
            className='bg-dark-gray'
                data-pr-classname='bg-dark-gray'
                classNames={{
                    'list': "bg-dark-gray text-white",
                    'base': 'bg-dark-gray text-white',
                
                }}
                itemClasses={{
                    'wrapper':'focus:text-white focus:bg-primary-color active:bg-primary-color active:text-white hover:bg-primary-color hover:text-white',
                      'base':'focus:text-white focus:bg-primary-color active:bg-primary-color active:text-white hover:bg-primary-color hover:text-white'
                }}
        aria-label="Single selection example"
        variant="flat"
        selectionMode="single"
      >
      {children}
      </DropdownMenu>
    </Dropdown>
  </div>
  )
}

export default SingleDropDown