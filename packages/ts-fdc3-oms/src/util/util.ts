import { SPLIT_INSTRUMENT_RIC_REGEX } from '../constants'
import { Fdc3Contact } from '../models/fdc3-contact'
import { Fdc3Instrument, Fdc3InstrumentId } from '../models/fdc3-instrument'
import { Fdc3Trade } from '../models/fdc3-trade'
import { InstrumentIdInternal, OrderTrade } from '../models/orders'

export const sleep = (ms: number): Promise<number> => {
    return new Promise((resolve) => setTimeout(resolve, ms || 100))
}

export function callSafe(fn: CallableFunction): CallableFunction {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any) => {
        if (typeof fn === 'function') {
            return fn(...args)
        }
    }
}

export function setTheme(theme: string): void {
    const htmlEl = document.getElementsByTagName('html')[0]

    if (theme === 'dark') {
        htmlEl.classList.replace('light', theme)
    } else if (theme === 'light') {
        htmlEl.classList.replace('dark', theme)
    }
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min
}

export function formatInstrument(ticker: string, exchange: string): string {
    return `${ticker} ${exchange}`
}

export function formatInstrumentFromId(id: InstrumentIdInternal): string {
    if (!id || !id.ticker || !id.bbgExchange) return ''
    return formatInstrument(id.ticker, id.bbgExchange)
}

export function formatInstrumentForBbg(
    ticker?: string,
    exchange?: string
): string | null | undefined {
    if (!ticker || !exchange) return null
    return `${ticker} ${exchange} Equity`
}

export function formatInstrumentForBbgFromId(
    id: InstrumentIdInternal
): string | null | undefined {
    if (!id) return null
    return formatInstrumentForBbg(id.ticker, id.bbgExchange)
}

export function getTicker(id: Fdc3InstrumentId | undefined): string {
    let ticker = id?.ticker || ''

    if (!ticker) {
        const RIC = id?.RIC?.split(SPLIT_INSTRUMENT_RIC_REGEX)

        if (RIC?.length) {
            ticker = RIC[0]
        }
    }

    return ticker
}

export function getExchange(id: Fdc3InstrumentId | undefined): string {
    let exchange = ''

    const RIC = id?.RIC?.split(SPLIT_INSTRUMENT_RIC_REGEX)

    if (RIC && RIC.length >= 1) {
        exchange = RIC[1]
    }

    return exchange
}

export function getInstrumentIdFromString(
    input?: string
): InstrumentIdInternal {
    const items = ((input || '') + ':')
        .toUpperCase()
        .split(SPLIT_INSTRUMENT_RIC_REGEX)
    return {
        ticker: items[0],
        bbgExchange: items[1],
    }
}

export function getTickerFromString(input?: string): string {
    const items = ((input || '') + ':')
        .toUpperCase()
        .split(SPLIT_INSTRUMENT_RIC_REGEX)
    return items[0]
}

export const getFdc3Instrument = (
    input?: InstrumentIdInternal | string
): Fdc3Instrument | undefined => {
    if (!input) return undefined

    if (typeof input === 'string') {
        input = getInstrumentIdFromString(input)
    }

    // InstrumentIdInternal
    if (input?.ticker) {
        if (input.bbgExchange) {
            return {
                type: 'fdc3.instrument',
                id: {
                    ticker: input.ticker,
                    RIC: formatInstrument(input.ticker, input.bbgExchange),
                    BBG: formatInstrumentForBbg(
                        input.ticker,
                        input.bbgExchange
                    )!,
                },
            }
        } else {
            // ticker only
            return {
                type: 'fdc3.instrument',
                id: {
                    ticker: input.ticker,
                },
            }
        }
    }

    return undefined
}

export function convertOrderTradeToFdc3Trade(trade: OrderTrade): Fdc3Trade {
    const instrument: Fdc3Instrument = {
        type: 'fdc3.instrument',
        id: {
            ticker: trade.instrument.ticker,
            BBG_EXCHANGE: trade.instrument.bbgExchange,
            RIC: formatInstrument(
                trade.instrument.ticker,
                trade.instrument.bbgExchange
            ),
        },
    }

    const contact: Fdc3Contact = {
        type: 'fdc3.contact',
        name: trade.clientId,
        id: {
            clientId: trade.clientId,
        },
    }

    return {
        type: 'fdc3.trade',
        side: trade.side,
        instrument: instrument,
        order: {
            type: 'fdc3.order',
            id: trade.orderId.toString(),
            instrument,
        },
        sliceId: trade.sliceId.toString(),
        quantity: trade.quantity,
        price: trade.price,
        comments: trade.comments,
        execBroker: trade.execBroker,
        exchange: trade.exchange,
        timestamp: trade.timestamp,
        contact,
    }
}
