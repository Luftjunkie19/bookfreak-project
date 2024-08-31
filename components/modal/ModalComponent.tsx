import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'

type Props = {
    isOpen: boolean,
    modalTitle?: string,
    modalBodyContent?: React.ReactNode,
    modalFooterContent?: React.ReactNode,
  onOpenChange: (isOpen?: boolean) => void,
  onClose?:()=>void | Promise<void>,
    modalSize?:"sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "3xl" | "4xl" | "5xl" | "full" | undefined,
}

function ModalComponent({isOpen,onOpenChange,modalTitle, onClose, modalSize, modalBodyContent, modalFooterContent }: Props) {
  return (
    <Modal onClose={onClose} size={modalSize} backdrop='blur' classNames={{
      'base': 'bg-dark-gray border border-primary-color p-2',
      closeButton:"hover:bg-red-500 transition-all duration-400 hover:text-white"
    }} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
                      <ModalHeader className="flex flex-col gap-1 text-white">{modalTitle}</ModalHeader>
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