import { GlueContext } from '@glue42/react-hooks'
import { useCallback, useContext } from 'react'
import { getFdc3Instrument } from '../util/util'
import { InstrumentIdInternal } from '../models/orders'
import { ViewInstrumentIntent } from '../constants'

export default function useViewInstrument() {
    const glue = useContext(GlueContext)

    return useCallback(
        (instrument: string | InstrumentIdInternal) => {
            const fdc3Instrument = getFdc3Instrument(instrument)
            if (fdc3Instrument) {
                glue?.intents.raise({
                    intent: ViewInstrumentIntent,
                    context: {
                        type: fdc3Instrument.type,
                        data: fdc3Instrument,
                    },
                })
            }
        },
        [glue]
    )
}
