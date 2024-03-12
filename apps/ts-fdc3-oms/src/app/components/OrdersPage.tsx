import { useCallback, useState } from 'react'
import { OrderFilterEx } from '../models/orders'
import { DateAddDays } from '../util/datetime'
import ActiveOrdersGrid from './ActiveOrdersGrid'
import NewOrderForm from './NewOrderForm'
import NewOrderModal from './NewOrderModal'

export interface OrdersPageProps {
    historyFilter?: OrderFilterEx
}

const defaultHistoryFilter = {
    fromDate: DateAddDays(new Date(), -31),
    toDate: DateAddDays(new Date(), -1),
}

export default function OrdersPage(props: OrdersPageProps): JSX.Element {
    const [newOrderView, setNewOrderView] = useState<boolean>(false)
    const historyFilter = props.historyFilter || defaultHistoryFilter

    const handleNewOrderComplete = useCallback(() => {
        setNewOrderView(false)
    }, [])

    const newOrderForm = (
        <NewOrderForm onComplete={() => handleNewOrderComplete()} />
    )

    return (
        <div className="orders-page d-flex flex-column flex-grow-1">
            {newOrderView ? (
                <NewOrderModal form={newOrderForm} modalHeader="Order Entry" />
            ) : null}
            <ActiveOrdersGrid
                setNewOrderView={setNewOrderView}
                historyFilter={historyFilter}
            />
        </div>
    )
}
