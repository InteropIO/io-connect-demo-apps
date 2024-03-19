import { useState, useEffect, useContext } from 'react'
import { GlueContext } from '@glue42/react-hooks'
import { OrderInfo, OrderTrade, TradePosition } from '../../../models/orders'
import { useIntents } from '../../../util/glue'
import { FDC3_TRADE } from '../../../constants'
import {
    METHODNAME_GET_ORDERS,
    METHODNAME_GET_ORDER,
    METHODNAME_GET_ORDER_ID,
    METHODNAME_GET_TRADING_POSITIONS,
} from '../../../constants/methods'
import { Fdc3Trade } from '../../../models/fdc3-trade'
import { getExchange, getTicker } from '../../../util/util'

export const useOrders = (
    date: Date,
    withTrades = false,
    withSlices = false
): { orders: OrderInfo[]; trades: OrderTrade[]; slices: OrderInfo[] } => {
    const [orders, setOrders] = useState({ orders: [], slices: [], trades: [] })
    const glue = useContext(GlueContext)

    useEffect(() => {
        const getOrders = async () => {
            const result = await glue?.interop.invoke(METHODNAME_GET_ORDERS, {
                date,
                withTrades,
                withSlices,
            })

            setOrders({
                orders: result?.returned.orders || [],
                trades: result?.returned.trades || [],
                slices: result?.returned.slices || [],
            })
        }

        getOrders()
    }, [glue, date, withTrades, withSlices])

    return orders
}

export const useOrder = (
    orderId: number,
    date: Date,
    withSlices = false,
    withTrades = false
) => {
    const [order, setOrder] = useState<{
        order?: OrderInfo
        trades?: OrderTrade[]
        slices?: OrderInfo[]
    }>()
    const glue = useContext(GlueContext)

    useEffect(() => {
        const getOrder = async () => {
            const result = await glue?.interop.invoke(METHODNAME_GET_ORDER, {
                orderId,
                date,
                withSlices,
            })

            const orderObject = {
                order: result?.returned.order,
                slices: result?.returned.slices,
            }

            setOrder(orderObject)
        }

        if (orderId) {
            getOrder()
        } else {
            setOrder({})
        }
    }, [glue, orderId, date, withSlices, withTrades])

    return order
}

export const useSlice = (
    sliceId: number,
    slices?: OrderInfo[]
): OrderInfo | undefined => {
    const [slice, setSlice] = useState<OrderInfo | undefined>()

    useEffect(() => {
        const resultSlice = slices?.find((s) => s.orderId === sliceId)
        setSlice(resultSlice)
    }, [slices, sliceId])

    return slice
}

export const useAddNewTradeIntentListener = (handler: (trade: any) => void) => {
    const intentsApi = useIntents()

    useEffect(() => {
        const intent = 'NewTrade'

        function contextHandler(contextData: any) {
            console.log('context', contextData)

            if (contextData == null || contextData.type !== FDC3_TRADE) {
                console.log(
                    `NewOrder intent context's "type" must be ${FDC3_TRADE}. Received `,
                    contextData?.type
                )
                return
            }

            handler && handler(contextData)
        }

        const listener = intentsApi?.addIntentListener(intent, contextHandler)

        return () => {
            if (listener) {
                listener.unsubscribe()
            }
        }
    }, [intentsApi, handler])
}

export const useConvertFdc3TradeToOmsTrade = (
    fTrade: Fdc3Trade | undefined
): OrderTrade | undefined => {
    const [trade, setTrade] = useState<OrderTrade | undefined>()
    const glue = useContext(GlueContext)

    useEffect(() => {
        const getTrade = async () => {
            const tradeOrderId = fTrade?.order?.id || ''
            let orderId = tradeOrderId

            const sliceId = fTrade?.sliceId || ''

            let side = ''
            let instrument

            if (sliceId) {
                const getOrderIdResult = await glue?.interop.invoke(
                    METHODNAME_GET_ORDER_ID,
                    { sliceId }
                )
                orderId = getOrderIdResult?.returned._value

                if (orderId === tradeOrderId && tradeOrderId !== '') {
                    side = fTrade?.order?.side || side
                    instrument = fTrade?.order?.instrument?.id
                    // if (!instrument && fTrade?.order?.instrument?.id?.ticker) {
                    //     instrument = fTrade?.order?.instrument?.id
                    // }
                }
            }

            const result = {
                orderId: +orderId,
                sliceId: +sliceId,
                quantity: fTrade?.quantity || ('' as any),
                price: fTrade?.price || ('' as any),
                timestamp: fTrade?.timestamp as any,
                execBroker: fTrade?.execBroker || ('' as any),
                exchange: fTrade?.exchange || ('' as any),
                comments: fTrade?.comments || ('' as any),
                side: side || '',
                instrument: {
                    ticker: getTicker(instrument),
                    bbgExchange: getExchange(instrument),
                },
                currency: 'GBX',
                ticker: getTicker(fTrade?.instrument?.id),
                bbgExchange: getExchange(fTrade?.instrument?.id),
            }

            setTrade(result)
        }

        getTrade()
    }, [glue, fTrade])

    return trade
}

export const useTradingPositions = (date: Date): TradePosition[] => {
    const [positions, setPositions] = useState<TradePosition[]>([])
    const glue = useContext(GlueContext)

    useEffect(() => {
        const getPositions = async () => {
            const result = await glue?.interop.invoke(
                METHODNAME_GET_TRADING_POSITIONS,
                { date }
            )

            const allTradePositions: TradePosition[] = []

            for (const book in result?.returned) {
                for (const instrument in result?.returned[book]) {
                    allTradePositions.push(result?.returned[book][instrument])
                }
            }

            setPositions(allTradePositions)
        }

        getPositions()
    }, [glue, date])

    return positions
}
