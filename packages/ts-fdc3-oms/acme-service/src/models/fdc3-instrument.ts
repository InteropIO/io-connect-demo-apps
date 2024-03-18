export interface Fdc3Instrument {
    type: 'fdc3.instrument';
    name?: string;
    id?: {
        ticker?: string
        BBG?: string
        CUSIP?: string
        FDS_ID?: string
        FIGI?: string
        ISIN?: string
        PERMID?: string
        RIC?: string
        SEDOL?: string
        [key: string]: unknown
    }
}

export interface Fdc3InstrumentList {
    type: "fdc3.instrumentList";
    name?: string
    id?: {watchlistId?: string, [key: string]: unknown}
    instruments: Fdc3Instrument[];
}