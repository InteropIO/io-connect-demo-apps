import { useCallback, useState } from 'react'
import TradeHistoryGrid from './TradeHistoryGrid'
import { Fdc3Order } from '../models/fdc3-order'
import { Fdc3Instrument } from '../models/fdc3-instrument'
import {
    useAddIntentListener,
    useAddTradeHistoryIntentListener,
} from '../util/glue'
import {
    INTENT_VIEW_INSTRUMENT_TRADE_HISTORY,
    INTENT_VIEW_ORDER_TRADE_HISTORY,
} from '../constants'

export default function TradeHistoryPage(): JSX.Element {
    const [intentOrder, setIntentOrder] = useState<Fdc3Order>()
    const [intentInstrument, setIntentInstrument] = useState<Fdc3Instrument>()

    const handleViewTradeHistoryForOrder = useCallback((order: Fdc3Order) => {
        console.log('viewTradeHistoryForOrder:', order)
        setIntentOrder(order)
    }, [])
    useAddTradeHistoryIntentListener(
        INTENT_VIEW_ORDER_TRADE_HISTORY,
        handleViewTradeHistoryForOrder
    )

    const handleViewTradeHistoryForInstrument = useCallback(
        (instrument: Fdc3Instrument) => {
            console.log('viewTradeHistoryForInstrument:', instrument)
            setIntentInstrument(instrument)
        },
        []
    )
    useAddIntentListener(
        INTENT_VIEW_INSTRUMENT_TRADE_HISTORY,
        handleViewTradeHistoryForInstrument
    )

    return (
        <div className="orders-page d-flex flex-column flex-grow-1">
            <TradeHistoryGrid
                intentOrder={intentOrder}
                intentInstrument={intentInstrument}
            />
        </div>
    )
}
