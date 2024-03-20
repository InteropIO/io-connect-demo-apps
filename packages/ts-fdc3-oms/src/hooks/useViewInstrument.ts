import { useCallback } from 'react'
import { getFdc3Instrument } from '../util/util'
import { InstrumentIdInternal } from '../models/orders'
import { ViewInstrumentIntent } from '../constants'

export default function useViewInstrument() {
    return useCallback(
        (instrument: string | InstrumentIdInternal) => {
            const fdc3Instrument = getFdc3Instrument(instrument)

            if ((window as any).fdc3) {
                (window as any).fdc3.raiseIntent(
                    ViewInstrumentIntent,
                    {
                        type: fdc3Instrument?.type,
                        data: fdc3Instrument,
                    },
                )
            }
        },
        []
    )
}
