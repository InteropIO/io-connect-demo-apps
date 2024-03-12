import React, { useContext, useEffect, useRef } from 'react'
import { GlueContext } from '@glue42/react-hooks'
import useGlueContext from '../../hooks/useGlueContext'
import useGlueWindowChannels from '../../hooks/useGlueWindowChannels'
import useGlueWorkspaceContext from '../../hooks/useGlueWorkspaceContext'
import condMan from '../../util/Conditions'
import { instrumentExtractor } from '../../util/entityExtractors'

import { OMS_GLOBAL_DATA_CONTEXT_NAME } from '../../constants/settings'

type AnyFunction = (...args: any[]) => any

type EntityValues = {
    value?: any
    glob?: any
    chan?: any
    ws?: any
}

const updateEntity = async (
    setter: AnyFunction,
    refValues: EntityValues,
    triggers: EntityValues,
    conditions: EntityValues
) => {
    const initialValue = refValues.value
    let candidateValue = initialValue

    const bUpdateFromChan =
        (triggers.value || triggers.chan) && refValues.chan !== undefined
    const bUpdateFromGlob =
        (triggers.value || triggers.glob) && refValues.glob !== undefined
    const bUpdateFromWs =
        (triggers.value || triggers.ws) && refValues.ws !== undefined

    if (bUpdateFromChan && (await conditions.chan())) {
        candidateValue = refValues.chan
    }
    if (bUpdateFromGlob && (await conditions.glob())) {
        candidateValue = refValues.glob
    }
    if (bUpdateFromWs && (await conditions.ws())) {
        candidateValue = refValues.ws
    }
    if (candidateValue !== initialValue) {
        refValues.value = candidateValue
        setter?.(candidateValue)
    }
}

const instrumentConditions: EntityValues = {
    chan: () => condMan.evaluateCondition('sync.instrument.in.channel'),
    ws: () => condMan.evaluateCondition('sync.instrument.in.wsContext'),
    glob: () => condMan.evaluateCondition('sync.instrument.in.globalContext'),
}

type ContextUpdateHandlerProps = {
    instrumentSetter?: AnyFunction
}

const ContextUpdateHandler = (props: ContextUpdateHandlerProps) => {
    const { instrumentSetter } = props
    const glue = useContext(GlueContext)

    useEffect(() => {
        console.log(`ContextHandler loaded`)
        return () => {
            console.log(`ContextHandler reloading...`)
        }
    }, [])

    const refInstruments = useRef<EntityValues>({ value: '' })

    const [chanData, chanContextData] = useGlueWindowChannels(glue)
    const [globContextData] = useGlueContext(glue, OMS_GLOBAL_DATA_CONTEXT_NAME)
    const [wsContextData, wsWorkspaceId] = useGlueWorkspaceContext(glue)

    useEffect(() => {
        if (instrumentSetter) {
            refInstruments.current.chan = instrumentExtractor(chanData)
            // special case when chanContextData is undefined: this means a channel was deselected
            const triggers = chanContextData ? { chan: true } : { value: true }
            updateEntity(
                instrumentSetter,
                refInstruments.current,
                triggers,
                instrumentConditions
            )
        }
    }, [chanData, chanContextData, instrumentSetter])

    useEffect(() => {
        if (instrumentSetter) {
            refInstruments.current.glob = instrumentExtractor(globContextData)
            const triggers = { glob: true }
            updateEntity(
                instrumentSetter,
                refInstruments.current,
                triggers,
                instrumentConditions
            )
        }
    }, [globContextData, instrumentSetter])

    useEffect(() => {
        if (instrumentSetter) {
            refInstruments.current.ws = instrumentExtractor(wsContextData)
            const triggers = { ws: true }
            updateEntity(
                instrumentSetter,
                refInstruments.current,
                triggers,
                instrumentConditions
            )
        }
    }, [wsContextData, wsWorkspaceId, instrumentSetter])

    return <div style={{ display: 'none' }}></div>
}

export default React.memo(ContextUpdateHandler)
