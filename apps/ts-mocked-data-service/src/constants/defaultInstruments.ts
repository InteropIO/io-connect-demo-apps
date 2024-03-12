import { Fdc3InstrumentList } from '../models/fdc3-instrument'
import { instruments } from './instruments'

const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

export const defaultInstruments: Fdc3InstrumentList = {
  type: 'fdc3.instrumentList',
  name: 'Default Watchlist',
  id: { watchlistId: 'watchlist_default' },
  instruments: instruments.map(({ description, ticker, bbgExchange }) => {
    return {
      type: 'fdc3.instrument',
      name: description,
      id: {
        ticker: ticker,
        BBG_EXCHANGE: bbgExchange,
        RIC: `${ticker} ${bbgExchange}`,
        customID: ID()
      },
    }
  }),
}
