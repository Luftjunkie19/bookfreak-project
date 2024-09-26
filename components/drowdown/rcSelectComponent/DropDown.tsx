import React from 'react'
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';

type Props = { children: React.ReactNode } 

function DropDown({children}: Props) {
  return (
      <Select>
          {children}
    </Select>
  )
}

export default DropDown