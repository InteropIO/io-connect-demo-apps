import { GlueContext } from '@glue42/react-hooks'
import { useContext, useEffect, useState } from 'react'
import { METHODNAME_GET_BID_DATA } from '../../../constants/methods'
import { BidData } from '../BidTable'

const useGenerateBids = (
    ticker?: string,
    lastPrice?: number
): BidData[] | undefined => {
    const [bids, setBids] = useState()

    const glue = useContext(GlueContext)

    useEffect(() => {
        const generate = async () => {
            const result = await glue.interop.invoke(METHODNAME_GET_BID_DATA, {
                ticker,
                lastPrice,
            })

            setBids(result?.returned.bidData)
        }

        generate()
    }, [glue, ticker, lastPrice])

    return bids
}

export default useGenerateBids
