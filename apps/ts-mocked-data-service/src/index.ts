import BidDataService from './bidDataService'
import OrderManagementService from './orderManagementService'
import MarketDataService from './marketDataService'
import { MockServiceOptions } from './models/mockServiceOptions'

const start = async (glue: any, options?: MockServiceOptions): Promise<void> => {
  const orderService = new OrderManagementService(glue, options)
  await orderService.initialize()

  const marketDataService = new MarketDataService(glue)
  await marketDataService.initialize()

  const bidDataService = new BidDataService(glue)
  await bidDataService.initialize()
}

export default start
