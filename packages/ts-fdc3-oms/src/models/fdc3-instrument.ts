export interface Fdc3InstrumentId {
    ticker?: string
    BBG?: string
    BBG_EXCHANGE?: string
    CUSIP?: string
    FDS_ID?: string
    FIGI?: string
    ISIN?: string
    PERMID?: string
    RIC?: string
    SEDOL?: string
    [key: string]: unknown
}

export interface Fdc3Instrument {
    type: 'fdc3.instrument'
    name?: string
    id?: Fdc3InstrumentId
}

export interface Fdc3InstrumentList {
    type: 'fdc3.instrumentList'
    name?: string
    id?: { watchlistId?: string; [key: string]: unknown }
    instruments: Fdc3Instrument[]
}
