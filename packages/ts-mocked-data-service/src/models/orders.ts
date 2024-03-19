export interface OrderTrade {
  orderId: number
  sliceId: number
  side: string
  instrument: {
    ticker: string
    bbgExchange: string
  }
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
  instrument: {
    ticker: string
    bbgExchange: string
  }
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

export interface TradePosition {
  book: string
  instrument: {
    ticker: string
    bbgExchange: string
  }
  position: number
  averagePrice: number
  totalVolume: number
  totalPrice: number
  currency: string
}
