import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export default function TradeDialog(props: NewOrderDialogProps): JSX.Element {
  return (
    <Modal size="lg"
      isOpen={true}
      modalTransition={{ timeout: 0 }}
      centered
    >
      <ModalHeader>{props.modalHeader}</ModalHeader>
      <ModalBody>
        {props.form}
      </ModalBody>
      <ModalFooter>
      </ModalFooter>
    </Modal>
  );
}

export interface NewOrderDialogProps {
    // onModalComplete: () => void
    form: JSX.Element
    modalHeader: string
}
