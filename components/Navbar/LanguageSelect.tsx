'use client';
import {
  useMemo,
  useState,
} from 'react';

import Image from 'next/image';
import { IoLanguage } from 'react-icons/io5';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from '@nextui-org/react';

function LanguageSelect() {
  const selectedLangugage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
    const [selectedKey, setSelectedKey] = useState<Selection>(new Set([selectedLangugage]));
  const dispatch = useDispatch();

  const handleMenuItemClick = (unicode) => {
    console.log(unicode);
    // dispatch(languageActions.selectLanguage(unicode));

    setSelectedKey(unicode);
  };
  const selectedValue = useMemo(
    () => Array.from(selectedKey).join(", ").replaceAll("_", " "),
    [selectedKey]
  );



  const options = [
    { unicode: "eng", flagUrl: "https://flagcdn.com/w40/gb.png" },
    { unicode: "ger", flagUrl: "https://flagcdn.com/w40/de.png" },
    { unicode: "pl", flagUrl: "https://flagcdn.com/w40/pl.png" },
  ];

  

  return (
   <Dropdown>
      <DropdownTrigger>
        <Button 
          color={'default'}
          variant={'light'}
          className="capitalize"
        >
         <IoLanguage className="text-white text-2xl"/>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dropdown Variants"
        variant="flat"
        selectionMode="single"
        selectedKeys={selectedValue}
        onSelectionChange={setSelectedKey}
      >
        {options.map((item, i) => (<DropdownItem textValue={item.unicode} key={item.unicode}>
          <Image width={24} height={24} src={item.flagUrl} className=" h-8 w-8 rounded-full object-cover" alt=''/>
        </DropdownItem>))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default LanguageSelect;
