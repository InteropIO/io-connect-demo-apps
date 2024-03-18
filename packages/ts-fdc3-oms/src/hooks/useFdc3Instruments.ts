import { GlueContext } from '@glue42/react-hooks'
import { useContext, useEffect, useState } from 'react'
import { METHODNAME_GET_FDC3_INSTRUMENTS } from '../constants/methods'
import { Fdc3InstrumentList } from '../models/fdc3-instrument'

export const useFdc3Instruments = (): Fdc3InstrumentList | undefined => {
    const glue = useContext(GlueContext)
    const [instruments, setInstruments] = useState<Fdc3InstrumentList>()

    useEffect(() => {
        glue.interop
            .invoke(METHODNAME_GET_FDC3_INSTRUMENTS)
            .then((result) => setInstruments(result.returned.instruments))
            .catch((error) => {
                console.error(
                    `Failed invoking ${METHODNAME_GET_FDC3_INSTRUMENTS}. Error: `,
                    error
                )
            })
    }, [glue])

    return instruments
}
