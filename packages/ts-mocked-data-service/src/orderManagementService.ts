import { Glue42 } from '@glue42/desktop'
import { brokers } from './constants/brokers'
import { clients } from './constants/clients'
import { defaultInstruments } from './constants/defaultInstruments'
import { Funds } from './constants/funds'
import { instruments } from './constants/instruments'
import {
  METHODNAME_CREATE_ORDER,
  METHODNAME_CREATE_TRADE,
  METHODNAME_GET_ALL_TRADES,
  METHODNAME_GET_BROKERS,
  METHODNAME_GET_CLIENTS,
  METHODNAME_GET_FDC3_INSTRUMENTS,
  METHODNAME_GET_FUNDS,
  METHODNAME_GET_INSTRUMENTS,
  METHODNAME_GET_ORDER,
  METHODNAME_GET_ORDERS,
  METHODNAME_GET_ORDER_ID,
  METHODNAME_GET_ORDER_SIDES,
  METHODNAME_GET_ORDER_TYPES,
  METHODNAME_GET_ORDER_VALIDITY,
  METHODNAME_GET_TRADES_FOR_INSTRUMENT,
  METHODNAME_GET_TRADING_POSITIONS,
} from './constants/methods'
import { ORDER_SIDES, ORDER_TYPES, ORDER_VALIDITY } from './constants/orders'
import DataService from './dataService'
import { Fdc3Instrument } from './models/fdc3-instrument'
import { MockServiceOptions } from './models/mockServiceOptions'
import {
  OrderInfo,
  OrderSlice,
  OrderTrade,
  TradePosition,
} from './models/orders'
import { DateEndOfDay, DateIsValid, DateStartOfDay } from './util/datetime'
import {
  addOrderSplit,
  getDetOrderId,
  getMaxOrdersPerDay,
  getOrderById,
  getOrders,
  getOrderTrades,
  getTradeCloseHours,
  getTradeOpenHours,
  setMaxOrdersPerDay,
  setMockToday,
  setTradeCloseHours,
  setTradeOpenHours,
} from './util/order-generator'

interface MethodRegistrationItem {
  definition: Glue42.Interop.MethodDefinition
  handler: (args: any, caller: any) => any
}

const stringToTimeValues = (input?: string) => {
  const match = input?.match(
    /(\d\d?)(?:[.:](\d\d?)(?:[.:](\d\d?)(?:[.:](\d\d?\d?))?)?)?/
  )
  if (!match) return undefined
  return [
    parseInt(match[1]) || 0,
    parseInt(match[2]) || 0,
    parseInt(match[3]) || 0,
    parseInt(match[4]) || 0,
  ]
}

class OrderManagementService implements DataService {
  private glue: any
  private methods: MethodRegistrationItem[]
  private customOrders: OrderInfo[]
  private customTrades: OrderTrade[]

  private optMockToday: Date | undefined
  private optTradeOpenHours: string | undefined
  private optTradeCloseHours: string | undefined
  private optMaxOrdersPerDay: string | number | undefined

  constructor(glue: any, options?: MockServiceOptions) {
    this.glue = glue
    this.methods = []
    this.customOrders = []
    this.customTrades = []

    this.optMockToday = options?.mockToday
    this.optTradeOpenHours = options?.tradeOpenHours
    this.optTradeCloseHours = options?.tradeCloseHours
    this.optMaxOrdersPerDay = options?.maxOrdersPerDay
  }

  async initialize(): Promise<void> {
    if (this.optMockToday) {
      const mockToday = new Date(this.optMockToday)
      console.log('OrderManagementService: using mockToday:', mockToday)
      setMockToday(mockToday)
    }

    setTradeOpenHours(stringToTimeValues(this.optTradeOpenHours))
    console.log(
      'OrderManagementService: trade open hours:',
      getTradeOpenHours()
    )

    setTradeCloseHours(stringToTimeValues(this.optTradeCloseHours))
    console.log(
      'OrderManagementService: trade close hours:',
      getTradeCloseHours()
    )

    setMaxOrdersPerDay(this.optMaxOrdersPerDay)
    console.log(
      'OrderManagementService: max orders per day:',
      getMaxOrdersPerDay()
    )

    this.methods.push({
      definition: {
        name: METHODNAME_GET_ORDERS,
        accepts: 'Datetime date, bool withSlices, bool withTrades',
        returns:
          'composite: [] orders, composite: [] trades, composite: [] slices',
        displayName: 'Get Orders from OMS',
        description: 'Retrieve a list of orders from OMS',
      },
      handler: (args: any) => this.getOrdersImpl(args),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_ORDER,
        accepts:
          'String orderId, Datetime date, bool withSlices, bool withTrades',
        returns: 'composite: order, composite: [] trades, composite: [] slices',
        displayName: 'Get Order from OMS',
        description: 'Retrieve an order from OMS',
      },
      handler: (args: any) => this.getOrderImpl(args),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_ALL_TRADES,
        accepts: 'Datetime date',
        returns: 'composite: [] trades',
        displayName: 'Get all daily trades as of date/time',
        description: 'Retrieve all daily trades as of date/time',
      },
      handler: (args: any) => this.getAllTradesImpl(args),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_TRADES_FOR_INSTRUMENT,
        accepts: 'Datetime date, Fdc3Instrument instrument',
        returns: 'composite: [] trades',
        displayName: 'Get all daily trades for instrument as of date/time',
        description: 'Retrieve all daily trades for instrument as of date/time',
      },
      handler: (args: any) => this.getTradesForInstrumentImpl(args),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_ORDER_ID,
        accepts: 'String sliceId',
        returns: 'String orderId',
        displayName: 'Get orderId for the provided sliceId',
        description: 'Retrieve the orderId of the provided sliceId',
      },
      handler: (args: any) => this.getOrderIdImpl(args),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_TRADING_POSITIONS,
        accepts: 'Datetime date',
        returns: 'composite tradingPositions',
        displayName: 'Get trading positions as of date/time',
        description: 'Retrieve trading positions as of date/time',
      },
      handler: (args: any) => this.getTradingPositionsImpl(args),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_CREATE_ORDER,
        accepts: 'Datetime date',
        returns: '',
        displayName: 'Create Order',
        description: 'Creates a new order in the OMS.',
      },
      handler: (args: any) => this.createOrderImpl(args),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_CREATE_TRADE,
        accepts: 'composite: { trade: OrderTrade } trade',
        returns: '',
        displayName: 'Create Trade',
        description: 'Creates a new trade in the OMS.',
      },
      handler: (args: any) => this.createTradeImpl(args),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_BROKERS,
        accepts: '',
        returns:
          'composite: { string brokerId, string brokerExchange } [] brokers',
        displayName: 'Get Brokers',
        description: 'Retrieve a list of brokers.',
      },
      handler: () => ({
        brokers,
      }),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_INSTRUMENTS,
        accepts: '',
        returns: 'InstrumentInfo [] instruments',
        displayName: 'Get instrument list',
        description: 'Retrieve a list of instruments',
      },
      handler: () => ({
        instruments,
      }),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_FDC3_INSTRUMENTS,
        accepts: '',
        returns: 'Fdc3InstrumentList [] instruments',
        displayName: 'Get FDC3 instrument list',
        description: 'Retrieve a list of fdc3 instruments',
      },
      handler: () => ({ instruments: defaultInstruments }),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_CLIENTS,
        accepts: '',
        returns: 'ClientInfo [] clients',
        displayName: 'Get client list',
        description: 'Retrieve a list of clients',
      },
      handler: () => ({ clients }),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_ORDER_VALIDITY,
        accepts: '',
        returns: 'composite orderValidity',
        displayName: 'Get Orders validity values',
        description: 'Retrieve a list of order validity values',
      },
      handler: () => ({ orderValidity: ORDER_VALIDITY }),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_ORDER_TYPES,
        accepts: '',
        returns: 'composite: orderTypes',
        displayName: 'Get Orders types',
        description: 'Retrieve a list of orders types',
      },
      handler: () => ({ orderTypes: ORDER_TYPES }),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_ORDER_SIDES,
        accepts: '',
        returns: 'composite: orderSides',
        displayName: 'Get Orders sides',
        description: 'Retrieve a list of orders sides',
      },
      handler: () => ({ orderSides: ORDER_SIDES }),
    })

    this.methods.push({
      definition: {
        name: METHODNAME_GET_FUNDS,
        accepts: '',
        returns: 'composite: FundInfo',
        displayName: 'Get Funds',
        description: 'Get Funds',
      },
      handler: () => ({ funds: Funds }),
    })

    for (const { definition, handler } of this.methods) {
      this.glue.interop
        .register(definition, handler)
        .then(() => {
          console.log('Method ' + definition.name + ' registered.')
        })
        .catch((e: any) => {
          console.error('Method registration failed for ' + definition.name, e)
        })
    }
  }

  private getCustomOrders = (
    date: Date
  ): {
    orders: OrderInfo[]
    trades: OrderTrade[][]
    slices: OrderSlice[][]
  } => {
    if (!this.customOrders) return { orders: [], trades: [], slices: [] }
    const start = DateStartOfDay(date)
    const orders = this.customOrders.filter((order) => {
      return (
        order.dateCreated.getTime() >= start.getTime() &&
        order.dateCreated.getTime() <= date.getTime()
      )
    })
    const trades: OrderTrade[][] = []
    const slices: OrderSlice[][] = []
    for (const order of orders) {
      const { trades: orderTrades, slices: orderSlices } = getOrderTrades(
        order,
        date
      )
      trades.push(orderTrades)
      slices.push(orderSlices)
    }
    return { orders, trades, slices }
  }

  private getCustomOrder = (
    date: Date,
    orderId: number
  ):
    | { order: OrderInfo; trades: OrderTrade[]; slices: OrderSlice[] }
    | undefined => {
    if (!this.customOrders) return undefined
    const start = DateStartOfDay(date)
    const order = this.customOrders.find((order) => {
      return (
        order.orderId == orderId &&
        order.dateCreated.getTime() >= start.getTime() &&
        order.dateCreated.getTime() <= date.getTime()
      )
    })
    if (!order) return undefined
    const { trades, slices } = getOrderTrades(order, date)
    return { order, trades, slices }
  }

  private getOrdersImpl = async ({
    date,
    withTrades,
    withSlices,
  }: {
    date: Date
    withTrades: boolean
    withSlices: boolean
  }): Promise<{ orders: OrderInfo[]; trades?: OrderTrade[][] }> => {
    //console.log("Getting orders...")
    const { orders, trades, slices } = getOrders(date)
    const {
      orders: customOrders,
      trades: customTrades,
      slices: customSlices,
    } = this.getCustomOrders(date)
    orders.push(...customOrders)
    trades.push(...customTrades)
    slices.push(...customSlices)
    return {
      orders,
      ...(withTrades && { trades }),
      ...(withSlices && { slices }),
    }
  }

  private getOrderImpl = async ({
    orderId,
    date,
    withTrades,
    withSlices,
  }: {
    orderId: number
    date: Date
    withTrades?: boolean
    withSlices?: boolean
  }): Promise<
    | { order: OrderInfo; trades?: OrderTrade[]; slices?: OrderSlice[] }
    | undefined
  > => {
    const result =
      this.getCustomOrder(date, orderId) || getOrderById(date, orderId)

    let trades: OrderTrade[] = []

    if (withTrades) {
      const { trades: customTrades } = this.getCustomTrades(date)
      trades = customTrades.filter((trade) => trade.orderId == orderId)
    }

    if (!result) return undefined
    return {
      order: result.order,
      ...(withTrades && { trades: result.trades.concat(trades) }),
      ...(withSlices && { slices: result.slices }),
    }
  }

  private getCustomTrades = (date: Date): { trades: OrderTrade[] } => {
    if (!this.customTrades) return { trades: [] }
    const start = DateStartOfDay(date)
    const trades = this.customTrades.filter((trade) => {
      return (
        trade.timestamp.getTime() >= start.getTime() &&
        trade.timestamp.getTime() <= date.getTime()
      )
    })

    return { trades }
  }

  private getAllTradesImpl = async ({
    date,
  }: {
    date: Date
  }): Promise<{ trades: OrderTrade[] }> => {
    //console.log('Getting trades...')
    const { trades: automaticTrades } = getOrders(date)
    const { trades: customTrades } = this.getCustomTrades(date)
    const { trades: customOrderTrades } = this.getCustomOrders(date)
    const trades: OrderTrade[] = [
      ...automaticTrades.flat(),
      ...customTrades,
      ...customOrderTrades.flat(),
    ]

    return { trades }
  }

  private getTradesForInstrumentImpl = async ({
    date,
    instrument,
  }: {
    date: Date
    instrument: Fdc3Instrument
  }): Promise<{ trades: OrderTrade[] }> => {
    const { trades } = await this.getAllTradesImpl({ date })

    const instrumentTrades = trades.filter(
      (trade) => trade.instrument?.ticker === instrument.id?.ticker
    )

    return { trades: instrumentTrades }
  }

  private getOrderIdImpl = (context: any): string => {
    let result = ''

    if (context.sliceId) {
      result = (context.sliceId + '').slice(0, -2)
    }

    return result
  }

  private getDefaultTradingPosition = (): TradePosition => ({
    book: '',
    instrument: {
      ticker: '',
      bbgExchange: '',
    },
    position: 0,
    averagePrice: 0,
    totalVolume: 0,
    totalPrice: 0,
    currency: 'GBX',
  })

  private addTradeToPosition = (
    tradePosition: TradePosition,
    trade: OrderTrade
  ): void => {
    let positionMultiplier = 1
    if (trade.side === '2') {
      positionMultiplier = -1
    }

    if (!tradePosition.book) {
      tradePosition.book = trade.bookId || ''
    }

    if (!tradePosition.instrument.ticker && !tradePosition.instrument.ticker) {
      tradePosition.instrument = trade.instrument
    }

    const newPosition =
      tradePosition.position + positionMultiplier * trade.quantity
    const newTotalVolume = tradePosition.totalVolume + trade.quantity
    const newTotalPrice =
      tradePosition.totalPrice + trade.quantity * trade.price
    const newAveragePrice = newTotalPrice / newTotalVolume

    tradePosition.position = newPosition
    tradePosition.totalVolume = newTotalVolume
    tradePosition.totalPrice = newTotalPrice
    tradePosition.averagePrice = newAveragePrice
  }

  private mapTradesToPositions = (trades: OrderTrade[]) => {
    const positions: any = {}

    trades.forEach((trade) => {
      const bookId = trade.bookId || ''
      const ticker = trade.instrument.ticker

      if (!positions[bookId]) {
        positions[bookId] = {}
      }

      if (!positions[bookId][ticker]) {
        positions[bookId][ticker] = this.getDefaultTradingPosition()
      }

      this.addTradeToPosition(positions[bookId][ticker], trade)
    })

    console.log('mapTradesToPositions(): ', positions)

    return positions
  }

  private getTradingPositionsImpl = async ({
    date,
  }: {
    date: Date
  }): Promise<any> => {
    const trades = await this.getAllTradesImpl({ date })

    const positions = this.mapTradesToPositions(trades.trades)

    return positions
  }

  private createOrderImpl = async ({ order }: { order: OrderInfo }) => {
    console.log('CreatingOrder...', order)
    const dateCreated = DateIsValid(order.dateCreated)
      ? order.dateCreated
      : new Date()
    const endOfDay = DateEndOfDay(dateCreated)
    const { orders: existing } = this.getCustomOrders(endOfDay)

    const books = ['AGENCY', 'RISK']
    const orderId = getDetOrderId(dateCreated, 1000 + existing.length)
    const bookId = books[orderId % 2]

    const newOrder: OrderInfo = {
      orderId,
      dateCreated,
      clientId: order.clientId || 'TEST1',
      side: order.side || '1',
      instrument: order.instrument || { ticker: 'VOD', bbgExchange: 'LN' },
      currency: 'GBX',
      quantity: order.quantity || 1000,
      orderType: order.orderType || '1',
      timeInForce: order.timeInForce || '0',
      expireTime: order.expireTime,
      quantityFilled: 0,
      limitPrice: order.limitPrice,
      comments: '',
      averagePrice: 0,
      tradeStatus: 'open',
      brokerId: 'XX',
      bookId,
    }

    addOrderSplit(newOrder)
    this.customOrders.push(newOrder)
  }

  private createTradeImpl = async ({ trade }: { trade: OrderTrade }) => {
    console.log('CreatingTrade...', trade)

    const newTrade = trade as OrderTrade
    this.customTrades.push(newTrade)
  }
}

export default OrderManagementService
