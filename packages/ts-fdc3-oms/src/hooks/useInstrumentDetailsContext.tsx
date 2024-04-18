import '@interopio/fdc3'
import { GlueContext } from '@glue42/react-hooks'
import { Glue42Workspaces } from '@glue42/workspaces-api'
import { useCallback, useContext, useEffect, useState } from 'react'
import { SPLIT_INSTRUMENT_RIC_REGEX } from '../constants'
import { Fdc3Instrument, Fdc3InstrumentId } from '../models/fdc3-instrument'
import { formatInstrumentForBbg, formatInstrument } from '../util/util'

const INSTRUMENT_DETAILS = 'instrumentDetails'

interface InstrumentDetailsContext {
    id?: Fdc3InstrumentId
}

interface UseInstrumentDetailsContext {
    instrumentContext: Fdc3Instrument
    publish: (ctx: Fdc3InstrumentId) => Promise<void>
}

const useInstrumentDetailsContext = (): UseInstrumentDetailsContext => {
    const glue = useContext(GlueContext)

    const [fdc3Instrument, setFdc3Instrument] = useState<Fdc3Instrument>({
        type: 'fdc3.instrument',
    })

    const [myWorkspace, setMyWorkspace] = useState<
        Glue42Workspaces.Workspace | undefined
    >()

    const isOnFDC3CChannel = useCallback(
        () => window.fdc3 && glue.channels.my() != null,
        [window.fdc3, glue]
    )

    const isOnChannel = useCallback(() => glue.channels.my() != null, [glue])

    const isInWorkspace = useCallback(
        () =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise(async (resolve) => {
                try {
                    const inWsp = await glue.workspaces?.inWorkspace()
                    resolve(inWsp)
                } catch {
                    resolve(false)
                }
            }),
        [glue]
    )

    const setSymbolFromSource = useCallback(async () => {
        const setCtxSymbol = (ctx: InstrumentDetailsContext) => {
            const RIC = ctx.id?.RIC?.split(SPLIT_INSTRUMENT_RIC_REGEX)
            if (RIC && RIC.length > 1) {
                setFdc3Instrument({
                    type: 'fdc3.instrument',
                    id: {
                        ticker: RIC[0],
                        RIC: formatInstrument(RIC[0], RIC[1]),
                    },
                })
            }
        }

        // FDC3's context has top precedence.
        const onFDC3Channel = isOnFDC3CChannel()

        // Channel's context has second precedence.
        const onChannel = isOnChannel()

        // Workspace context has less precedence than channels.
        const inWsp = await isInWorkspace()
        const myWsp = await glue.workspaces?.getMyWorkspace().catch(() => null)

        if (onFDC3Channel) {
            console.log(
                '[useInstrumentDetailsContext] getting instrument details from FDC3 channel ctx...'
            )

            return await window.fdc3
                .addContextListener('fdc3.instrument', (contextData) => {
                    if (
                        contextData == null ||
                        contextData.type !== 'fdc3.instrument'
                    ) {
                        console.log(
                            `Symbol context's "type" must be 'fdc3.instrument'. Received `,
                            contextData?.type
                        )
                        return
                    }

                    setCtxSymbol(contextData)
                })
                .catch(console.error)
        }

        if (onChannel) {
            console.log(
                '[useInstrumentDetailsContext] getting instrument details from channel ctx...'
            )

            const myChannel = glue.channels.my()
            return glue.channels
                .get(myChannel)
                .then(({ data }) => setCtxSymbol(data))
                .catch(console.error)
        }

        if (inWsp && myWsp != null) {
            console.log(
                '[useInstrumentDetailsContext] getting instrument details from workspace ctx...'
            )

            return myWsp.getContext().then(setCtxSymbol).catch(console.error)
        }

        // Global context has least precedence.
        console.log(
            '[useInstrumentDetailsContext] getting instrument details global ctx...'
        )
        glue.contexts
            .get(INSTRUMENT_DETAILS)
            .then(setCtxSymbol)
            .catch(console.error)
    }, [setFdc3Instrument, isInWorkspace, isOnFDC3CChannel, isOnChannel, glue])

    useEffect(() => {
        async function subscribeToFdc3Updates() {
            const listener = await setSymbolFromSource()

            return () => {
                if (listener) listener.unsubscribe()
            }
        }

        subscribeToFdc3Updates()
    }, [setSymbolFromSource])

    useEffect(() => {
        async function subscribeToContextsUpdates() {
            const subscriptionPromise = glue.contexts.subscribe(
                INSTRUMENT_DETAILS,
                () => {
                    setSymbolFromSource()
                }
            )

            const unsubscribeChannels = glue.channels.subscribe(() => {
                setSymbolFromSource()
            })

            return () => {
                subscriptionPromise.then(
                    (unsubscribe) => unsubscribe(),
                    console.error
                )

                unsubscribeChannels()
            }
        }

        subscribeToContextsUpdates()
    }, [setSymbolFromSource, glue])

    useEffect(
        function subscribeToWorkspaceContextUpdates() {
            const subscriptionPromise = myWorkspace?.onContextUpdated(() => {
                setSymbolFromSource()
            })

            return () => {
                subscriptionPromise?.then(
                    (unsubscribe) => unsubscribe(),
                    console.error
                )
            }
        },
        [myWorkspace, setSymbolFromSource]
    )

    useEffect(
        function subscribeOnContextSourceChange() {
            glue.channels.onChanged(() => {
                setSymbolFromSource()
            })

            glue.workspaces?.getMyWorkspace().then((wsp) => {
                if (wsp !== null) {
                    setMyWorkspace(wsp)
                    setSymbolFromSource()
                }
            })
            glue.workspaces?.onWindowAdded(async () => {
                const myWorkspace = await glue.workspaces
                    ?.getMyWorkspace()
                    .catch(() => null)

                if (myWorkspace != null) {
                    setMyWorkspace(myWorkspace)
                    setSymbolFromSource()
                }
            })

            glue.workspaces?.onWindowRemoved(() => {
                setSymbolFromSource()
            })
        },
        [setSymbolFromSource, glue]
    )

    const publish = useCallback(
        async ({ ticker, RIC, BBG, BBG_EXCHANGE }: Fdc3InstrumentId) => {
            // TODO: Guard looping.
            const ric =
                RIC ||
                (ticker && BBG_EXCHANGE
                    ? formatInstrument(ticker, BBG_EXCHANGE)
                    : null)

            const bbg = BBG || formatInstrumentForBbg(ticker, BBG_EXCHANGE)

            const data = {
                type: 'fdc3.instrument',
                id: {
                    ticker,
                    RIC: ric,
                    BBG: bbg,
                },
            }

            const onFDC3Channel = isOnFDC3CChannel()
            const onChannel = isOnChannel()
            const inWsp = await isInWorkspace()

            if (onFDC3Channel) {
                window.fdc3.broadcast(data)
            }

            if (onChannel) {
                glue.channels.publish(data)
            }

            if (inWsp) {
                return glue.workspaces
                    ?.getMyWorkspace()
                    .then((wsp) => wsp.updateContext(data))
                    .catch(console.error)
            }

            return glue.contexts.update(INSTRUMENT_DETAILS, data)
        },
        [isOnChannel, isInWorkspace, glue]
    )

    return {
        instrumentContext: fdc3Instrument,
        publish,
    }
}

export default useInstrumentDetailsContext
