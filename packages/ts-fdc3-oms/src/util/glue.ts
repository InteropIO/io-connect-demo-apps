import { useState, useEffect, useContext } from 'react'
import {
    AppIdentifier,
    Context,
    IntentHandler,
    Listener,
} from '@interopio/fdc3'
import { useGlue } from '@glue42/react-hooks'
import { callSafe, formatInstrument, setTheme } from './util'
import {
    FDC3_INSTRUMENT,
    FDC3_ORDER,
    SPLIT_INSTRUMENT_RIC_REGEX,
} from './../constants'
import { Fdc3Instrument } from '../models/fdc3-instrument'
import { Glue42 } from '@glue42/desktop'
import { Glue42Web } from '@glue42/web'
import { GlueContext } from '@glue42/react-hooks'
import { Glue42Core } from '@glue42/core'
import { Fdc3Order } from '../models/fdc3-order'
import { RowNode } from 'ag-grid-community'

export type GlueT = Glue42.Glue | Glue42Web.API
export type GlueChannelContextT =
    | Glue42Web.Channels.ChannelContext
    | Glue42.Channels.ChannelContext

export type Glue42MethodDefinitionT =
    | Glue42.Interop.MethodDefinition
    | Glue42Web.Interop.MethodDefinition

export interface customGDObject extends Glue42Core.GDObject {
    theme: string
}
declare global {
    interface Window {
        glue: unknown
        glueIsConnecting: boolean
    }
}

export const isGlue42Enterprise = typeof window.glue42gd !== 'undefined'

export const useGlueTheme = (): string => {
    const [theme, setTheme] = useState(
        (window.glue42gd as customGDObject)?.theme ?? 'dark'
    )

    useGlue((glue) => {
        const unsubscribePromise = glue.contexts.subscribe(
            'T42.Themes',
            ({ selected }) => {
                if (selected === 'dark' || selected === 'light') {
                    setTheme(selected)
                }
            }
        )

        return () => {
            unsubscribePromise.then((f) => f()).catch()
        }
    }, [])

    return theme
}

export const useTheme = (): void => {
    const theme = useGlueTheme()

    useEffect(() => {
        setTheme(theme)
    }, [theme])
}

export function useGlueStatus(): { isConnected: boolean } {
    const [status, setStatus] = useState({ isConnected: false })

    useGlue(
        (glue) => {
            window.glue = glue

            const unsubscribeConnected = glue.connection.connected(() =>
                setStatus({ isConnected: true })
            )
            const unsubscribeDisconnected = glue.connection.disconnected(() =>
                setStatus({ isConnected: false })
            )

            return () => {
                callSafe(unsubscribeConnected)()
                callSafe(unsubscribeDisconnected)()
            }
        },
        [setStatus]
    )

    return status
}

export const attachGlueToGlobalScope = (glue: unknown): Promise<void> => {
    if (glue) {
        window.glue = glue
    }

    return Promise.resolve()
}

type IntentsApi = {
    addIntentListener: (
        intent: string,
        handler: IntentHandler
    ) => Promise<Listener>
    raiseIntent: (intent: string, context: Context, app?: AppIdentifier) => void
}

export const useIntents = (): IntentsApi | undefined => {
    const [intentsApi, setIntentsApi] = useState<IntentsApi>()

    useEffect(() => {
        if (window.fdc3) {
            console.log(
                'FDC3 is ready. Using fdc3 library as intents provider.'
            )
            setIntentsApi({
                addIntentListener: window.fdc3.addIntentListener.bind(
                    window.fdc3
                ),
                raiseIntent: async (
                    intent: string,
                    context: Context,
                    app?: AppIdentifier
                ) => {
                    console.log('raising FDC3 intent...')
                    console.log(intent, '/', context, '/', app)

                    const resolution = await window.fdc3.raiseIntent(
                        intent,
                        context,
                        app
                    )
                    try {
                        await resolution.getResult()
                    } catch (err) {
                        console.error(
                            `${resolution.source} returned a result error: ${err}`
                        )
                    }
                },
            })
        }
    }, [])

    return intentsApi
}

export const useAddIntentListenerInstrument = (
    intentName: string,
    handler: ({
        ticker,
        BBG_EXCHANGE,
    }: {
        ticker: string
        BBG_EXCHANGE: string
    }) => void
): void => {
    const intentsApi = useIntents()

    useEffect(() => {
        const subscribeToFdc3Updates = async () => {
            function contextHandler(context: Context) {
                if (
                    context == null ||
                    context.type !== FDC3_INSTRUMENT ||
                    !context.id
                ) {
                    console.log(
                        `${intentName} intent context's "type" must be ${FDC3_INSTRUMENT} and it should have id. Received `,
                        context?.type
                    )
                    return
                }

                const ric = context.id?.RIC?.split(SPLIT_INSTRUMENT_RIC_REGEX)

                let ticker = context.id.ticker || ''
                let BBG_EXCHANGE = 'LN'

                if (ric && ric.length > 1) {
                    ticker = ric[0]
                    BBG_EXCHANGE = ric[1]
                }

                handler && handler({ ticker, BBG_EXCHANGE })
            }

            const listener = await intentsApi?.addIntentListener(
                intentName,
                contextHandler
            )

            return () => {
                if (listener) {
                    listener.unsubscribe()
                }
            }
        }

        subscribeToFdc3Updates()
    }, [intentsApi, handler])
}

export const useAddNewOrderIntentListener = (
    handler: ({ order }: { order: Fdc3Order }) => void
): void => {
    const intentsApi = useIntents()

    useEffect(() => {
        async function subscribeToFdc3Updates() {
            const intent = 'NewOrder'

            function contextHandler(contextData: any) {
                console.log('context', contextData)

                if (contextData == null || contextData.type !== FDC3_ORDER) {
                    console.log(
                        `NewOrder intent context's "type" must be ${FDC3_ORDER}. Received `,
                        contextData?.type
                    )
                    return
                }

                handler && handler(contextData)
            }

            const listener = await intentsApi?.addIntentListener(
                intent,
                contextHandler
            )

            return () => {
                if (listener) {
                    listener.unsubscribe()
                }
            }
        }

        subscribeToFdc3Updates()
    }, [intentsApi, handler])
}

export const useAddTradeHistoryIntentListener = (
    intentName: string,
    handler: ({ order }: { order: Fdc3Order }) => void
): void => {
    const intentsApi = useIntents()
    useEffect(() => {
        async function subscribeToFdc3Updates(api: any) {
            function contextHandler(contextData: any) {
                if (contextData == null || contextData.type !== FDC3_ORDER) {
                    console.log(
                        `${intentName} intent context's "type" must be ${FDC3_ORDER}. Received `,
                        contextData
                    )
                    return
                }

                handler && handler(contextData)
            }

            const listener = await api?.addIntentListener(
                intentName,
                contextHandler
            )

            return () => {
                if (listener) {
                    listener.unsubscribe()
                }
            }
        }

        subscribeToFdc3Updates(intentsApi)
    }, [intentsApi, handler])
}

export const useAddIntentListener = (
    intentName: string,
    handler: (contextData: any) => void
): void => {
    const intentsApi = useIntents()
    useEffect(() => {
        async function subscribeToFdc3Updates() {
            const listener = await intentsApi?.addIntentListener(
                intentName,
                handler
            )

            return () => {
                console.log(
                    `unsubscribing listener for ${intentName}`,
                    listener
                )
                listener?.unsubscribe()
            }
        }

        subscribeToFdc3Updates()
    }, [intentsApi, intentName, handler])
}

export const useCloseMyWindow = (): any => {
    const [close, setClose] = useState<any>()
    const glue = useContext(GlueContext)

    useEffect(() => {
        setClose(() => () => glue?.windows.my().close())
    }, [glue])

    return close
}

export const useCorrectRowSelection = (
    selectedNodes?: RowNode[],
    instrument?: Fdc3Instrument
): void => {
    useEffect(() => {
        if (instrument && selectedNodes && selectedNodes.length === 1) {
            const selectedRow = selectedNodes[0]

            const RIC = formatInstrument(
                selectedRow.data?.instrument.ticker,
                selectedRow.data?.instrument.bbgExchange
            )

            if (RIC !== instrument.id?.RIC) {
                selectedRow.setSelected(false)
            }
        }
    }, [instrument])
}
