import { GlueContext } from '@glue42/react-hooks'
import { useContext, useEffect, useState } from 'react'
import { METHODNAME_GET_ORDER_TYPES } from '../constants/methods'

export const useOrderTypes = (): any => {
    const glue = useContext(GlueContext)
    const [orderTypes, setOrderTypes] = useState()

    useEffect(() => {
        glue.interop
            .invoke(METHODNAME_GET_ORDER_TYPES)
            .then((result) => setOrderTypes(result.returned.orderTypes))
            .catch((error) => {
                console.error(
                    `Failed invoking ${METHODNAME_GET_ORDER_TYPES}. Error: `,
                    error
                )
            })
    }, [glue])

    return orderTypes
}
