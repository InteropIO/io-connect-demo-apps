function On({ message }: { message: string }) {
    return (
        <>
            <span id="status-icon" className="text-success icon-size-12 mr-2">
                <i className="icon-record"></i>
            </span>
            {message}
        </>
    )
}

function Off({ message }: { message: string }) {
    return (
        <>
            <span id="status-icon" className="text-danger icon-size-12 mr-2">
                <i className="icon-record"></i>
            </span>
            {message}
        </>
    )
}

export default function OnOffStatus({
    isOn,
    onMessage,
    offMessage,
}: OnOffStatusProps): JSX.Element {
    return (
        <small className="small d-flex align-items-center">
            {isOn ? <On message={onMessage} /> : <Off message={offMessage} />}
        </small>
    )
}

export interface OnOffStatusProps {
    isOn: boolean
    onMessage: string
    offMessage: string
}
