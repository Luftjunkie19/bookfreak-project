import { Button } from '@/components/ui/button'
import { DrawerClose, Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import React from 'react'
import { FaHamburger } from 'react-icons/fa'

type Props = {}

function MobileDrawer({}: Props) {
  return (
 <Drawer>
          <DrawerTrigger className="lg:hidden ">
              <FaHamburger className="text-white" size={24}/>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
  )
}

export default MobileDrawer