import { InstrumentInfo } from './instruments'

export interface FundInfo {
    name: string
    isin: string
    url: string
    instruments?: PortfolioInstrumentInfo[]
}

export interface PortfolioInstrumentInfo extends InstrumentInfo {
    quantity: number
    portfolioPercent: number
    marketPrice?: number
    value?: number
    cost?: number
    change?: number
    changePercent?: string
}
