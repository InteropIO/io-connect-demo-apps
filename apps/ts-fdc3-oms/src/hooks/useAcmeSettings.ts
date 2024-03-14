import { useCallback } from 'react'
import { ACME_SETTINGS_CONTEXT_NAME } from '../constants/settings'
import { AcmeSettingsContext } from '../models/acmeSettings'
import { GlueApiT } from '../util/glueTypes'
import useGlueContext from './useGlueContext'

const useAcmeSettings = (glue: GlueApiT | undefined): AcmeSettingsContext => {
    const [acmeSettings]: [AcmeSettingsContext] = useGlueContext(
        glue,
        ACME_SETTINGS_CONTEXT_NAME
    )
    const setProperty = useCallback(
        async (propertyPath: string, propertyValue: any) => {
            glue?.contexts.setPath(
                ACME_SETTINGS_CONTEXT_NAME,
                propertyPath,
                propertyValue
            )
        },
        [glue]
    )
    return { ...acmeSettings, setProperty }
}

export { useAcmeSettings }
