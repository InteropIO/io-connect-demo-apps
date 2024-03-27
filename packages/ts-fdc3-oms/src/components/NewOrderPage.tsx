import { useCallback, useState } from 'react'
import { useAddNewOrderIntentListener, useCloseMyWindow } from '../util/glue'
import { Fdc3Order } from '../models/fdc3-order'
import NewOrderForm from './NewOrderForm'

export default function NewOrderPage(): JSX.Element {
    console.log('NewOrderPage()')

    const [intentOrder, setIntentOrder] = useState<Fdc3Order>()

    const onComplete = useCloseMyWindow()

    const handleNewOrderRequest = useCallback(
        ({ order }: { order: Fdc3Order }) => {
            console.log('NewOrderIntent invoked')
            console.log(order)
            setIntentOrder(order)
        },
        []
    )
    useAddNewOrderIntentListener(handleNewOrderRequest)

    return <NewOrderForm intentOrder={intentOrder} onComplete={onComplete} />
}
