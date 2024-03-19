import { GlueContext } from '@glue42/react-hooks'
import { useCallback, useContext } from 'react'
import {
    METHODNAME_GET_ORDER,
    METHODNAME_GET_ORDERS,
} from '../constants/methods'
import { OrderInfo, OrderSlice } from '../models/orders'
import { DateAddDays } from '../util/datetime'
import { GlueT } from '../util/glue'

interface GetOrdersArgs {
    date: Date
    withSlices?: boolean
    withTrades?: boolean
}

interface GetOrdersResult {
    orders: OrderInfo[]
    slices?: OrderSlice[]
    trades?: OrderInfo[]
}

const invokeGetOrders = async (
    glue: GlueT,
    args: GetOrdersArgs
): Promise<GetOrdersResult> => {
    return glue.interop
        .invoke(METHODNAME_GET_ORDERS, args)
        .then((result) => result.returned)
        .catch((error) => {
            console.error(
                `Failed invoking ${METHODNAME_GET_ORDERS}. Error: `,
                error
            )
            return {
                orders: [],
            }
        })
}

interface GetOrderByIdArgs extends GetOrdersArgs {
    orderId: number
}

type GetOrderByIdResult = Omit<GetOrdersResult, 'orders'> & {
    order: OrderInfo
}

const invokeGetOrderById = async (
    glue: GlueT,
    args: GetOrderByIdArgs
): Promise<GetOrderByIdResult> => {
    return glue.interop
        .invoke(METHODNAME_GET_ORDER, args)
        .then((result) => result.returned)
        .catch((error) => {
            console.error(
                `Failed invoking ${METHODNAME_GET_ORDER}. Error: `,
                error
            )
        })
}

export default function useOrders(): {
    getOrders: CallableFunction
    getOrdersHistory: CallableFunction
    getOrderSlices: CallableFunction
} {
    const glue = useContext(GlueContext)

    const getOrders = useCallback(
        async (asOfDate: Date = new Date()) => {
            const { orders } = await invokeGetOrders(glue, {
                date: asOfDate,
                withSlices: false,
                withTrades: false,
            })
            return orders ?? []
        },
        [glue]
    )

    const getOrdersHistory = useCallback(
        async (range: { from: Date; to: Date }) => {
            const toDateBasis = new Date(range.to)
            toDateBasis.setHours(23, 59, 59, 999)
            const accOrders = []
            let currentDay = new Date(toDateBasis)
            let counter = 0
            while (
                currentDay.getTime() > range.from.getTime() &&
                counter < 60
            ) {
                counter++
                const orders = await getOrders(currentDay)
                currentDay = DateAddDays(currentDay, -1)
                accOrders.push(...orders)
            }

            return accOrders
        },
        [getOrders]
    )

    const getOrderSlices = useCallback(
        async (orderId: number, date: Date) => {
            const result = await invokeGetOrderById(glue, {
                orderId,
                date,
                withSlices: true,
                withTrades: false,
            })
            const slices = result?.slices ?? []

            return slices
        },
        [glue]
    )

    return {
        getOrders,
        getOrdersHistory,
        getOrderSlices,
    }
}
