import { useCallback } from 'react'
import { raiseIntent } from '@finos/fdc3'
import { getFdc3Instrument } from '../util/util'
import { InstrumentIdInternal } from '../models/orders'
import { ViewInstrumentIntent } from '../constants'

export default function useViewInstrument() {
    return useCallback(async (instrument: string | InstrumentIdInternal) => {
        const fdc3Instrument = getFdc3Instrument(instrument)

        if (window.fdc3 && fdc3Instrument) {
            raiseIntent(ViewInstrumentIntent, {
                type: fdc3Instrument?.type || '',
                data: fdc3Instrument,
            }).catch(console.log)
        }
    }, [])
}
