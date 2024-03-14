const formatNumberValue = (value: any) => {
    let result = ''

    if (value || value === 0) {
        result = value.toFixed(2)
    }

    return result
}
const YellowStrip = (props: any) => {
    const lastPrice = props.data?.lastPrice
    const prevClosePrice = props.data?.prevClosePrice
    let netChange = null
    let increasePercentage = null
    let movementClass = ''

    if (lastPrice && prevClosePrice) {
        netChange = lastPrice - prevClosePrice
        increasePercentage = (netChange / props.data.prevClosePrice) * 100

        movementClass =
            netChange >= 0
                ? 'instrument-movement-up'
                : 'instrument-movement-down'
    }

    const lastUpdatedDate = props.data?.time
    let lastUpdatedDateString = ''
    if (lastUpdatedDate) {
        lastUpdatedDateString = lastUpdatedDate.toTimeString()?.split(' ')[0]
    }

    return (
        <div>
            <div className="row">
                <span className={'col-3 ' + movementClass}>
                    {props.data?.description}
                </span>
                <div className="col-4">
                    <span>{'Last Price: ' + formatNumberValue(lastPrice)}</span>
                    <br />
                    <span>
                        {'Last Volume: ' + props.data?.lastTradedVolume}
                    </span>
                </div>
                <span className={'col-3 ' + movementClass}>
                    {formatNumberValue(netChange) +
                        ' (' +
                        formatNumberValue(increasePercentage) +
                        '%)'}
                </span>
                <span className={'col-2 ' + movementClass}>
                    {lastUpdatedDateString}
                </span>
            </div>
        </div>
    )
}

export default YellowStrip
