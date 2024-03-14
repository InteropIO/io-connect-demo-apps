import { useContext, useEffect, useState } from 'react'
import { GlueContext } from '@glue42/react-hooks'
import { METHODNAME_GET_FUNDS } from '../constants/methods'
import { FundInfo } from '../models/portfolio'

export const useFunds = (): FundInfo[] => {
    const glue = useContext(GlueContext)
    const [funds, setFunds] = useState<FundInfo[]>([])

    useEffect(() => {
        glue.interop
            .invoke(METHODNAME_GET_FUNDS)
            .then((result) => setFunds(result.returned.funds ?? []))
            .catch((error) => {
                console.error(
                    `Failed invoking ${METHODNAME_GET_FUNDS}. Error: `,
                    error
                )
            })
    }, [glue])

    return funds
}
