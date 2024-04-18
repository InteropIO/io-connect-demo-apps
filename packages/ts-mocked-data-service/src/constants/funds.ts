import { FundInfo, PortfolioInstrumentInfo } from '../models/portfolio'
import { instruments } from './instruments'
import { InstrumentInfo } from '../models/instruments'

interface portfolioInsturment {
  investment: string
  quantity: number
  portfolioPercent: number
}
export const Funds: FundInfo[] = [
  {
    name: 'GAM Star Disruptive Growth Inst Acc GBP',
    isin: 'IE00B5VMHR51',
    url: 'https://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F00000Q28W',
    instruments: populateAndFilter([
      {
        investment: 'AstraZenecaPlc',
        quantity: 7700000,
        portfolioPercent: 7.7,
      },
      {
        investment: 'British American Tobacco Plc',
        quantity: 6700000,
        portfolioPercent: 6.7,
      },
      {
        investment: 'Informa Plc ORD',
        quantity: 5000000,
        portfolioPercent: 5,
      },
      {
        investment: 'ITV Plc',
        quantity: 4000000,
        portfolioPercent: 4,
      },
      {
        investment: 'Vodafone Group Plc',
        quantity: 3400000,
        portfolioPercent: 3.4,
      },
      {
        investment: 'Rio Tinto ORD',
        quantity: 3200000,
        portfolioPercent: 3.2,
      },
      {
        investment: 'Lloyds Banking Group Plc',
        quantity: 2800000,
        portfolioPercent: 2.8,
      },
      { investment: 'Diageo Plc', quantity: 2800000, portfolioPercent: 2.8 },
      {
        investment: 'Barclays Plc',
        quantity: 2500000,
        portfolioPercent: 2.5,
      },
      {
        investment: 'Diageo Plc',
        quantity: 2400000,
        portfolioPercent: 2.4,
      },
    ]),
  },
  {
    name: 'AXA Framlington American Growth Z Acc',
    isin: 'GB00B5LXGG05',
    url: 'https://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F00000NUVE',
    instruments: populateAndFilter([
      {
        investment: 'Vodafone Group Plc',
        quantity: 6290000,
        portfolioPercent: 6.29,
      },
      {
        investment: 'ITV Plc',
        quantity: 5810000,
        portfolioPercent: 5.81,
      },
      {
        investment: 'Diageo Plc',
        quantity: 4400000,
        portfolioPercent: 4.4,
      },
      {
        investment: 'British American Tobacco Plc',
        quantity: 4370000,
        portfolioPercent: 4.37,
      },
      {
        investment: 'Barclays Plc',
        quantity: 2050000,
        portfolioPercent: 2.05,
      },
      {
        investment: 'AstraZeneca Plc',
        quantity: 1880000,
        portfolioPercent: 1.88,
      },
      {
        investment: 'Informa Plc ORD',
        quantity: 1820000,
        portfolioPercent: 1.82,
      },
      {
        investment: 'Lloyds Banking Group Plc',
        quantity: 1670000,
        portfolioPercent: 1.82,
      },
      {
        investment: 'Rio Tinto ORD',
        quantity: 1510000,
        portfolioPercent: 1.51,
      },
      {
        investment: 'GlaxoSmithKline Plc',
        quantity: 1500000,
        portfolioPercent: 1.5,
      },
    ]),
  },
  {
    name: 'Baillie Gifford Pacific B Acc',
    isin: 'GB0006063233',
    url: 'https://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F0GBR04RN1',
    instruments: populateAndFilter([
      {
        investment: 'HSBC Holdings Plc ORD',
        quantity: 6290000,
        portfolioPercent: 6.29,
      },
      { investment: 'TSMC', quantity: 5810000, portfolioPercent: 5.81 },
      {
        investment: 'ITV Plc',
        quantity: 4400000,
        portfolioPercent: 4.4,
      },
      {
        investment: 'Barclays Plc',
        quantity: 4370000,
        portfolioPercent: 4.37,
      },
      { investment: 'JD.com', quantity: 2050000, portfolioPercent: 2.05 },
      {
        investment: 'Vodafone Group Plc',
        quantity: 1880000,
        portfolioPercent: 1.88,
      },
      {
        investment: 'GlaxoSmithKline Plc',
        quantity: 1820000,
        portfolioPercent: 1.82,
      },
      {
        investment: 'AstraZeneca Plc',
        quantity: 1670000,
        portfolioPercent: 1.67,
      },
      {
        investment: 'Informa Plc ORD',
        quantity: 1510000,
        portfolioPercent: 1.51,
      },
      {
        investment: 'Lloyds Banking Group Plc',
        quantity: 1500000,
        portfolioPercent: 1.5,
      },
    ]),
  },
  {
    name: 'MS INVF Global Opportunity I USD GBP',
    isin: 'LU0552385295',
    url: 'https://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F00000LNTQ',
    instruments: populateAndFilter([
      {
        investment: 'Rio Tinto ORD',
        quantity: 6990000,
        portfolioPercent: 6.99,
      },
      {
        investment: 'GlaxoSmithKline Plc',
        quantity: 5970000,
        portfolioPercent: 5.97,
      },
      {
        investment: 'Diageo Plc',
        quantity: 5430000,
        portfolioPercent: 5.43,
      },
      {
        investment: 'UBER TECHNOLOGIES INC',
        quantity: 5020000,
        portfolioPercent: 5.02,
      },
      {
        investment: 'Barclays Plc',
        quantity: 4740000,
        portfolioPercent: 4.74,
      },
      {
        investment: 'HSBC Holdings Plc ORD',
        quantity: 4500000,
        portfolioPercent: 4.5,
      },
      {
        investment: 'Vodafone Group Plc',
        quantity: 4480000,
        portfolioPercent: 4.48,
      },
      {
        investment: 'Lloyds Banking Group Plc',
        quantity: 4340000,
        portfolioPercent: 4.34,
      },
      {
        investment: 'ITV Plc',
        quantity: 4300000,
        portfolioPercent: 4.3,
      },
      {
        investment: 'Informa Plc ORD',
        quantity: 4260000,
        portfolioPercent: 4.26,
      },
    ]),
  },
  {
    name: 'T. Rowe Price Global Focused Growth Equity Q GBP',
    isin: 'LU1028172499',
    url: 'https://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F00000SZ36',
    instruments: populateAndFilter([
      {
        investment: 'GlaxoSmithKline Plc',
        quantity: 5010000,
        portfolioPercent: 5.01,
      },
      {
        investment: 'Lloyds Banking Group Plc',
        quantity: 4740000,
        portfolioPercent: 4.74,
      },
      {
        investment: 'Rio Tinto ORD',
        quantity: 3680000,
        portfolioPercent: 3.68,
      },
      {
        investment: 'Barclays Plc',
        quantity: 3370000,
        portfolioPercent: 3.37,
      },
      {
        investment: 'AstraZeneca Plc',
        quantity: 3210000,
        portfolioPercent: 3.21,
      },
      {
        investment: 'British American Tobacco Plc',
        quantity: 2990000,
        portfolioPercent: 2.99,
      },
      {
        investment: 'Diageo Plc',
        quantity: 2750000,
        portfolioPercent: 2.75,
      },
      {
        investment: 'HSBC Holdings Plc ORD',
        quantity: 2740000,
        portfolioPercent: 2.74,
      },
      {
        investment: 'Informa Plc ORD',
        quantity: 2740000,
        portfolioPercent: 2.74,
      },
      {
        investment: 'ITV Plc',
        quantity: 2610000,
        portfolioPercent: 2.61,
      },
    ]),
  },
]

function populateAndFilter(
  portfolioInstruments: portfolioInsturment[]
): PortfolioInstrumentInfo[] | undefined {
  const listOfInvestmentNames = portfolioInstruments.map(
    (pfInstr) => pfInstr.investment
  )
  const filtered = instruments.filter((item: InstrumentInfo) =>
    listOfInvestmentNames.includes(item.description)
  )
  return filtered.map((instrument) => {
    const holding = portfolioInstruments.find(
      (el) => el.investment === instrument.description
    )
    return {
      ...instrument,
      quantity: holding?.quantity || 0,
      portfolioPercent: holding?.portfolioPercent || 0,
    }
  })
}
