import { GlueContext } from '@glue42/react-hooks'
import { useCallback, useContext } from 'react'
import { METHODNAME_MORNINGSTAR_SYNC } from '../constants/methods'

export const useMorningStarSync = (): {
    syncInstrument: (ticker: string) => void
    syncFund: (isin: string) => void
} => {
    const glue = useContext(GlueContext)

    const syncInstrument = useCallback(
        (ticker: string) => {
            glue?.interop.invoke(METHODNAME_MORNINGSTAR_SYNC, { ticker })
        },
        [glue]
    )

    const syncFund = useCallback(
        (isin: string) => {
            glue?.interop.invoke(METHODNAME_MORNINGSTAR_SYNC, { isin })
        },
        [glue]
    )

    return {
        syncInstrument,
        syncFund,
    }
}
