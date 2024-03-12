const instrumentRows = [
    [
        { key: 'volume', columnName: 'Volume' },
        { key: 'totalVWAP', columnName: 'TotalVWAP', type: 'float' },
    ],
    [
        { key: 'openPrice', columnName: 'Open', type: 'float' },
        { key: 'prevClosePrice', columnName: 'PrevClose', type: 'float' },
    ],
    [
        { key: 'highPrice', columnName: 'High', type: 'float' },
        { key: 'isin', columnName: 'ISIN' },
    ],
    [
        { key: 'lowPrice', columnName: 'Low', type: 'float' },
        { key: 'currency', columnName: 'Cur' },
    ],
]

const formatTableData = (data: any, column: any) => {
    let value = data ? data[column.key] : ''

    if (value && column.type === 'float') {
        value = value.toFixed(2)
    }

    return value
}

const InstrumentDetails = (props: InstrumentDetailsProps): JSX.Element => {
    const tableDataClass =
        props.theme === 'dark' ? 'table-data' : 'table-data-white-theme'

    return (
        <table className={'table market-depth-table'}>
            <tbody>
                {instrumentRows.map((columns: any) => {
                    return (
                        <tr key={columns[0].columnName}>
                            <td className="table-header">
                                {columns[0].columnName}
                            </td>
                            <td className={tableDataClass}>
                                {formatTableData(props.data, columns[0])}
                            </td>
                            <td className="table-header">
                                {columns[1].columnName}
                            </td>
                            <td className={tableDataClass}>
                                {formatTableData(props.data, columns[1])}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default InstrumentDetails

export interface InstrumentDetailsProps {
    data: any
    theme: any
}
