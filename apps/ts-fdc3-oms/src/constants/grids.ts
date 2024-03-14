import { ColDef, ICellRendererFunc } from 'ag-grid-community'
import {
    SideCellRenderer,
    FillsCellRenderer,
    WatchlistCellRenderer,
    PortfolioCellRenderer,
    OrderTypeCellRenderer,
    LimitPriceCellRenderer,
    TimeInForceCellRenderer,
    getTransformCellRenderer,
} from '../components/AgCellRenrerers'
import { fmtDefaultDateTime } from '../util/ag-value-formatters'
import { vgetterInstrument } from '../util/ag-value-getters'

interface NumColumnParams {
    name: string
    field: string
    dataName?: string
    maxWidth?: number
    minWidth?: number
    cellRenderer?: ICellRendererFunc | undefined
}
export const defaultColumnDef: ColDef = {
    resizable: true,
    filter: true,
    sortable: true,
    enableCellChangeFlash: true,
    flex: 1,
}

function dateTimeColumn(
    name: string,
    field: string,
    sort?: 'desc' | 'asc' | null
): ColDef {
    const column: ColDef = {
        field: field,
        headerName: name,
        minWidth: 120,
        sort: sort,
        equals: (a, b) => {
            return a?.getTime() === b?.getTime()
        },
        valueFormatter: fmtDefaultDateTime,
        //cellStyle: { textOverflow: 'clip' },
        cellStyle: { textAlign: 'left', fontVariantNumeric: 'tabular-nums'},
        cellRenderer: getTransformCellRenderer("scaleX(.85)", "left"),
    }
    return column
}

function numColumn({
    name,
    field,
    dataName = '',
    maxWidth,
    cellRenderer,
    minWidth,
}: NumColumnParams): ColDef {
    // TODO: Refactor without dataName
    const column: ColDef = {
        field: field,
        headerName: name,
        minWidth: minWidth || 60,
        maxWidth: maxWidth,
        valueFormatter: dataName
            ? (params) => params.data && params.data[dataName]?.toFixed(2)
            : undefined,
        cellStyle: {
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
        },
        cellRenderer: cellRenderer,
    }

    return column
}

function percentColumn(
    field: string,
    headerName: string,
    cellRenderer?: ICellRendererFunc
): ColDef {
    const column: ColDef = {
        field: field,
        headerName: headerName,
        minWidth: 20,
        maxWidth: 120,
        cellStyle: {
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
        },
        comparator: (value1: number, value2: number): number => {
            return value1 - value2
        },
        valueFormatter: (params) => (params.value ? params.value + '%' : ''),
        cellRenderer: cellRenderer,
    }
    return column
}

const commonColDefs: ColDef[] = [
    {
        field: 'side',
        headerName: 'B/S',
        minWidth: 42,
        maxWidth: 80,
        cellStyle: { textAlign: 'center' },
        cellRenderer: SideCellRenderer,
        //cellRendererFramework: SideCellRendererComp,
    },
    {
        field: 'instrument',
        headerName: 'Security',
        minWidth: 60,
        cellStyle: { textOverflow: 'clip' },
        valueGetter: vgetterInstrument,
    },
    {
        field: 'quantity',
        headerName: 'Quantity',
        minWidth: 60,
        maxWidth: 80,
        cellStyle: { textAlign: 'right', fontVariantNumeric: 'tabular-nums'},
        cellRenderer: getTransformCellRenderer("scaleX(.90)", "right"),
    },
]

const orderBlotterCommonColDefs: ColDef[] = [
    {
        field: 'clientId',
        headerName: 'Client',
        minWidth: 60,
    },
    ...commonColDefs,
    {
        field: 'quantityFilled',
        headerName: 'Filled',
        minWidth: 60,
        maxWidth: 120,
        cellStyle: {
            textAlign: 'right',
            marginRight: '20px',
            fontVariantNumeric: 'tabular-nums',
        },
        enableCellChangeFlash: true,
        cellRenderer: FillsCellRenderer,
    },
    {
        field: 'tradeStatus',
        headerName: 'Status',
        minWidth: 60,
    },
    {
        field: 'orderType',
        headerName: 'Order Type',
        minWidth: 60,
        cellRenderer: OrderTypeCellRenderer,
    },
    {
        field: 'limitPrice',
        headerName: 'Limit Price',
        minWidth: 60,
        cellRenderer: LimitPriceCellRenderer,
    },
    {
        field: 'timeInForce',
        headerName: 'Validity',
        minWidth: 60,
        cellRenderer: TimeInForceCellRenderer,
    },
    {
        field: 'currency',
        headerName: 'Currency',
        minWidth: 60,
    },
    dateTimeColumn('Created', 'dateCreated', 'desc'),
]

export const columnDefsSlices: ColDef[] = [
    {
        field: 'sliceId',
        headerName: 'Slice Id',
        width: 80,
        minWidth: 80,
    },
    {
        field: 'brokerExchange',
        headerName: 'Exchange',
    },
    ...orderBlotterCommonColDefs,
]

export const columnDefsOrders: ColDef[] = [
    {
        field: 'orderId',
        headerName: 'Order Id',
        minWidth: 110,
        maxWidth: 110,
        cellRenderer: 'agGroupCellRenderer',
    },
    ...orderBlotterCommonColDefs,
]

export const columnTradePositions: ColDef[] = [
    {
        field: 'book',
        headerName: 'Book',
        minWidth: 60,
        rowGroup: true,
        hide: true,
    },
    {
        field: 'instrument',
        headerName: 'Security',
        minWidth: 60,
        cellStyle: { textOverflow: 'clip' },
        valueGetter: vgetterInstrument,
    },
    {
        field: 'position',
        headerName: 'Position',
        minWidth: 60,
        cellStyle: {
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
        },
    },
    numColumn({ name: 'Total Volume', field: 'totalVolume' }),
    numColumn({
        name: 'Average Price',
        field: 'averagePrice',
        dataName: 'averagePrice',
    }),
    numColumn({
        name: 'Total Price',
        field: 'totalPrice',
        dataName: 'totalPrice',
    }),
    {
        field: 'currency',
        headerName: 'Currency',
        minWidth: 60,
    },
]
export const columnDefsWatchlist: ColDef[] = [
    {
        field: 'instrument',
        headerName: 'Name',
        minWidth: 30,
        maxWidth: 80,
        valueGetter: vgetterInstrument,
    },
    {
        field: 'description',
        headerName: 'Description',
        minWidth: 180,
    },
    percentColumn('netChange', 'Net Change (%)'),
    numColumn({ name: 'Volume', field: 'volume', maxWidth: 100 }),
    numColumn({
        name: 'Last',
        field: 'lastPrice',
        dataName: 'lastPrice',
        maxWidth: 80,
    }),
    numColumn({
        name: 'Open',
        field: 'openPrice',
        dataName: 'openPrice',
        maxWidth: 80,
    }),
    numColumn({
        name: 'Low',
        field: 'lowPrice',
        dataName: 'lowPrice',
        maxWidth: 80,
        cellRenderer: WatchlistCellRenderer,
    }),
    numColumn({
        name: 'High',
        field: 'highPrice',
        dataName: 'highPrice',
        maxWidth: 80,
        cellRenderer: WatchlistCellRenderer,
    }),
    dateTimeColumn('Time', 'time'),
]

export const columnDefsTrade: ColDef[] = [
    {
        field: 'execBroker',
        headerName: 'Broker',
        width: 80,
        minWidth: 80,
    },
    ...commonColDefs,
    numColumn({
        name: 'Price',
        field: 'price',
        dataName: 'price',
        maxWidth: 80,
        minWidth: 80,
        cellRenderer: getTransformCellRenderer("scaleX(.9)", "right")
    }),
    {
        field: 'clientId',
        headerName: 'Client',
        width: 80,
        minWidth: 80,
    },
    {
        field: 'exchange',
        headerName: 'Exchange',
        width: 60,
        minWidth: 60,
    },
    {
        field: 'currency',
        headerName: 'Currency',
        minWidth: 60,
    },
    dateTimeColumn('Timestamp', 'timestamp', 'desc'),
    {
        field: 'orderId',
        headerName: 'Order Id',
        width: 80,
        minWidth: 80,
    },
    {
        field: 'sliceId',
        headerName: 'Slice Id',
        width: 92,
        minWidth: 92,
    },
]

export const columnDefsPortfolio: ColDef[] = [
    {
        field: 'description',
        headerName: 'Investment',
    },
    numColumn({ name: 'Quantity', field: 'quantity' }),
    numColumn({
        name: 'Market Price',
        field: 'marketPrice',
        dataName: 'marketPrice',
    }),
    numColumn({
        name: 'Value (£)',
        field: 'value',
        dataName: 'value',
        minWidth: 130,
    }),
    numColumn({ name: 'Cost', field: 'cost', dataName: 'cost', minWidth: 130 }),
    numColumn({
        name: 'Change (£)',
        field: 'change',
        dataName: 'change',
        minWidth: 100,
        cellRenderer: PortfolioCellRenderer,
    }),
    percentColumn('changePercent', 'Change (%)', PortfolioCellRenderer),
    percentColumn('portfolioPercent', '% of Portfolio'),
]
