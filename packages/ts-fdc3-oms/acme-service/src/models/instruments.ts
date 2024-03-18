export interface InstrumentInfo {
    bbgCode: string
    isin: string
    currency: string
    description: string
    price: {
        close: number
        yearLow?: number
        yearHigh?: number
    }
    volume: {
        average?: number
    }
}