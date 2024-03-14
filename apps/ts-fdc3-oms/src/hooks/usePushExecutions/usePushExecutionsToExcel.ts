import { GlueContext } from '@glue42/react-hooks'
import { useCallback, useContext } from 'react'
import { OrderTrade } from '../../models/orders'
import { DateStartOfDay } from '../../util/datetime'
import { convertOrderTradeToFdc3Trade } from '../../util/util'
import { getTradesWithinDay, PushExecutions } from './common'

export default function usePushExecutionsToExcel(): PushExecutions {
    const glue = useContext(GlueContext)

    const action = async (orderId: string, dateCreated: Date | undefined) => {
        const { trades } = await getTradesWithinDay(glue, orderId, dateCreated)

        const date = dateCreated || new Date()

        const fdc3Trades = trades.map((trade: OrderTrade) =>
            convertOrderTradeToFdc3Trade(trade)
        )

        await glue.interop
            .invoke('T42.ShareTradeHistoryExcel', {
                trades: fdc3Trades,
                startDate: DateStartOfDay(date),
                endDate: date,
            })
            .catch(console.error)
    }

    return useCallback(action, [glue])
}
