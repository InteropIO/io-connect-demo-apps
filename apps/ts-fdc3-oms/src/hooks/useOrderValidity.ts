import { GlueContext } from '@glue42/react-hooks'
import { useContext, useEffect, useState } from 'react'
import { METHODNAME_GET_ORDER_VALIDITY } from '../constants/methods'

export const useOrderValidity = (): any => {
    const glue = useContext(GlueContext)
    const [orderValidity, setOrderValidity] = useState()

    useEffect(() => {
        glue.interop
            .invoke(METHODNAME_GET_ORDER_VALIDITY)
            .then((result) => setOrderValidity(result.returned.orderValidity))
            .catch((error) => {
                console.error(
                    `Failed invoking ${METHODNAME_GET_ORDER_VALIDITY}. Error: `,
                    error
                )
            })
    }, [glue])

    return orderValidity
}
