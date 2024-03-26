import { GlueApiT } from '../util/glueTypes'

import condMan from '../util/Conditions'
import { useCallback } from 'react'
import { getFdc3Instrument } from '../util/util'
import { OMS_GLOBAL_DATA_CONTEXT_NAME } from '../constants/settings'
import { InstrumentIdInternal } from '../models/orders'

type InstrumentToPublish = InstrumentIdInternal | string

const gPublishInstrument = async (
    glue: GlueApiT,
    instrument: InstrumentToPublish
) => {
    const fdc3Instrument = getFdc3Instrument(instrument)
    if (!fdc3Instrument) return

    if (window.fdc3) {
        return await window.fdc3.broadcast(fdc3Instrument).catch(console.error)
    }

    if (await condMan.evaluateCondition('sync.instrument.out.channel')) {
        return glue.channels?.publish(fdc3Instrument).catch(console.error)
    }

    if (await condMan.evaluateCondition('sync.instrument.out.wscontext')) {
        return glue.workspaces
            ?.getMyWorkspace()
            .then((wsp) => wsp.updateContext(fdc3Instrument))
            .catch(console.error)
    }

    if (await condMan.evaluateCondition('sync.instrument.out.globalcontext')) {
        return glue.contexts
            ?.update(OMS_GLOBAL_DATA_CONTEXT_NAME, fdc3Instrument)
            .catch(console.error)
    }
}

const useEntityPublisher = (glue: GlueApiT | undefined) => {
    const publishInstrument = useCallback(
        (instrument: InstrumentToPublish) => {
            if (!glue) return
            gPublishInstrument(glue, instrument)
        },
        [glue]
    )
    return { publishInstrument }
}

export default useEntityPublisher
