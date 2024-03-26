import { useCallback, useState } from 'react'
import { OrderFilterEx } from '../models/orders'
import { DateAddDays, DateFromStringOrDate } from '../util/datetime'
import { useAddIntentListener } from '../util/glue'
import { getInstrumentIdFromString } from '../util/util'
import OrdersPage from './OrdersPage'

export default function OrderHistoryPage(): JSX.Element {
    const [historyFilter, setHistoryFilter] = useState<OrderFilterEx>({
        fromDate: DateAddDays(new Date(), -31),
        toDate: DateAddDays(new Date(), -1),
    })

    const handleViewHistoryIntent = useCallback((context: OrderFilterEx) => {
        console.log('ViewOrderHistory intent received', context)

        let securityId
        if (typeof(context.securityId) === 'string') {
            securityId = getInstrumentIdFromString(context.securityId)
        } else if (context.id) {
            securityId = getInstrumentIdFromString(context.id?.RIC)
        } else {
            securityId = context.securityId || { ticker: '', bbgExchange: '' }
        }

        const clientId = context.clientId || ''

        const fromDate =
            DateFromStringOrDate(context?.fromDate) ||
            DateAddDays(new Date(), -31)

        const toDate =
            DateFromStringOrDate(context?.toDate) || DateAddDays(new Date(), -1)

        const switchView =
            context?.switchView != null ? context.switchView : true

        const historyFilter: OrderFilterEx = {
            fromDate,
            toDate,
            clientId,
            securityId,
            switchView,
        }
        setHistoryFilter(historyFilter)
    }, [])

    useAddIntentListener('ViewOrderHistory', handleViewHistoryIntent)

    return <OrdersPage historyFilter={historyFilter} />
}
