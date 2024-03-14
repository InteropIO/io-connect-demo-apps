import { GlueContext } from '@glue42/react-hooks'
import { useContext, useEffect, useState } from 'react'
import { METHODNAME_GET_ORDER_SIDES } from '../constants/methods'

export const useOrderSides = (): any[] | undefined => {
    const glue = useContext(GlueContext)
    const [orders, setOrders] = useState()

    useEffect(() => {
        glue.interop
            .invoke(METHODNAME_GET_ORDER_SIDES)
            .then((result) => setOrders(result.returned.orderSides))
            .catch((error) => {
                console.error(
                    `Failed invoking ${METHODNAME_GET_ORDER_SIDES}. Error: `,
                    error
                )
            })
    }, [glue])

    return orders
}
