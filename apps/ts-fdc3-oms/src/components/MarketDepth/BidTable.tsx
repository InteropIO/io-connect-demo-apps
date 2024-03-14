export interface BidData {
    count: number
    volume: number
    price: number
    side: string
}
enum Side {
    buy = '1',
    sell = '2',
}

interface Header {
    key: string
    columnName: string
}
export const BidTable = ({
    className,
    data,
}: {
    className: string
    data: BidData[]
}): JSX.Element => {
    const bids: BidData[] = sortAndFilter(data, Side.buy)
    const asks: BidData[] = sortAndFilter(data, Side.sell)
    const tableColumns: Header[] = [
        { key: 'count', columnName: 'Count' },
        { key: 'volume', columnName: 'Volume' },
        { key: 'price', columnName: 'Price' },
    ]

    return (
        <div className={'d-flex ' + { className }}>
            <div>
                <em className="float-right mr-1">Bids</em>
                {table(tableColumns, bids, 'text-right')}
            </div>

            <div>
                <em className="float-left ml-1">Asks</em>
                {table(tableColumns.splice(0).reverse(), asks, 'text-left')}
            </div>
        </div>
    )
}

function table(tableHeaders: Header[], data: BidData[], rowClass: string) {
    return (
        <table className={'table table-hover market-depth-table'}>
            <thead>
                <tr className={rowClass}>
                    {tableHeaders.map((columns: any) => {
                        return (
                            <th key={columns.key} className="table-header">
                                {columns.columnName}
                            </th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {data.map((row: any, index) => {
                    return (
                        <tr key={index} className={rowClass}>
                            {tableHeaders.map((header: Header, index) => {
                                return (
                                    <td
                                        className={
                                            row.side === '1'
                                                ? 'text-primary'
                                                : 'text-danger'
                                        }
                                        key={index}
                                    >
                                        {row[header.key]}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

function comparator(a: BidData, b: BidData, side: Side) {
    if (a.price > b.price) return side === '1' ? -1 : 1 //if side is buy, sort a before b, else if sell side, reverse
    if (a.price < b.price) return side === '1' ? 1 : -1
    return 0
}

function sortAndFilter(data: BidData[], side: Side): BidData[] {
    data = data.filter((order) => order.side === side)
    data = data.sort((a, b) => comparator(a, b, side))
    return data
}
