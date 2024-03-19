import { GlueContext } from '@glue42/react-hooks'
import { useCallback, useContext } from 'react'
import { useClients } from '../useClients'
import { getTradesWithinDay, PushExecutions } from './common'
import { convertOrderTradeToFdc3Trade } from '../../util/util'
import { OrderTrade } from '../../models/orders'
import { DateStartOfDay } from '../../util/datetime'

export default function usePushExecutionsToChat(): PushExecutions {
    const glue = useContext(GlueContext)
    const clients = useClients()

    const action = async (orderId: string, dateCreated: Date | undefined) => {
        const { order, trades } = await getTradesWithinDay(
            glue,
            orderId,
            dateCreated
        )
        const recipientEmail = clients?.find(
            ({ clientId }) => order.clientId === clientId
        )?.email

        const date = dateCreated || new Date()

        const fdc3Trades = trades.map((trade: OrderTrade) =>
            convertOrderTradeToFdc3Trade(trade)
        )

        await glue.interop
            .invoke('T42.ShareTradeHistoryChat', {
                trades: fdc3Trades,
                startDate: DateStartOfDay(date),
                endDate: date,
                contactList: {
                    type: 'fdc3.contactList',
                    contacts: [
                        {
                            type: 'fdc3.contact',
                            id: {
                                email: recipientEmail,
                            },
                        },
                    ],
                },
            })
            .catch(console.error)
    }

    return useCallback(action, [glue, clients])
}
