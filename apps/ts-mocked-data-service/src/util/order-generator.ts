import { OrderInfo, OrderSlice, OrderSplit, OrderTrade } from '../models/orders'
import { PRNG, PRNG_sfc32 } from './prng'
import { InstrumentInfo } from '../models/instruments'
import { instruments } from '../constants/instruments'
import { clients } from '../constants/clients'
import { DateAddDays, DateAddSeconds, DateGetDaysSpan } from './datetime'
import { brokers } from '../constants/brokers'
import { BrokerInfo } from '../models/brokers'

const MIN_PRICE_PERCENT_DIFFERENCE = -5
const MAX_PRICE_PERCENT_DIFFERENCE = 5

const EPOCH_START = new Date('2010-01-01')

let MOCK_TODAY: Date | undefined = undefined
export const setMockToday = (newMockToday: Date | undefined) => {
  MOCK_TODAY = newMockToday
}

let TRADE_OPEN_HOURS: [number, number, number, number] = [9, 30, 0, 0]
export const setTradeOpenHours = (newHours?: number[]): number[] => {
  if (Array.isArray(newHours)) {
    TRADE_OPEN_HOURS[0] = newHours[0] || 0
    TRADE_OPEN_HOURS[1] = newHours[1] || 0
    TRADE_OPEN_HOURS[2] = newHours[2] || 0
    TRADE_OPEN_HOURS[3] = newHours[3] || 0
  }
  return [...TRADE_OPEN_HOURS]
}
export const getTradeOpenHours = () => [...TRADE_OPEN_HOURS]

let TRADE_CLOSE_HOURS: [number, number, number, number] = [16, 0, 0, 0]
export const setTradeCloseHours = (newHours?: number[]): number[] => {
  if (Array.isArray(newHours)) {
    TRADE_CLOSE_HOURS[0] = newHours[0] || 0
    TRADE_CLOSE_HOURS[1] = newHours[1] || 0
    TRADE_CLOSE_HOURS[2] = newHours[2] || 0
    TRADE_CLOSE_HOURS[3] = newHours[3] || 0
  }
  return [...TRADE_CLOSE_HOURS]
}
export const getTradeCloseHours = () => [...TRADE_CLOSE_HOURS]

let MAX_ORDERS_PER_DAY = 100
export const setMaxOrdersPerDay = (newLimit: string | number | undefined) => {
  MAX_ORDERS_PER_DAY = parseInt(newLimit as string) || MAX_ORDERS_PER_DAY
  return MAX_ORDERS_PER_DAY
}
export const getMaxOrdersPerDay = () => MAX_ORDERS_PER_DAY

const orderSchedules: Record<string, Date[]> = {}

const getAdjustedDate = (date: Date): Date => {
  if (!MOCK_TODAY) return date
  const today = new Date()
  const diffDays = DateGetDaysSpan(today, MOCK_TODAY)
  return DateAddDays(date, diffDays)
}

const getAdjustedDateReverse = (date: Date): Date => {
  if (!MOCK_TODAY) return date
  const today = new Date()
  const diffDays = DateGetDaysSpan(MOCK_TODAY, today)
  return DateAddDays(date, diffDays)
}

export const getTradeOpenTime = (date: Date): Date => {
  const result = new Date(date)
  result.setHours(...TRADE_OPEN_HOURS)
  return result
}

export const getTradeCloseTime = (date: Date): Date => {
  const result = new Date(date)
  result.setHours(...TRADE_CLOSE_HOURS)
  return result
}

export const getDetOrderId = (date: Date, index: number): number => {
  date = getAdjustedDate(date)
  const dateSerialNumber = DateGetDaysSpan(EPOCH_START, date)
  return (dateSerialNumber << 12) + index
}

export const getDateFromOrderId = (orderId: number): Date => {
  const dateSerialNumber = orderId >> 12
  const date = DateAddDays(EPOCH_START, dateSerialNumber)
  return getAdjustedDateReverse(date)
}

const getDetOrderPrng = (orderId: number): PRNG => {
  const prng = new PRNG_sfc32(orderId.toString(16))
  return prng
}

const getDetDatePrng = (date: Date): PRNG => {
  const prng = new PRNG_sfc32(date)
  return prng
}

const getDetPricePrng = (date: Date): PRNG => {
  const prng = new PRNG_sfc32(date.toISOString())
  return prng
}

const getDetOrderSchedule = (date: Date): Date[] => {
  date = getAdjustedDate(date)
  const dateKey =
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  let result = orderSchedules[dateKey]
  if (result) {
    return result
  }

  result = []
  const tradeOpen = getTradeOpenTime(date)
  const tradeClose = getTradeCloseTime(date)
  const tradeDayDurationSec =
    (tradeClose.getTime() - tradeOpen.getTime()) / 1000
  const prng = getDetDatePrng(date)

  let accumulatedSeconds = 0
  let minutesFrom = 1,
    minutesTo = 3
  for (let i = result.length; i < 10 && i < MAX_ORDERS_PER_DAY; ++i) {
    const nextIntervalSec = prng.next32Range(minutesFrom * 60, minutesTo * 60)
    accumulatedSeconds += nextIntervalSec
    if (accumulatedSeconds >= tradeDayDurationSec) break
    result.push(DateAddSeconds(tradeOpen, accumulatedSeconds))
  }

  minutesFrom = 3
  minutesTo = 8
  for (let i = result.length; i < MAX_ORDERS_PER_DAY; ++i) {
    const nextIntervalSec = prng.next32Range(minutesFrom * 60, minutesTo * 60)
    accumulatedSeconds += nextIntervalSec
    if (accumulatedSeconds >= tradeDayDurationSec) break
    result.push(DateAddSeconds(tradeOpen, accumulatedSeconds))
  }

  orderSchedules[dateKey] = result
  return result
}

export interface GetOrdersResult {
  orders: OrderInfo[]
  trades: OrderTrade[][]
  slices: OrderSlice[][]
}

export const getOrders = (date?: Date): GetOrdersResult => {
  const startTime = new Date()
  const currentDate = date || new Date()

  const orders: OrderInfo[] = []
  const trades: OrderTrade[][] = []
  const slices: OrderSlice[][] = []

  const orderSchedule = getDetOrderSchedule(currentDate)
  const ordersPerDay = orderSchedule.length
  for (let i = 0; i < ordersPerDay; ++i) {
    const order = generateOrder(currentDate, i)
    if (order.dateCreated.getTime() > currentDate.getTime()) break
    orders.push(order)
  }
  for (const order of orders) {
    const { trades: orderTrades, slices: orderSlices } = getOrderTrades(
      order,
      currentDate
    )
    trades.push(orderTrades)
    slices.push(orderSlices)
  }
  console.log(
    `=== ${orders.length} orders in ${
      new Date().getTime() - startTime.getTime()
    } ms as of ${currentDate.toISOString()}`
  )
  return { orders, trades, slices }
}

export const getOrderById = (
  date: Date,
  orderId: number
):
  | { order: OrderInfo; trades: OrderTrade[]; slices: OrderSlice[] }
  | undefined => {
  //console.log('getOrderById param:', date, orderId)
  if (!orderId || !date) return undefined
  const orderDate = getDateFromOrderId(orderId)
  const orderSchedule = getDetOrderSchedule(orderDate)
  const firstOrder = getDetOrderId(orderDate, 0)
  const orderIndex = orderId - firstOrder
  if (orderIndex < 0 || orderIndex >= orderSchedule.length) {
    return undefined
  }

  const order = generateOrder(orderDate, orderIndex)
  //console.log(`getOrderById: generated:`, order)
  if (order.dateCreated.getTime() > date.getTime()) {
    return undefined
  }
  const { trades, slices } = getOrderTrades(order, date)
  return { order, trades, slices }
}

export const addOrderSplit = (order: OrderInfo): OrderSplit[] => {
  const split: OrderSplit[] = []
  const prng = getDetOrderPrng(order.orderId + 7919)
  const nParts = prng.next32Range(1, 3)
  let qtyLeft = order.quantity

  for (let i = 0; i < nParts - 1 && qtyLeft > 0; i++) {
    const quantity = (order.quantity / nParts) >>> 0
    if (quantity <= 0 || quantity > qtyLeft) continue
    split.push({
      brokerIndex: prng.next32() % brokers.length,
      quantity: quantity,
    })
    qtyLeft -= quantity
  }

  if (qtyLeft > 0) {
    split.push({
      brokerIndex: prng.next32() % brokers.length,
      quantity: qtyLeft,
    })
  }

  order.split = split
  return split
}

export const generateOrder = (date: Date, index: number): OrderInfo => {
  const orderId = getDetOrderId(date, index)
  const prng = getDetOrderPrng(orderId)
  const orderSchedule = getDetOrderSchedule(date)

  const instrumentIndex = prng.next32()
  const clientIndex = prng.next32()
  const sideIndex = prng.next32()
  const quantityIndex = prng.next32Range(1, 50)

  const instrumentInfo = instruments[instrumentIndex % instruments.length]
  const clientInfo = clients[clientIndex % clients.length]

  const currency = instrumentInfo.currency
  const clientId = clientInfo.clientId
  const side = ['1', '2'][sideIndex % 2]
  const quantity = quantityIndex * 60 // multiple of 2, 3, 4, 5, 6
  const books = ['AGENCY', 'RISK']
  const bookId = books[index % 2]

  const dateCreated = getAdjustedDateReverse(orderSchedule[index])

  const order: OrderInfo = {
    orderId,
    clientId,
    instrument: {
      ticker: instrumentInfo.ticker,
      bbgExchange: instrumentInfo.bbgExchange,
    },
    currency,
    side,
    quantity,
    quantityFilled: 0,
    dateCreated,
    orderType: '1',
    timeInForce: '0',
    // limitPrice: 0,
    comments: '',
    averagePrice: 0,
    tradeStatus: 'open',
    brokerId: 'XX',
    bookId,
  }

  addOrderSplit(order)

  return order
}

const generateTrades = (
  order: OrderInfo,
  date: Date | undefined,
  sliceId: number,
  maxQuantity: number,
  brokerInfo: BrokerInfo,
  instrumentInfo: InstrumentInfo
) => {
  const result: OrderTrade[] = []
  const timeBase = order.dateCreated
  const endTime = date || getTradeCloseTime(timeBase)
  const accuMax = (endTime.getTime() - timeBase.getTime()) / 1000
  let qtyLeft = maxQuantity

  const prng = getDetOrderPrng(sliceId + 1013904223)
  let accumulatedSeconds = 0
  let secondsFrom = 15,
    secondsTo = 30
  const batchQtyFrom = 5,
    batchQtyTo = 20
  for (let i = 0; i < 20; ++i) {
    if (i < 10) {
      secondsFrom = 15
      secondsTo = 30
    } else {
      secondsFrom = 30
      secondsTo = 120
    }
    const nextInterval = prng.next32Range(secondsFrom, secondsTo)
    accumulatedSeconds += nextInterval
    if (accumulatedSeconds > accuMax) break

    const quantity = Math.min(
      qtyLeft,
      prng.next32Range(batchQtyFrom, batchQtyTo) * 60
    )
    const timestamp = DateAddSeconds(timeBase, accumulatedSeconds)

    const pricePrng = getDetPricePrng(timestamp)
    const priceRnd = pricePrng.next32Range(
      MIN_PRICE_PERCENT_DIFFERENCE,
      MAX_PRICE_PERCENT_DIFFERENCE
    )
    const price = instrumentInfo.price.close * (1 + priceRnd / 100)

    result.push({
      orderId: order.orderId,
      clientId: order.clientId,
      sliceId,
      side: order.side,
      instrument: order.instrument,
      currency: order.currency,
      timestamp,
      quantity,
      price,
      execBroker: brokerInfo.brokerId,
      exchange: brokerInfo.brokerExchange,
      comments: '',
      bookId: order.bookId,
    })

    qtyLeft -= quantity
    if (qtyLeft <= 0) break
  }
  return result
}

const mapToOrderSlice = (x: OrderInfo): OrderSlice => ({
  ...x,
  brokerExchange:
    brokers.find(({ brokerId }) => brokerId === x.brokerId)?.brokerExchange ??
    '',
})

export const getOrderTrades = (
  order: OrderInfo,
  date?: Date
): { trades: OrderTrade[]; slices: OrderSlice[] } => {
  const trades: OrderTrade[] = []
  const slices: OrderSlice[] = []

  const instrumentInfo =
    instruments.find((i) => order.instrument.ticker === i.ticker) ??
    instruments[0]

  const split = order.split || []
  split.forEach((splitItem, splitItemIndex) => {
    const brokerInfo = brokers[splitItem.brokerIndex]
    const sliceId = order.orderId * 100 + splitItemIndex + 1
    const sliceTrades = generateTrades(
      order,
      date,
      sliceId,
      splitItem.quantity,
      brokerInfo,
      instrumentInfo
    )
    trades.push(...sliceTrades)

    let { ...slice } = { ...order }

    slice.sliceId = sliceId
    slice.quantity = splitItem.quantity
    slice.brokerId = brokerInfo.brokerId
    let totalFilled = 0
    let totalValue = 0
    sliceTrades.forEach((trade) => {
      totalFilled += trade.quantity
      totalValue += trade.quantity * trade.price
    })
    slice.averagePrice = totalValue / totalFilled
    slice.quantityFilled = totalFilled
    augmentOrderStatus(slice)

    slices.push(mapToOrderSlice(slice))
  })

  let totalFilled = 0
  let totalValue = 0
  trades.forEach((trade) => {
    totalFilled += trade.quantity
    totalValue += trade.quantity * trade.price
  })

  order.averagePrice = totalValue / totalFilled
  order.quantityFilled = totalFilled
  augmentOrderStatus(order)

  return { trades, slices }
}

export const augmentOrderStatus = (order: OrderInfo): void => {
  if (order.quantityFilled === 0) {
    order.tradeStatus = 'New'
  } else if (order.quantityFilled < order.quantity) {
    order.tradeStatus = 'Partial'
  } else {
    order.tradeStatus = 'Done'
  }
}
