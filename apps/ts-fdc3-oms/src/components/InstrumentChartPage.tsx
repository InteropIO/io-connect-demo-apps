import { useCallback, useEffect, useState } from 'react'

import TradingViewWidget from './TradingViewWidget'
import { useAddIntentListenerInstrument } from './../util/glue'
import useInstrumentDetailsContext from '../hooks/useInstrumentDetailsContext'
import { useMorningStarSync } from '../hooks/useMorningStarSync'
import { ViewChartIntent } from '../constants'

const useInstrumentSymbol = () => {
    const [instrumentSymbol, setInstrumentSymbol] = useState<
        string | undefined
    >()
    const {
        instrumentContext: { id },
        publish,
    } = useInstrumentDetailsContext()
    const { syncInstrument } = useMorningStarSync()

    useEffect(() => {
        if (id?.ticker) {
            setInstrumentSymbol(id.ticker)
        }
    }, [id])

    const setSymbol = useCallback(
        ({
            ticker,
            BBG_EXCHANGE,
        }: {
            ticker: string
            BBG_EXCHANGE: string
        }) => {
            publish({
                ticker,
                BBG_EXCHANGE,
            })

            setInstrumentSymbol(ticker)
            syncInstrument(ticker)
        },
        [publish, setInstrumentSymbol, syncInstrument]
    )

    useAddIntentListenerInstrument(ViewChartIntent, setSymbol)

    return {
        symbol: instrumentSymbol,
        setSymbol,
    }
}

export default function InstrumentChartPage(): JSX.Element {
    const { symbol, setSymbol } = useInstrumentSymbol()

    return (
        <>
            <TradingViewWidget
                symbol={symbol}
                onSymbolChange={({ symbol }) =>
                    setSymbol({ ticker: symbol, BBG_EXCHANGE: 'LN' })
                }
            />
        </>
    )
}
