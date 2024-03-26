import { Fdc3Instrument, Fdc3InstrumentId } from './fdc3-instrument'

export interface InstrumentIdInternal {
    ticker: string
    bbgExchange: string  
}

export interface OrderTrade {
    orderId: number
    sliceId: number
    side: string
    instrument: InstrumentIdInternal
    quantity: number
    price: number
    currency: string
    timestamp: Date
    execBroker: string
    exchange: string
    comments: string
    bookId?: string
    clientId?: string
}

export interface OrderSplit {
    brokerIndex: number
    quantity: number
}

export interface OrderInfo {
    orderId: number
    dateCreated: Date
    clientId: string
    instrument: InstrumentIdInternal
    currency: string
    side: string
    quantity: number
    quantityFilled: number
    orderType: string
    timeInForce: string
    expireTime?: Date
    limitPrice?: number
    comments: string
    tradeStatus: string
    averagePrice: number
    brokerId?: string // only for slices
    sliceId?: number // only for slices
    split?: OrderSplit[]
    bookId?: string
}

export type OrderSlice = OrderInfo & {
    brokerExchange: string
}

export interface OrderFilter {
    fromDate?: Date
    toDate?: Date
    clientId?: string
    securityId?: InstrumentIdInternal
    instrument?: Fdc3Instrument
}

export interface OrderFilterEx extends OrderFilter {
    switchView?: boolean
    id?: Fdc3InstrumentId
}

export interface TradePosition {
    book: string
    ticker: string
    bbgTicker: string
    instrument: InstrumentIdInternal
    position: number
    averagePrice: number
    totalVolume: number
    totalPrice: number
    currency: string
}
