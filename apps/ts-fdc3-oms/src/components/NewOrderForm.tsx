import { useCallback, useEffect, useState, useContext, useMemo } from 'react'
import { Row, Col, Form, FormGroup, Button, Label, Input } from 'reactstrap'
import '@glue42/theme/dist/packages/rc-select.css'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import '../css/NewOrderForm.css'
import '../css/Grids.css'

import 'react-datetime/css/react-datetime.css'
import '@glue42/theme/dist/packages/rc-rdt.css'
import { OrderInfo } from '../models/orders'
import { Fdc3Order } from '../models/fdc3-order'
import { GlueContext } from '@glue42/react-hooks'
import { METHODNAME_CREATE_ORDER } from '../constants/methods'
import { useInstruments } from '../hooks/useInstruments'
import { useOrderTypes } from '../hooks/useOrderTypes'
import { useOrderValidity } from '../hooks/useOrderValidity'
import { useOrderSides } from '../hooks/useOrderSides'
import { useClients } from '../hooks/useClients'
import { formatInstrument, getExchange, getTicker } from '../util/util'
import Validation from './Validation'
import { ClientInfo } from '../models/clients'
import { ACME_SETTINGS_CONTEXT_NAME } from '../constants/settings'
import { AcmeSettingsContext } from '../models/acmeSettings'

const convertFdc3OrderToOmsOrder = (
    fOrder: Fdc3Order,
    clients: ClientInfo[]
): OrderInfo => {
    console.log('ORDER:', fOrder)
    const client = clients.find((c) => c.email === fOrder?.contact?.id?.email)

    const clientId = client ? client.clientId : fOrder?.contact?.name

    const order: OrderInfo = {
        side: fOrder?.side as any,
        quantity: fOrder?.quantity as any,
        orderType: fOrder?.orderType as any,
        limitPrice: isLimitPriceEnabled(fOrder?.orderType || '')
            ? (fOrder?.limitPrice as any)
            : null,
        timeInForce: fOrder?.timeInForce as any,
        expireTime: fOrder?.expireTime
            ? new Date(fOrder.expireTime)
            : undefined,
        comments: fOrder?.notes as any,
        instrument: {
            ticker: getTicker(fOrder?.instrument?.id)?.toUpperCase(),
            bbgExchange: getExchange(fOrder?.instrument?.id)?.toUpperCase(),
        },
        clientId: clientId || '',
        // dummy values follow
        orderId: 0,
        dateCreated: new Date(),
        quantityFilled: 0,
        averagePrice: 0,
        currency: 'GBX',
        tradeStatus: '',
        brokerId: '',
    }

    return order
}

const isValidInteger = (myInt: string) => {
    return parseInt(myInt?.trim(), 10)?.toString() === myInt?.trim()
}

const getIntegerBorderClass = (myInt: string) => {
    if (!myInt) return ''
    if (!isValidInteger(myInt) || myInt === '0') return 'border-danger'
    return ''
}

const isLimitPriceEnabled = (orderType: string) => {
    if (
        !orderType ||
        orderType === '1' // market
    ) {
        return false
    }
    return true
}

const isExpireTimeEnabled = (timeInForce: string) => {
    if (
        !timeInForce ||
        timeInForce === '0' || // DAY
        timeInForce === '1' || // GTC
        timeInForce === '3' || // IOC
        timeInForce === '4' // FOK
    ) {
        return false
    }
    return true
}

interface ComboOption {
    value: string
    label: string
    meta?: any
}

const NewOrderForm = (props: NewOrderFormProps): JSX.Element => {
    console.log('NewOrderForm()')
    //const [,setRNUM] = useState(0)
    const [selectedSide, setSelectedSide] = useState<ComboOption>(null as any)
    const [quantity, setQuantity] = useState('')
    const [selectedSecurity, setSelectedSecurity] = useState<ComboOption>(
        null as any
    )
    const [clientId, setClientId] = useState<ComboOption | undefined>()
    const [selectedOrderType, setSelectedOrderType] = useState<ComboOption>(
        null as any
    )
    const [limitPrice, setLimitPrice] = useState('')
    const [selectedValidity, setSelectedValidity] = useState<ComboOption>(
        null as any
    )
    const [expireTime, setExpireTime] = useState<Date | undefined>(undefined)
    const [comments, setComments] = useState('')
    const [showValidation, setShowValidation] = useState(false)
    const instruments = useInstruments()
    const orderTypes = useOrderTypes()
    const orderValidity = useOrderValidity()
    const orderSides = useOrderSides()
    const clients = useClients()

    const securityIdOptions: ComboOption[] = useMemo(() => {
        return instruments
            ? instruments
                  .map(({ ticker, bbgExchange }) => ({
                      value: formatInstrument(ticker, bbgExchange),
                      label: formatInstrument(ticker, bbgExchange),
                      meta: {
                          ticker,
                          bbgExchange,
                      },
                  }))
                  .sort((a, b) => (a.value < b.value ? -1 : 1))
            : []
    }, [instruments])

    const orderTypeOptions: ComboOption[] = useMemo(() => {
        console.log(orderTypes)
        return orderTypes
            ? Object.entries(orderTypes)
                  .filter(([, val]) => (val as any).enabled)
                  .map(([key, val]) => ({
                      value: key,
                      label: (val as any).displayName,
                  }))
            : []
    }, [orderTypes])

    const validityOptions: ComboOption[] = useMemo(() => {
        return orderValidity
            ? Object.entries(orderValidity)
                  .filter(([, val]) => (val as any).enabled)
                  .map(([key, val]) => ({
                      value: key,
                      label: (val as any).displayName,
                  }))
            : []
    }, [orderValidity])

    const sideOptions: ComboOption[] = useMemo(() => {
        return orderSides
            ? Object.entries(orderSides)
                  .filter(([, val]) => val.enabled)
                  .map(([key, val]) => ({
                      value: key,
                      label: val.displayName,
                  }))
            : []
    }, [orderSides])

    const clientOptions: ComboOption[] = useMemo(
        () =>
            clients
                ? clients.map(({ clientId }) => ({
                      value: clientId,
                      label: clientId,
                  }))
                : [],
        [clients]
    )

    const glue = useContext(GlueContext)

    const setFromOrderInfo = useCallback(
        (info: OrderInfo | undefined) => {
            setSelectedSide(
                (sideOptions?.find((opt) => opt.value === info?.side) ||
                    null) as ComboOption
            )

            setQuantity(info?.quantity?.toString() || '')

            const foundSecurity = securityIdOptions?.find((opt) => {
                return opt.meta.ticker === info?.instrument?.ticker
            })

            if (foundSecurity) {
                setSelectedSecurity(foundSecurity)
            } else if (info?.instrument) {
                setSelectedSecurity({
                    label: formatInstrument(
                        info.instrument.ticker,
                        info.instrument.bbgExchange
                    ),
                    value: formatInstrument(
                        info.instrument.ticker,
                        info.instrument.bbgExchange
                    ),
                    meta: info.instrument,
                })
            } else {
                setSelectedSecurity(null as any)
            }

            if (info?.clientId) {
                setClientId({
                    label: info?.clientId,
                    value: info?.clientId,
                })
            }

            setSelectedOrderType(
                orderTypeOptions.find((opt) => opt.value === info?.orderType) ||
                    (orderTypeOptions.find((opt) => opt.value === '1') as any) // default to market order
            )

            setLimitPrice(info?.limitPrice?.toString() || '')

            setSelectedValidity(
                validityOptions.find(
                    (opt) => opt.value === info?.timeInForce
                ) || (validityOptions.find((opt) => opt.value === '0') as any) // default to day
                // null) as ComboOption
            )

            setExpireTime(
                info?.expireTime ||
                    //|| DateEndOfDay(new Date())
                    undefined
            )

            setComments(info?.comments || '')
        },
        [sideOptions, securityIdOptions, orderTypeOptions, validityOptions]
    )

    const setFromFdc3Order = useCallback(
        (order: Fdc3Order) => {
            setFromOrderInfo(convertFdc3OrderToOmsOrder(order, clients))
        },
        [setFromOrderInfo, clients]
    )

    useEffect(() => {
        console.log('useEffect()', props.intentOrder)
        setFromFdc3Order(props.intentOrder as Fdc3Order)
    }, [props.intentOrder, setFromFdc3Order])

    useEffect(() => {
        if (limitPrice && !isLimitPriceEnabled(selectedOrderType.value)) {
            setLimitPrice('')
        }
    }, [selectedOrderType, limitPrice])

    const getOrderInfo = async (): Promise<OrderInfo> => {
        const acmeSettings: AcmeSettingsContext = await glue?.contexts.get(
            ACME_SETTINGS_CONTEXT_NAME
        )
        const dateCreated = new Date(
            Date.now() + (acmeSettings.mockTimeOffset || 0)
        )
        const result: OrderInfo = {
            side: selectedSide?.value,
            quantity: parseInt(quantity, 10),
            orderType: selectedOrderType?.value,
            limitPrice: parseFloat(limitPrice),
            timeInForce: selectedValidity?.value,
            expireTime,
            comments,
            instrument: selectedSecurity?.meta,
            clientId: clientId?.value ?? '',
            // dummy values follow
            orderId: 0,
            dateCreated,
            quantityFilled: 0,
            averagePrice: 0,
            currency: 'GBX',
            tradeStatus: '',
            brokerId: '',
        }
        return result
    }

    const getValidationMessage = (): JSX.Element | null => {
        const messages: string[] = []
        if (!selectedSide?.value) {
            messages.push('Trade side not selected')
        }
        if (!isValidInteger(quantity) || quantity === '0') {
            messages.push('Quantity is invalid')
        }
        if (!selectedSecurity?.value) {
            messages.push('Security Id missing')
        }
        if (!clientId) {
            messages.push('Client Id missing')
        }
        if (!selectedOrderType?.value) {
            messages.push('Order type not selected')
        }
        if (
            isLimitPriceEnabled(selectedOrderType?.value) &&
            (!limitPrice || !isValidInteger(limitPrice))
        ) {
            messages.push('Limit price missing')
        }

        if (!selectedValidity?.value) {
            messages.push('Order validity not specified')
        }
        if (isExpireTimeEnabled(selectedValidity?.value) && !expireTime) {
            messages.push('Expire date/time not specified')
        }

        if (messages.length === 0) {
            return null
        }
        return (
            <Validation
                messages={messages}
                onClose={() => setShowValidation(false)}
            ></Validation>
        )
    }

    const onSave = async () => {
        const vMessage = getValidationMessage()
        if (vMessage) {
            setShowValidation(true)
            return
        }
        const order = await getOrderInfo()
        glue?.interop.invoke(METHODNAME_CREATE_ORDER, { order })
        props.onComplete?.({ action: 'save' })
    }

    const onCancel = () => {
        props.onComplete?.({ action: 'cancel' })
    }

    const limitPriceEnabled = isLimitPriceEnabled(selectedOrderType?.value)
    const limitPriceClassName = limitPriceEnabled
        ? getIntegerBorderClass(limitPrice)
        : ''

    const form: JSX.Element = (
        <Form className="">
            <Row>
                <Col className="nof-control-column">
                    <FormGroup className="d-flex align-items-baseline mt-1">
                        <Label className="mr-3">Side</Label>
                        <Button
                            className="mr-1"
                            style={{ position: 'relative' }}
                            onClick={() => {
                                setSelectedSide(
                                    sideOptions.find(
                                        (opt) => opt.value === '1'
                                    ) || (null as any)
                                )
                            }}
                        >
                            B
                            <div className="og-cell-side og-cell-buy" />
                        </Button>
                        <Button
                            className="mr-1"
                            style={{ position: 'relative' }}
                            onClick={() => {
                                setSelectedSide(
                                    sideOptions.find(
                                        (opt) => opt.value === '2'
                                    ) || (null as any)
                                )
                            }}
                        >
                            S
                            <div className="og-cell-side og-cell-sell" />
                        </Button>
                        <Select
                            classNamePrefix="select"
                            className="flex-grow-1"
                            id={'side'}
                            name={'side'}
                            value={selectedSide}
                            options={sideOptions}
                            onChange={(event) => setSelectedSide(event as any)}
                        />
                    </FormGroup>
                    <Row className="align-items-baseline mt-1">
                        <Label className="nof-label col-xs-4 col-2 mr-3">
                            Quantity
                        </Label>
                        <Col className="ml-3">
                            <Input
                                type="text"
                                className={getIntegerBorderClass(quantity)}
                                id={'quantity'}
                                name={'quantity'}
                                autoComplete={'off'}
                                value={quantity}
                                onChange={(event) =>
                                    setQuantity(event.target.value)
                                }
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-baseline mt-1">
                        <Label className="nof-label col-2 mr-3">
                            Security&nbsp;Id
                        </Label>
                        <Col className="ml-3">
                            <CreatableSelect
                                classNamePrefix="select"
                                id={'securityId'}
                                name={'securityId'}
                                value={selectedSecurity}
                                options={securityIdOptions}
                                onChange={(event) =>
                                    setSelectedSecurity(event as any)
                                }
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-baseline mt-1">
                        <Label className="nof-label col-2 mr-3">
                            Client&nbsp;Id
                        </Label>
                        <Col className="ml-3">
                            <Select
                                classNamePrefix="select"
                                id="clientId"
                                name="clientId"
                                value={clientId}
                                options={clientOptions}
                                onChange={(event) => {
                                    setClientId(event as ComboOption)
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col className="nof-control-column">
                    <Row className="align-items-baseline mt-1">
                        <Label className="nof-label col-2 mr-3">
                            Order&nbsp;Type
                        </Label>
                        <Col className="ml-3">
                            <Select
                                classNamePrefix="select"
                                id={'orderType'}
                                name={'orderType'}
                                value={selectedOrderType}
                                options={orderTypeOptions}
                                onChange={(event) =>
                                    setSelectedOrderType(event as any)
                                }
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-baseline mt-1">
                        <Label
                            className={
                                'nof-label col-2 mr-3 ' +
                                (limitPriceEnabled ? '' : ' nof-label-disabled')
                            }
                        >
                            Limit&nbsp;Price
                        </Label>
                        <Col className="ml-3">
                            <Input
                                className={limitPriceClassName}
                                type="text"
                                disabled={!limitPriceEnabled}
                                id={'price'}
                                name={'price'}
                                autoComplete={'off'}
                                value={limitPrice}
                                onChange={(event) =>
                                    setLimitPrice(event.target.value)
                                }
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-baseline mt-1">
                        <Label className="nof-label col-2 mr-3">Validity</Label>
                        <Col className="ml-3">
                            <Select
                                classNamePrefix="select"
                                id={'timeInForce'}
                                name={'timeInForce'}
                                value={selectedValidity}
                                options={validityOptions}
                                onChange={(event) =>
                                    setSelectedValidity(event as any)
                                }
                            />
                        </Col>
                    </Row>
                    {/* <Row className="align-items-baseline mt-1">
                        <Label
                            className={
                                'nof-label' +
                                (expireTimeEnabled ? '' : ' nof-label-disabled')
                            }
                        >
                            Expire&nbsp;Time
                        </Label>
                        <Col>
                            <Datetime
                                value={expireTime}
                                dateFormat={
                                    expireTimeEnabled
                                        ? expireTime
                                            ? 'YYYY-MM-DD'
                                            : '[Click to select]'
                                        : '[]'
                                }
                                timeFormat={
                                    expireTimeEnabled && expireTime
                                        ? 'HH:mm:ss'
                                        : '[]'
                                }
                                closeOnSelect={true}
                                inputProps={{
                                    style: {},
                                    disabled: !expireTimeEnabled,
                                    placeholder: expireTimeEnabled
                                        ? 'Click to select'
                                        : '',
                                    readOnly: true,
                                }}
                                onChange={(date) =>
                                    setExpireTime(new Date(date.valueOf()))
                                }
                            />
                        </Col>
                    </Row> */}
                </Col>
            </Row>
            <Row>&nbsp;</Row>
            <Row>
                <Label className="nof-label col-1 mr-3">
                    Additional Instructions
                </Label>
                <Col className="ml-3">
                    <Input
                        type="textarea"
                        className="nof-textarea"
                        rows={2}
                        resize={'vertical'}
                        id={'comments'}
                        name={'comments'}
                        value={comments}
                        onChange={(event) => setComments(event.target.value)}
                    />
                </Col>
            </Row>
            {showValidation ? getValidationMessage() : null}
            <Row>&nbsp;</Row>
            <Row className="d-flex justify-content-center">
                <Button className="col-2 mr-2" onClick={onSave}>
                    Send
                </Button>
                {/* <div className='col-1'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> */}
                <Button className="col-2 mr-2" onClick={onCancel}>
                    Cancel
                </Button>
                {/* <div className='col-1'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> */}
                <Button
                    className="col-2"
                    onClick={() => setFromOrderInfo({} as any)}
                >
                    Clear
                </Button>
            </Row>
        </Form>
    )

    return form
}
export default NewOrderForm

export interface NewOrderFormResult {
    action: 'save' | 'cancel'
}

export interface NewOrderFormProps {
    intentOrder?: Fdc3Order
    onComplete?: (result: NewOrderFormResult) => void
}
