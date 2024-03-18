import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap'

interface WatchlistModalProps {
    visible?: boolean
    onComplete: (result: string | undefined) => void
}

let textboxValue = ''
const NewWatchlistModal = ({
    visible = false,
    onComplete,
}: WatchlistModalProps): JSX.Element => {
    function toggle() {
        onComplete(undefined)
    }

    function handleSubmit() {
        onComplete(textboxValue)
    }

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.code === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <Modal
            size="sm"
            isOpen={visible}
            modalTransition={{ timeout: 0 }}
            centered
            toggle={toggle}
        >
            <ModalHeader toggle={toggle}>Create a new watchlist</ModalHeader>
            <ModalBody>
                <div className="form-group">
                    <input
                        className="form-control"
                        placeholder="Enter watchlist name"
                        onKeyPress={handleKeyPress}
                        onChange={(e) => {
                            textboxValue = e.target.value
                        }}
                    ></input>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>
                    Save
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default NewWatchlistModal
