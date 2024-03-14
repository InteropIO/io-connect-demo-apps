import { ValueGetterParams } from 'ag-grid-enterprise'
import { InstrumentIdInternal } from '../models/orders'
import { formatInstrument } from './util'

export const vgetterInstrument = (params: ValueGetterParams): string => {
    if (!params.data) {
        return ''
    }

    const instr: InstrumentIdInternal = params.data.instrument
    return formatInstrument(instr.ticker || 'UKW', instr.bbgExchange || 'UKW')
}
