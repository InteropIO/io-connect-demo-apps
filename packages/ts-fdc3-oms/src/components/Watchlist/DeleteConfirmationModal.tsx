import { Modal, ModalFooter, ModalHeader } from "reactstrap";

interface ModalProps {
  visible?: boolean;
  onComplete: (result: boolean) => void;
  selectedWatchlistName: string | undefined;
}

const DeleteConfirmationModal = ({
  visible = false,
  onComplete,
  selectedWatchlistName = "this watchlist",
}: ModalProps): JSX.Element => {

  function toggle() {
    onComplete(false);
  }

  function handleClose(success: boolean) {
    onComplete(success);
  }
  
  return (
    <>
      <Modal
        size="sm"
        isOpen={visible}
        modalTransition={{ timeout: 0 }}
        centered
        toggle={toggle}
      >
        <ModalHeader toggle={toggle}>
          Are you sure you want to delete {selectedWatchlistName} ?
        </ModalHeader>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleClose(true)}
          >
            Delete
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteConfirmationModal;
