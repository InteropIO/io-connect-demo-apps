import {
    BBG_WORKSHEET_NAME,
    SF_SYSTEM_NAME,
    ViewOrderHistoryIntent,
} from './constants/constants'
import {
    METHODNAME_ACME_SYNC_CONTACT,
    METHODNAME_ADDTOBBGWORKSHEET_FOREXCEL,
    METHODNAME_GET_CLIENTS,
    METHODNAME_GET_FUNDS,
    METHODNAME_GET_INSTRUMENTS,
    METHODNAME_GET_ORDER_SIDES,
    METHODNAME_MORNINGSTAR_SYNC,
    METHODNAME_POPULATE_ORDER_DIALOG,
    METHODNAME_SALESFORCE_SYNC_CONTACT,
    METHODNAME_VIEW_CONTACT,
    MORNINGSTAR_APP_NAME,
} from './constants/methods'
import { ClientInfo } from './models/clients'
import { Fdc3Order } from './models/fdc3-order'
import { pushToBbgWorksheet } from './util/bbg'

interface MethodRegistrationItem {
    definition: any
    handler: (args: any, caller: any) => any
}

class AcmeService {
    private glue: any
    private fdc3: any
    private methods: MethodRegistrationItem[]
    private clientSyncedId: string
    // private didReplay: boolean

    constructor(glue: any, fdc3: any) {
        this.glue = glue
        this.fdc3 = fdc3
        this.methods = []
        this.clientSyncedId = ''
        // this.didReplay = false
    }

    async initialize(): Promise<void> {
        this.methods.push({
            definition: {
                name: METHODNAME_POPULATE_ORDER_DIALOG,
                accepts:
                    'composite: { string side, number quantity, string instrument, string market, contact, timestamp } order',
                returns: '',
                displayName: 'Open order dialog with pre-populated fields',
                description: 'Open order dialog with pre-populated fields',
            },
            handler: (args: any) => this.populateOrderDialog(args),
        })

        // Extract back to ACME
        this.methods.push({
            definition: {
                name: METHODNAME_ADDTOBBGWORKSHEET_FOREXCEL,
                accepts:
                    'composite: { string side, number quantity, string instrument, string market, contact, timestamp } order',
                returns: '',
                displayName: 'Open order dialog with pre-populated fields',
                description: 'Open order dialog with pre-populated fields',
            },
            handler: (param: any) => {
                console.log(
                    'Received request to publish to BBG worksheet',
                    param
                )
                const instruments = param.symbols.filter((s: any) => s)
                const watchlistName = Array.isArray(param.watchlist)
                    ? param.watchlist[0] || BBG_WORKSHEET_NAME
                    : BBG_WORKSHEET_NAME
                pushToBbgWorksheet(instruments, this.glue, watchlistName)
            },
        })

        this.methods.push({
            definition: {
                name: METHODNAME_SALESFORCE_SYNC_CONTACT,
            },
            handler: async (args: any) => {
                const contact = args.contact
                const sfNativeId = contact?.ids?.find(
                    ({ systemName }: any) => systemName === SF_SYSTEM_NAME
                )?.nativeId

                const clients =
                    (await this.glue?.interop.invoke(METHODNAME_GET_CLIENTS))
                        ?.returned?.clients || []

                const internalClient: ClientInfo = clients.find(
                    (cl: any) => cl.salesforceId === sfNativeId
                )

                if (sfNativeId === this.clientSyncedId) {
                    this.clientSyncedId = ''
                    return
                }

                if (internalClient) {
                    this.raiseViewOrderHistory({
                        clientId: internalClient.clientId,
                        securityId: {
                            ticker: '',
                            bbgExchange: '',
                        },
                    })
                }
            },
        })

        this.methods.push({
            definition: {
                name: METHODNAME_ACME_SYNC_CONTACT,
            },
            handler: (args: any) => {
                const sfId = this.getSfId(args.contact)
                this.clientSyncedId = sfId

                this.glue.interop
                    .invoke(
                        METHODNAME_VIEW_CONTACT,
                        {
                            contact: {
                                type: 'fdc3.contact',
                                id: {
                                    email:
                                        args.contact?.emails?.length &&
                                        args.contact.emails[0],
                                },
                            },
                        },
                        'skipMine'
                    )
                    .catch(console.error)
            },
        })

        this.methods.push({
            definition: {
                name: METHODNAME_MORNINGSTAR_SYNC,
            },
            handler: this.syncMorningStar.bind(this),
        })

        await this.glue.contexts.subscribe(
            '___channel___Blue',
            (_: any, delta: any) => {
                // TODO: document the intent for this check
                const deltaRIC = delta?.data?.instrument?.id?.RIC
                const deltaTicker = delta?.data?.instrument?.id?.ticker
                if ((deltaRIC && deltaTicker) || !deltaRIC) {
                    return
                }

                const SPLIT_INSTRUMENT_RIC_REGEX = /[ .:]+/
                const RIC = deltaRIC.split(SPLIT_INSTRUMENT_RIC_REGEX)
                const ticker = RIC[0]
                const exchange = RIC[1]

                if (ticker && typeof ticker === 'string') {
                    this.raiseViewOrderHistory({
                        securityId: {
                            ticker: ticker,
                            bbgExchange: exchange,
                        },
                        clientId: '',
                                            })
                }
            }
        )

        for (const method of this.methods) {
            this.glue.interop
                .register(method.definition, method.handler)
                .then(() => {
                    console.log(
                        'Method ' + method.definition.name + ' registered.'
                    )
                })
                .catch((e: any) => {
                    console.error(
                        'Method registration failed for ' +
                            method.definition.name
                    )
                    console.error(e)
                })
        }
    }

    private async syncMorningStar(args: {
        ticker?: string
        isin?: string
    }): Promise<void> {
        const navigateToMorningstarUrl = async (url: string) => {
            try {
                const isGlue42Enterprise =
                    typeof (window as any).glue42gd !== 'undefined'

                if (isGlue42Enterprise) {
                    const morningstarWin =
                        this.glue.windows?.find(MORNINGSTAR_APP_NAME)
                    if (morningstarWin && url) {
                        await morningstarWin.navigate(url).catch(console.error)
                    }
                } else {
                    const regExp = new RegExp(/\b(\w*morningstar\w*)\b/)
                    const iframes = Array.from(
                        document.getElementsByTagName('iframe')
                    )

                    if (iframes && iframes.length) {
                        iframes.forEach((frame) => {
                            if (frame.src.match(regExp)) {
                                frame.src = url
                            }
                        })
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }

        const funds: { isin: string; url: string }[] = await this.glue.interop
            .invoke(METHODNAME_GET_FUNDS)
            .then(({ returned }: any) => returned?.funds ?? [])
            .catch((error: any) => {
                console.error(
                    `Failed invoking ${METHODNAME_GET_FUNDS}. Error: `,
                    error
                )
                return []
            })
        const fundToSync = funds.find(({ isin }) => isin === args?.isin)

        if (fundToSync) {
            await navigateToMorningstarUrl(fundToSync.url)
            return
        }

        const instruments: { ticker: string; url: string }[] =
            await this.glue.interop
                .invoke(METHODNAME_GET_INSTRUMENTS)
                .then(({ returned }: any) => returned?.instruments ?? [])
                .catch((error: any) => {
                    console.error(
                        `Failed invoking ${METHODNAME_GET_INSTRUMENTS}. Error: `,
                        error
                    )
                    return []
                })

        const instrumentToSync = instruments.find(
            ({ ticker }) => ticker === args?.ticker
        )

        if (instrumentToSync && instrumentToSync.url) {
            await navigateToMorningstarUrl(instrumentToSync.url)
        }
    }

    private async populateOrderDialog(args: any) {
        const orderSides =
            (await this.glue?.interop.invoke(METHODNAME_GET_ORDER_SIDES))
                ?.returned.orderSides || []

        let side = args.side
        for (const property in orderSides) {
            const displayName = orderSides[property].displayName
            if (args.side?.toLowerCase() === displayName?.toLowerCase()) {
                side = property
                break
            }
        }

        const ticker = args.instrument?.toUpperCase() || ''
        const exchange = args.market?.toUpperCase() || ''

        const RIC = exchange ? ticker + ' ' + exchange : ticker

        const order: Fdc3Order = {
            type: 'fdc3.order',
            side,
            contact: {
                type: 'fdc3.contact',
                name: args.contact?.displayName,
                id: {
                    email:
                        args.contact?.emails?.length && args.contact.emails[0],
                },
            },
            instrument: {
                type: 'fdc3.instrument',
                id: {
                    RIC,
                    ticker,
                },
            },
            quantity: args.quantity,
        }

        this.fdc3?.raiseIntent(
            'NewOrder', 
            {
                type: 'fdc3.order',
                order      
            },
            { appId: 'fdc3-oms-new-order' }
        )
    }

    private raiseViewOrderHistory = async (context: any): Promise<void> => {
        if (await this.shouldRaiseIntent()) {
            this.fdc3?.raiseIntent(
                ViewOrderHistoryIntent, 
                context,
                { appId: 'fdc3-oms-order-history' })
                .catch((error: Error) => {
                    console.error(
                        'ViewOrderHistory intent failed. Error: ',
                        error
                    )
                })
        }
    };

    private shouldRaiseIntent = async (): Promise<any> => {
        const intents = await this.fdc3.findIntent(ViewOrderHistoryIntent)
        return !!intents.apps.find((i: any) => i.name === 'fdc3-oms-order-history')
    }

    private getSfId = ({ ids }: any) => {
        return ids?.find(({ systemName }: any) => systemName === SF_SYSTEM_NAME)
            ?.nativeId
    }
}

export default AcmeService
