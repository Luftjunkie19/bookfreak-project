import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'

type Props = {
    isOpen: boolean,
    modalTitle?: string,
    modalBodyContent?: React.ReactNode,
    modalFooterContent?: React.ReactNode,
    onOpenChange:(isOpen?: boolean)=>void,
}

function ModalComponent({isOpen,onOpenChange,modalTitle, modalBodyContent, modalFooterContent }: Props) {
  return (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
                      <ModalHeader className="flex flex-col gap-1">{modalTitle}</ModalHeader>
              <ModalBody>
               {modalBodyContent}
              </ModalBody>
              <ModalFooter>
                {modalFooterContent}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  )
}

export default ModalComponent