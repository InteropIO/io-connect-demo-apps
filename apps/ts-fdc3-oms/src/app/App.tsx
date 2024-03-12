import { useTheme } from './util/glue'
import {
    HASH_CHART,
    HASH_MARKET_DEPTH,
    HASH_NEW_ORDER,
    HASH_NEW_TRADE,
    HASH_ORDER_HISTORY,
    HASH_TRADE_HISTORY,
    HASH_TRADING_POSITIONS,
    HASH_WATCHLIST,
    HASH_PORTFOLIO
} from './constants/pageHashes'
import React, { Suspense, useContext } from 'react'
import Loader from './components/Loader'
import NewTradePage from './components/NewTrade/NewTradePage'
import TradingPositions from './components/NewTrade/TradingPositions'
import Watchlist from './components/Watchlist/Watchlist'
import MarketDepth from './components/MarketDepth/MarketDepth'
import Portfolio from './components/Portfolio/Portfolio'
import useInitConditions from './hooks/useInitConditions'
import { GlueContext } from '@glue42/react-hooks'

const OrdersPage = React.lazy(() => import('./components/OrdersPage'))
const OrderHistoryPage = React.lazy(
    () => import('./components/OrderHistoryPage')
)
const InstrumentChartPage = React.lazy(
    () => import('./components/InstrumentChartPage')
)
const NewOrderPage = React.lazy(() => import('./components/NewOrderPage'))
const TradeHistoryPage = React.lazy(() => import('./components/TradeHistory'))

const parseUrl = (url: string) => {
    const result: { [key: string]: string } = {}
    url.replace(
        /([?&])+([^=?#&]+)(?:=([^?#&]*))?/g,
        function replacer(_, type, key, value) {
            const decodedKey = decodeURIComponent(key)
            const decodedValue = decodeURIComponent(value)
            const capKey = decodedKey[0].toUpperCase() + decodedKey.slice(1)
            result['url' + capKey] = decodedValue
            return ''
        }
    )

    let hash = ''
    const hashMatch = url.match(/#([^?#&]*)/)
    if (hashMatch) {
        hash = decodeURIComponent(hashMatch[1])
    }
    result['urlHash'] = hash
    return result
}

const routeView = () => {
    const { urlHash } = parseUrl(window.location.href)
    console.log('Route view: ', urlHash)
    if (urlHash === HASH_CHART) {
        return <InstrumentChartPage />
    } else if (urlHash === HASH_NEW_ORDER) {
        return <NewOrderPage />
    } else if (urlHash === HASH_ORDER_HISTORY) {
        return <OrderHistoryPage />
    } else if (urlHash === HASH_NEW_TRADE) {
        return <NewTradePage />
    } else if (urlHash === HASH_TRADING_POSITIONS) {
        return <TradingPositions />
    } else if (urlHash === HASH_TRADE_HISTORY) {
        return <TradeHistoryPage />
    } else if (urlHash === HASH_WATCHLIST) {
        return <Watchlist />
    } else if (urlHash === HASH_MARKET_DEPTH) {
        return <MarketDepth />
    } else if (urlHash === HASH_PORTFOLIO) {
        return <Portfolio />
    } else {
        return <OrdersPage />
    }
}

function App(): JSX.Element {
    const glue = useContext(GlueContext)
    useTheme()
    useInitConditions(glue)

    return (
        <div className="App p-3 d-flex flex-column flex-grow-1">
            <Suspense fallback={<Loader />}>{routeView()}</Suspense>
        </div>
    )
}

export default App
