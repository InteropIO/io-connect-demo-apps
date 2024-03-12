import { PRNG_sfc32 } from './util/prng'
import { instruments } from './constants/instruments'
import { METHODNAME_MARKET_DATA } from './constants/methods'
import { Fdc3Instrument } from './models/fdc3-instrument'
import { getTradeCloseTime, getTradeOpenTime } from './util/order-generator'
import DataService from './dataService'

interface SymbolCache {
  [ticker: string]: {
    ticker: string
    volume: number
    lastTradedVolume: number
    lastPrice: number
    openPrice: number
    lowPrice: number
    highPrice: number
    prevClosePrice: number
    totalVWAP: number
    time: Date
    description: string
    isin: string
    currency: string
  }
}
interface SubscribersMap {
  [ticker: string]: any[]
}

interface PollingTasks {
  [ticker: string]: any
}

class MarketDataService implements DataService {
  private glue: any
  private symbolCache: SymbolCache = {}
  private min = -5
  private max = 5
  private subscribers: SubscribersMap = {}
  private pollingTasks: PollingTasks = {}

  constructor(glue: any) {
    this.glue = glue
  }

  initialize = async (): Promise<void> => {
    await this.registerStream()
  }

  private registerStream = async () => {
    const streamDefinition = {
      name: METHODNAME_MARKET_DATA,
      displayName: 'Mock Market Data',
      accepts: 'Fdc3InstrumentList list',
      returns:
        'String symbol, Number volume, Number lastTradedVolume, Number lastPrice, Number openPrice, Number lowPrice, Number highPrice, Number prevClosePrice, Number totalVWAP, Date time,  String description, String isin, String currency',
    }

    const streamOptions = {
      subscriptionRequestHandler: (subscriptionRequest: any) =>
        this.onSubscriptionRequest(subscriptionRequest),
      subscriptionAddedHandler: (streamSubscription: any) =>
        this.onSubscriptionAdded(streamSubscription),
      subscriptionRemovedHandler: (streamSubscription: any) =>
        this.onSubscriptionRemoved(streamSubscription),
    }

    await this.glue.interop.createStream(streamDefinition, streamOptions)
  }

  private onSubscriptionRequest = (subscriptionRequest: any) => {
    const application = subscriptionRequest.instance.application
    const instrumentList = subscriptionRequest.arguments?.list?.instruments

    if (instrumentList && instrumentList.length > 0) {
      subscriptionRequest.accept()
      console.log(`Accepted subscription by "${application}" `)
    } else {
      subscriptionRequest.reject(
        'Subscription rejected: missing instrument list!'
      )
      console.warn(
        `Rejected subscription by "${application}". Instrument List not specified`
      )
    }
  }

  private onSubscriptionAdded = (streamSubscription: any) => {
    const instrumentList = streamSubscription.arguments.list.instruments
    if (instrumentList) {
      instrumentList.forEach((instrument: Fdc3Instrument) => {
        this.processSymbol(instrument, streamSubscription)
      })
    }
  }

  private onSubscriptionRemoved = (streamSubscription: any) => {
    const unsubscriber = streamSubscription
    for (const ticker in this.subscribers) {
      const indexToRemove = this.subscribers[ticker].findIndex(
        (element: any) => {
          return element.subscription.id === unsubscriber.subscription.id
        },
        unsubscriber
      )
      if (indexToRemove >= 0) {
        this.subscribers[ticker].splice(indexToRemove, 1)
      }
      if (this.subscribers[ticker].length <= 0) {
        delete this.subscribers[ticker]
        this.stopDataRequests(ticker)
      }
    }
  }

  private processSymbol = (instrument: Fdc3Instrument, streamSubscription: any) => {
    const ticker = instrument.id?.ticker
    if (ticker == null) {
      return;
    }

    if (this.subscribers[ticker] && this.subscribers[ticker].length > 0) {
      this.subscribers[ticker].push(streamSubscription)

      // Reply.
      if (this.symbolCache[ticker]) {
        streamSubscription.push(this.symbolCache[ticker])
      }
    } else {
      this.subscribers[ticker] = [streamSubscription]
      this.startDataRequests(ticker)
    }
  }

  private getPrice = (ticker: string, date: Date, basePrice: number) => {
    const prng = new PRNG_sfc32(this.formatDate(ticker, date))
    const priceRnd = prng.next32Range(this.min, this.max)

    const price = basePrice * (1 + priceRnd / 100)
    return price
  }

  private getMockedTotalVWAP = (
    openPrice: number,
    lowPrice: number,
    highPrice: number,
    lastPrice: number,
    volume: number
  ) => {
    const volumeOpen = volume * 0.75
    const volumeLow = volume * 0.1
    const volumeHigh = volume * 0.1
    const volumeLast = volume * 0.05

    const totalVWAP =
      (openPrice * volumeOpen +
        lowPrice * volumeLow +
        highPrice * volumeHigh +
        lastPrice * volumeLast) /
      volume

    return totalVWAP
  }

  private getLastTradedVolume = (ticker: string, date: Date) => {
    const prng = new PRNG_sfc32(this.formatDate(ticker, date))
    const volumeRnd = prng.next32Range(1, 20)

    return volumeRnd * 1000
  }

  private formatDate = (ticker: string, date: Date): string => {
    let fmtDate = date.toISOString().split('.')[0]
    const lastNum = parseInt(fmtDate.charAt(fmtDate.length - 1))
    const mod = lastNum <= 5 ? 'a' : 'b'
    fmtDate = fmtDate.replace(/.$/, mod)
    return fmtDate + ticker
  }

  private fetchMarketData = (ticker: string, date: Date = new Date()) => {
    const instrument = instruments.find(
      (item) => item.ticker === ticker
    )
    const basePrice = instrument?.price.close || Math.random() * 1000
    const lastPrice = this.getPrice(ticker, date, basePrice)
    const lastTradeCloseTime = getTradeCloseTime(new Date(date.getDate() - 1))
    const prevClosePrice = this.getPrice(ticker, lastTradeCloseTime, basePrice)
    const maxVolume = instrument?.volume.average || Math.random() * 1000
    const volume = this.getVolume(date, maxVolume)
    const lastTradedVolume = this.getLastTradedVolume(ticker, date)
    const openPriceRnd = new PRNG_sfc32(
      this.formatDate(ticker, getTradeOpenTime(date))
    ).next32Range(this.min, this.max)
    const openPrice = basePrice * (1 + openPriceRnd / 100)

    const lowPrice = basePrice - (this.min / 100) * basePrice
    const highPrice = basePrice + (this.max / 100) * basePrice

    const totalVWAP = this.getMockedTotalVWAP(
      openPrice,
      lowPrice,
      highPrice,
      lastPrice,
      volume
    )

    const description = instrument?.description || ''
    const isin = instrument?.isin || ''
    const currency = instrument?.currency || ''

    const marketData = {
      ticker,
      volume,
      lastTradedVolume,
      lastPrice,
      openPrice,
      lowPrice,
      highPrice,
      prevClosePrice,
      totalVWAP,
      time: date,
      description,
      isin,
      currency,
    }
    this.symbolCache[ticker] = marketData
    this.subscribers[ticker].forEach((subscriber: any) => {
      subscriber.push(marketData)
    })
  }

  private getVolume = (date: Date, maxVolume: number): number => {
    const tradeOpenTime = getTradeOpenTime(date).valueOf()
    const tradeCloseTime = getTradeCloseTime(date).valueOf()
    const currentTime = date.valueOf()
    let volume = 0
    if (currentTime > tradeCloseTime) {
      volume = maxVolume
    } else if (currentTime > tradeOpenTime && currentTime < tradeCloseTime) {
      const dayDuration = tradeCloseTime - tradeOpenTime
      const dayProgress = currentTime - tradeOpenTime
      volume = maxVolume * (dayProgress / dayDuration)
    }

    return Math.round(volume)
  }

  private getRandomInterval = (minTime: number, maxTime: number): number => {
    return Math.floor(Math.random() * (maxTime - minTime + 1) + minTime) * 1000
  }

  private startDataRequests = (ticker: string) => {
    this.pollingTasks[ticker] = setInterval(
      this.fetchMarketData,
      this.getRandomInterval(1, 5),
      ticker
    ) as any
  }

  private stopDataRequests = (ticker: string) => {
    const task = this.pollingTasks[ticker]
    clearInterval(task)
    delete this.pollingTasks[ticker]
  }
}

export default MarketDataService
