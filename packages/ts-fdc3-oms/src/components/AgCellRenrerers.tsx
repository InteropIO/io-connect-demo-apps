import { ICellRendererParams } from 'ag-grid-community'
import { OrderInfo } from '../models/orders'

export const SideCellRenderer = (params: ICellRendererParams): any => {
    if (!params.value) return <div></div>

    const data: OrderInfo = params.data
    let className = ''
    if (data.side === '1') className = 'og-cell-buy'
    else if (data.side === '2') className = 'og-cell-sell'
    else className = 'og-cell-otherside'
    const sidesMap = params.context?.sidesMap
    const value = sidesMap ? sidesMap[params.value]?.shortName : params.value

    return (
        <div className={`og-cell-side ${className}`}>
            <span>{value}</span>
        </div>
    )
}

export const FillsCellRenderer = (params: ICellRendererParams): any => {
    if (typeof params.value !== 'number') {
        return <div></div>
    }

    const data: OrderInfo = params.data
    const perc = ~~((data.quantityFilled / data.quantity) * 100)

    return (
        <div>
            <div
                className={'og-cell-fills'}
                style={{ width: perc + '%' }}
            ></div>
            <div style={{ transform: 'scaleX(.90)', transformOrigin: 'right' }}>
                {params.value}
            </div>
        </div>
    ) as any
}

export const WatchlistCellRenderer = (params: ICellRendererParams): any => {
    if (!params.value) return <div></div>

    const field = params.colDef?.field
    let className = ''
    if (field === 'lowPrice') className = 'og-cell-sell'
    else if (field === 'highPrice') className = 'og-cell-buy'

    params.eGridCell.className = params.eGridCell.className + ' p-1'
    const value = params.value?.toFixed(2)

    return <div className={className}>{value}</div>
}

export const PortfolioCellRenderer = (params: ICellRendererParams): any => {
    if (!params.value) return <div></div>

    let className = ''
    const field = params.colDef?.field
    let value = params.value

    if (field === 'changePercent') {
        className = 'cell-txt-green'
    } else if (field === 'change') {
        className = 'og-cell-green'
        value = params.value?.toFixed(2)
    }

    params.eGridCell.className = params.eGridCell.className + ' p-1'
    return (
        <div className={className}>
            <span>{value}</span>
        </div>
    )
}

export const OrderTypeCellRenderer = (params: ICellRendererParams): any => {
    if (!params.value) return <div></div>

    const orderTypeMap = params.context?.orderTypeMap
    const value = orderTypeMap
        ? orderTypeMap[params.value]?.displayName
        : params.value

    return (
        <div>
            <span>{value}</span>
        </div>
    )
}

export const LimitPriceCellRenderer = (params: ICellRendererParams): any => {
    const value = params.value || 'N/A'

    return <div>{value}</div>
}

export const TimeInForceCellRenderer = (params: ICellRendererParams): any => {
    if (!params.value) return <div></div>

    const orderValidityMap = params.context?.orderValidityMap
    const value = orderValidityMap
        ? orderValidityMap[params.value]?.displayName
        : params.value

    return <div>{value}</div>
}

export const getTransformCellRenderer = (
    transform: string,
    origin?: string
) => {
    return (params: ICellRendererParams): any => {
        return (
            <div style={{ transform, transformOrigin: origin || 'center' }}>
                {params.valueFormatted || params.value}
            </div>
        )
    }
}
