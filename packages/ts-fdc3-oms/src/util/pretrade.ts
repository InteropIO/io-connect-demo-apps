import { METHODNAME_PRETRADE_ABELNOSER, METHODNAME_PRETRADE_BMLL, METHODNAME_PRETRADE_VIRTU } from '../constants/methods'
import { OrderInfo } from '../models/orders'
import { GlueT } from './glue'
import { formatInstrumentFromId } from './util'

export const triggerPreTradeOrders = (
    glue: GlueT | undefined,
    orders: OrderInfo[]
): void => {
    console.log('orders', orders)

    const firstOrder = orders[0]

    // BMLL
    {
        glue?.interop
            .invoke(METHODNAME_PRETRADE_BMLL, {
                ticker: formatInstrumentFromId(firstOrder.instrument),
                instruments: orders.map(order =>
                    formatInstrumentFromId(order.instrument)
                )
            }, 'all')
            .then((/*result*/) => {
                console.log('BMLL sync successful')
            })
            .catch((e) => {
                console.log('BMLL sync failed', e)
            })
    }

    // Abel Noser
    {
        const anSide =
            firstOrder.side === '2' || firstOrder.side === '5' ? 'S' : 'B'
        glue?.interop
            .invoke(METHODNAME_PRETRADE_ABELNOSER, {
                fid: firstOrder.instrument?.ticker,
                currency: firstOrder.currency,
                orderId: firstOrder.orderId,
                side: anSide,
                quantity: firstOrder.quantity,
            })
            .then((/*result*/) => {
                console.log('Abel Noser sync successful')
            })
            .catch((e) => {
                console.log('Abel Noser sync failed', e)
            })
    }

    // Virtu
    {
        const filters = []
        for (const order of orders) {
            const side =
                order.side === '2' || order.side === '5' ? 'sell' : 'buy'

            filters.push({
                side,
                quantity: order.quantity,
                symbol: formatInstrumentFromId(order.instrument),
                symbolType: 'bloombergMarketSymbol',
                itgMarketLevelId: '1000000000999999',
            })
        }

        glue?.interop
            .invoke(METHODNAME_PRETRADE_VIRTU, { filters })
            .then((/*result*/) => {
                console.log('Virtu sync successful')
            })
            .catch((e) => {
                console.log('Virtu sync failed', e)
            })
    }
}
