import { GlueContext } from '@glue42/react-hooks'
import { useEffect, useState, useContext } from 'react'
import { METHODNAME_MARKET_DATA } from '../../constants/methods'
import InstrumentDetails from './InstrumentDetails'
import SelectInstrument from './SelectInstrument'
import YellowStrip from './YellowStrip'
import useGenerateBids from './hooks/useGenerateBids'
import { BidTable } from './BidTable'
import { useFdc3Instruments } from '../../hooks/useFdc3Instruments'
import useInstrumentDetailsContext from '../../hooks/useInstrumentDetailsContext'
import { useMorningStarSync } from '../../hooks/useMorningStarSync'
import { useAddIntentListenerInstrument, useGlueTheme } from '../../util/glue'
import { MarketDepthIntent } from '../../constants'
import '../../css/market-depth.css'

interface MarketDepthData {
    ticker: string
    description: string
    volume?: number
    lastPrice?: number
    openPrice?: number
    lowPrice?: number
    highPrice?: number
    prevClosePrice?: number
    time?: Date
    netChange?: number
    isin: string
    currency: string
}

const MarketDepth = (): JSX.Element => {
    const {
        instrumentContext: { id },
        publish,
    } = useInstrumentDetailsContext()

    const [marketData, setMarketData] = useState<MarketDepthData | null>()
    const glue = useContext(GlueContext)
    const bidData = useGenerateBids(marketData?.ticker, marketData?.lastPrice)
    const instruments = useFdc3Instruments()
    const { syncInstrument } = useMorningStarSync()
    useAddIntentListenerInstrument(MarketDepthIntent, publish)
    const theme = useGlueTheme()

    useEffect(() => {
        function onDataReceived(streamData: any) {
            setMarketData(streamData.data)
        }

        if (id) {
            const fdc3Instrument = instruments?.instruments?.find(
                (instrument) => {
                    return instrument.id?.RIC === id.RIC
                }
            )

            const subscriptionOptions = {
                arguments: {
                    list: {
                        type: 'fdc3.instrumentList',
                        instruments: [fdc3Instrument],
                    },
                },
                onData: onDataReceived,
                onClosed: () => console.warn('Subscription closed by server.'),
            }

            const subscriptionPromise = glue.interop.subscribe(
                METHODNAME_MARKET_DATA,
                subscriptionOptions
            )

            return () => {
                subscriptionPromise.then((subscription: any) => {
                    subscription?.close()
                })

                setMarketData(null)
            }
        }
    }, [id, glue.interop, instruments])

    useEffect(() => {
        let title = 'FDC3 Market Depth: '

        if (id && id.RIC) {
            title = title + id.RIC
        }

        glue.windows.my().setTitle(title)
    }, [id, glue.windows])

    const onSymbolChange = (symbol: any) => {
        publish(symbol)
        syncInstrument(symbol.ticker)
    }

    return (
        <div className=" h-100">
            <div className="row">
                <div className="col-3">
                    <SelectInstrument
                        onChange={onSymbolChange}
                        instrument={id}
                    />
                </div>
                {id && marketData && (
                    <div className="col-9">
                        <YellowStrip data={marketData} />
                    </div>
                )}
            </div>
            <div className={theme === 'dark' ? 'market-depth-container' : ''}>
                <InstrumentDetails data={marketData} theme={theme} />
            </div>
            {bidData && bidData.length ? (
                <BidTable className="pt-4 m-1" data={bidData} />
            ) : (
                <></>
            )}
        </div>
    )
}

export default MarketDepth
