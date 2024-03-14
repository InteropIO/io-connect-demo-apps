import { GlueContext } from '@glue42/react-hooks'
import { useContext, useEffect, useState } from 'react'
import { METHODNAME_GET_BROKERS } from '../constants/methods'
import { BrokerInfo } from '../models/brokers'

export const useBrokers = (): BrokerInfo[] => {
    const glue = useContext(GlueContext)
    const [brokers, setBrokers] = useState<BrokerInfo[]>([])

    useEffect(() => {
        glue.interop
            .invoke(METHODNAME_GET_BROKERS)
            .then((result) => {
                console.log(result)
                setBrokers(result.returned.brokers)
            })
            .catch((error) => {
                console.error(
                    `Failed invoking ${METHODNAME_GET_BROKERS}. Error: `,
                    error
                )
            })
    }, [glue])

    return brokers
}
