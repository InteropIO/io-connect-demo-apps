import { GlueContext } from '@glue42/react-hooks'
import { useContext, useEffect, useState } from 'react'
import { METHODNAME_GET_INSTRUMENTS } from '../constants/methods'
import { InstrumentInfo } from '../models/instruments'

export const useInstruments = (): InstrumentInfo[] | undefined => {
    const glue = useContext(GlueContext)
    const [instruments, setInstruments] = useState<InstrumentInfo[]>()

    useEffect(() => {
        glue.interop
            .invoke(METHODNAME_GET_INSTRUMENTS)
            .then((result) => setInstruments(result.returned?.instruments))
            .catch((error) => {
                console.error(
                    `Failed invoking ${METHODNAME_GET_INSTRUMENTS}. Error: `,
                    error
                )
            })
    }, [glue])

    return instruments
}
