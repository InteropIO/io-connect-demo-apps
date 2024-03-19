import DataService from './dataService'
import { METHODNAME_GET_BID_DATA } from './constants/methods'
import { instruments } from './constants/instruments'
import { PRNG_sfc32 } from './util/prng'
import { BidData } from './models/bidData'

const maxVolumeChange = 0.5
const minPriceChange = 3
const maxPriceChange = 8

const numOfOrders = 3

class BidDataService implements DataService {
  private glue: any

  constructor(glue: any) {
    this.glue = glue
  }

  async initialize(): Promise<any> {
    await this.glue.interop
      .register(
        {
          name: METHODNAME_GET_BID_DATA,
          accepts: 'string ticker?, number lastPrice?',
          returns: 'BidData[] bids',
          displayName: 'Get Bid Data for instrument',
          description: 'Retrieve a list of bids for instrument',
        },
        (args: any) => this.generateBids(args)
      )
      .catch((e: any) => {
        console.error('Exception while registering method.', e)
      })
  }

  private generateBids = ({
    ticker,
    lastPrice,
  }: {
    ticker?: string
    lastPrice?: number
  }): { bidData: BidData[] | undefined } => {
    let generatedBidsArr

    if (lastPrice && ticker) {
      generatedBidsArr = []
      for (let i = 0; i < numOfOrders; i++) {
        generatedBidsArr.push(this.createOrder(ticker, lastPrice, '1', i))
        generatedBidsArr.push(this.createOrder(ticker, lastPrice, '2', i))
      }
    }

    return { bidData: generatedBidsArr }
  }

  private createOrder = (
    ticker: string,
    price: number,
    side: string,
    modifier: number
  ): BidData => {
    const rng = new PRNG_sfc32(modifier + side)
    const rndCount = rng.next32Range(1, 10)
    const priceRnd = rng.next32Range(minPriceChange, maxPriceChange)
    const priceChange = price * (priceRnd / 100)
    const rndPrice = side === '1' ? price - priceChange : price + priceChange

    const instrument = instruments.find(
      (instr) => instr.ticker === ticker
    )
    const averageVolume = instrument?.volume.average || Math.random() * 1000
    const volumeRng = new PRNG_sfc32(Math.random() * 100 + side + ticker)
    const minVolume = averageVolume * 0.001
    const maxVolume = averageVolume * (maxVolumeChange / 100)
    const rndVolume = volumeRng.next32Range(minVolume, maxVolume)
    return {
      count: rndCount,
      volume: Math.round(rndVolume / 100) * 100,
      price: +rndPrice.toFixed(2),
      side: side,
    }
  }
}

export default BidDataService
