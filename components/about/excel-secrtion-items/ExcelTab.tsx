import classes from '../../../stylings/gradient.module.css'

import React from 'react'

type Props = {children:React.ReactNode}

function ExcelTab({ children }: Props) {
    return (
        <div className={`flex flex-col h-52 md:max-w-40 xl:max-w-xs w-full gap-4 items-center justify-center ${classes['light-blue-gradient']} p-4 rounded-lg`}>
          {children}
    </div>
  )
}

export default ExcelTab