import CreatableSelect from 'react-select/creatable'
import { Col } from 'reactstrap'

import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import '@glue42/theme/dist/packages/rc-rdt.css'

import '../css/select-control.css'

import { useClients } from '../hooks/useClients'
import { useInstruments } from '../hooks/useInstruments'
import { formatInstrument } from '../util/util'
import { DateStartOfDay } from '../util/datetime'
import { InstrumentIdInternal } from '../models/orders'

export interface OrderFiltersProps {
    fromDate: Date
    setFromDate: (date: Date) => void
    toDate: Date
    setToDate: (date: Date) => void
    clientId: string
    setClientId: (accountId: string) => void
    securityId?: { bbgExchange: string; ticker: string }
    setSecurityId: (instrumentId?: InstrumentIdInternal) => void
}

interface ComboOption {
    value: string
    label: string
    meta?: { ticker: string; bbgExchange: string }
}

const today = DateStartOfDay(new Date())

function isDateInThePast(currentDate: any): boolean {
    return currentDate?.isBefore(today)
}

const customStyles = {
    menu: (styles: any) => {
        return {
            ...styles,
            minWidth: '6rem',
        }
    },
    menuList: (styles: any) => {
        return {
            ...styles,
            maxHeight: 150,
        }
    },
}

const OrderFilters = (props: OrderFiltersProps): JSX.Element => {
    const clients = useClients()
    const instruments = useInstruments()

    const clientOptions: ComboOption[] = clients
        ? Object.entries(clients)
              .map(([, val]) => ({
                  value: val.clientId,
                  label: val.clientId,
              }))
        : []
    clientOptions.unshift({
        value: '',
        label: '* ALL',
    })

    const securityOptions: ComboOption[] = instruments
        ? Object.entries(instruments)
              .map(([, { ticker, bbgExchange }]) => ({
                  value: formatInstrument(ticker, bbgExchange),
                  label: formatInstrument(ticker, bbgExchange),
                  meta: {
                      ticker,
                      bbgExchange,
                  },
              }))
              .sort((a, b) => (a.value < b.value ? -1 : 1))
        : []

    securityOptions.unshift({
        value: '',
        label: '* ALL',
        meta: {
            ticker: '',
            bbgExchange: '',
        },
    })

    let selectedClient = clientOptions.find(
        (opt) => opt.value === props?.clientId
    )
    if (!selectedClient) {
        if (props?.clientId) {
            selectedClient = {
                label: props.clientId,
                value: props.clientId,
            }
        } else {
            selectedClient = null as any
        }
    }

    let selectedSecurity = securityOptions.find(
        (opt) =>
            opt.meta?.ticker === props?.securityId?.ticker &&
            opt.meta?.bbgExchange === props?.securityId?.bbgExchange
    )

    if (!selectedSecurity) {
        if (props?.securityId) {
            selectedSecurity = {
                label:
                    props.securityId?.ticker +
                    ' ' +
                    props.securityId?.bbgExchange,
                value:
                    props.securityId?.ticker +
                    ' ' +
                    props.securityId?.bbgExchange,
                meta: props.securityId,
            }
        } else {
            selectedSecurity = {
                value: '',
                label: '* ALL',
            }
        }
    }

    return (
        <div className="d-flex align-items-baseline justify-content-between">
            <div className="d-flex align-items-center">
                <span>From&nbsp;</span>
                <Datetime
                    value={props.fromDate}
                    onChange={(date) =>
                        props.setFromDate(new Date(date.valueOf()))
                    }
                    dateFormat={'YYYY-MM-DD'}
                    timeFormat={false}
                    closeOnSelect={true}
                    inputProps={{
                        style: {
                            width: '5rem',
                            height: '2rem',
                            padding: '0 1px',
                            textAlign: 'center',
                        },
                        placeholder: 'from',
                        readOnly: true,
                    }}
                    isValidDate={isDateInThePast}
                />
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span>To&nbsp;</span>
                <Datetime
                    value={props.toDate}
                    onChange={(date) =>
                        props.setToDate(new Date(date.valueOf()))
                    }
                    dateFormat={'YYYY-MM-DD'}
                    timeFormat={false}
                    closeOnSelect={true}
                    inputProps={{
                        style: {
                            width: '5rem',
                            height: '2rem',
                            padding: '0 1px',
                            textAlign: 'center',
                        },
                        placeholder: 'from',
                        readOnly: true,
                    }}
                    isValidDate={isDateInThePast}
                />
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span>Client&nbsp;</span>
                <Col style={{ width: '5rem', padding: '0' }}>
                    <CreatableSelect
                        classNamePrefix="select"
                        className="select-minpadding"
                        //id={"clientId"} name={"clientId"}
                        value={selectedClient}
                        options={clientOptions}
                        onChange={(opt) => props.setClientId(opt?.value || '')}
                        styles={customStyles}
                    />
                </Col>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span>Security&nbsp;</span>
                <Col style={{ width: '6rem', padding: '0' }}>
                    <CreatableSelect
                        classNamePrefix="select"
                        className="select-minpadding"
                        //id={"securityId"} name={"securityId"}
                        value={selectedSecurity}
                        options={securityOptions}
                        onChange={(opt) => props.setSecurityId(opt?.meta)}
                        styles={customStyles}
                    />
                </Col>
            </div>
        </div>
    )
}

export default OrderFilters
