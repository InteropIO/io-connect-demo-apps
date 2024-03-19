import { useEffect, useState, useContext, useReducer } from 'react'
import { Row, Col, Form, FormGroup, Button, Label, Input } from 'reactstrap'
import '@glue42/theme/dist/packages/rc-select.css'
import Select from 'react-select'
import '../../css/NewOrderForm.css'

import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import '@glue42/theme/dist/packages/rc-rdt.css'
import { OrderTrade } from '../../models/orders'
import { GlueContext } from '@glue42/react-hooks'
import { METHODNAME_CREATE_TRADE } from '../../constants/methods'
import Validation from '../Validation'
import { Fdc3Trade } from '../../models/fdc3-trade'
import {
    useConvertFdc3TradeToOmsTrade,
    useOrder,
    useOrders,
} from './hooks/hooks'
import { tradeReducerActions } from './constants/actionTypes'
import { useBrokers } from '../../hooks/useBrokers'
import { useOrderSides } from '../../hooks/useOrderSides'
import { formatInstrument } from '../../util/util'

const isValidInteger = (myInt: string) => {
    return parseInt(myInt?.trim(), 10)?.toString() === myInt?.trim()
}

const getIntegerBorderClass = (myInt: string) => {
    if (!myInt) return ''
    if (!isValidInteger(myInt) || myInt === '0') return 'border-danger'
    return ''
}

const selectStyles = {
    menuList: (styles: any) => {
        return {
            ...styles,
            maxHeight: 150,
        }
    },
}

const getOrdersOptions: any = (orders: any) => {
    const ordersOptions = orders
        .map((order: any) => ({
            value: order.orderId,
            label: order.orderId,
        }))
        .sort((a: any, b: any) => (a.value < b.value ? -1 : 1))

    return ordersOptions
}

const getSliceOptions: any = (orders: any) => {
    const ordersOptions = orders
        .map((order: any) => ({
            value: order.sliceId,
            label: order.sliceId,
        }))
        .sort((a: any, b: any) => (a.value < b.value ? -1 : 1))

    return ordersOptions
}

const getSideDisplayValue = (orderSides: any, sliceKey: any): string => {
    let result = ''

    if (sliceKey) {
        const slice = Object.entries(orderSides).find(
            ([key]) => key === sliceKey
        )

        if (slice) {
            result = (slice[1] as any)?.displayName
        }
    }

    return result
}

const tradeReducer = (state: any, action: any) => {
    switch (action.type) {
        case tradeReducerActions.CLEAR_TRADE:
            return getDefaultTrade()
        case tradeReducerActions.SET_TRADE:
            return {
                ...state,
                ...action.payload,
            }
        case tradeReducerActions.SET_ORDER_ID:
            return {
                ...state,
                orderId: action.payload.orderId,
                sliceId: 0,
            }
        case tradeReducerActions.SET_SLICE_ID:
            return {
                ...state,
                sliceId: action.payload.sliceId,
            }
        case tradeReducerActions.SET_QUANTITY:
            return {
                ...state,
                quantity: action.payload.quantity,
            }
        case tradeReducerActions.SET_PRICE:
            return {
                ...state,
                price: action.payload.price,
            }
        case tradeReducerActions.SET_TIMESTAMP:
            return {
                ...state,
                timestamp: action.payload.timestamp,
            }
        case tradeReducerActions.SET_BROKER:
            return {
                ...state,
                execBroker: action.payload.execBroker,
                exchange: action.payload.exchange,
            }
        case tradeReducerActions.SET_COMMENTS:
            return {
                ...state,
                comments: action.payload.comments,
            }
        default: {
            return state
        }
    }
}

const getDefaultTrade = () => {
    return {
        orderId: 0,
        sliceId: 0,
        quantity: '',
        price: '',
        exchange: '',
        execBroker: '',
        comments: '',
    }
}

const getFormValue = (value: any) => {
    return value || ''
}

const currentDate = new Date()

const NewTradeForm = (props: NewTradeFormProps) => {
    console.log('NewTradeForm()')
    const glue = useContext(GlueContext)

    const [trade, dispatchTrade] = useReducer(tradeReducer, getDefaultTrade())
    const [showValidation, setShowValidation] = useState(false)
    const orders = useOrders(currentDate, false, true)
    const [sideDisplayValue, setSideDisplayValue] = useState('')
    const brokers = useBrokers()
    const omsTrade = useConvertFdc3TradeToOmsTrade(props.intentTrade)
    const orderSides = useOrderSides()

    useEffect(() => {
        if (props.intentTrade) {
            dispatchTrade({
                type: tradeReducerActions.SET_TRADE,
                payload: omsTrade,
            })
        }
    }, [omsTrade, props.intentTrade])

    const brokerOptions = brokers
        ? Object.entries(brokers).map(([, val]) => ({
              value: val.brokerExchange,
              label: val.brokerId,
          }))
        : []

    const selectedOrder = useOrder(trade.orderId, currentDate, true)

    const getTradeInfo = (): OrderTrade => {
        const books = ['AGENCY', 'RISK']
        let bookIndex = 0
        if (trade.orderId) {
            bookIndex = trade.orderId % 2
        }

        const result: OrderTrade = {
            orderId: trade.orderId,
            clientId: selectedOrder?.order?.clientId,
            sliceId: trade.sliceId,
            quantity: parseInt(trade.quantity, 10),
            price: parseFloat(trade.price),
            timestamp: trade.timestamp,
            execBroker: trade.execBroker,
            exchange: trade.exchange,
            comments: trade.comments,
            side: selectedOrder?.order?.side || '',
            instrument: {
                ticker: selectedOrder?.order?.instrument.ticker ?? '',
                bbgExchange: selectedOrder?.order?.instrument.bbgExchange ?? '',
            },
            currency: 'GBX',
            bookId: books[bookIndex],
        }

        return result
    }

    const getValidationMessage = (): JSX.Element | null => {
        const messages = []
        if (isNaN(trade.orderId) || trade.orderId === 0) {
            messages.push('Order is invalid')
        }

        if (isNaN(trade.sliceId) || trade.sliceId === 0) {
            messages.push('Slice is invalid')
        }

        if (
            !isValidInteger(trade.quantity?.toString()) ||
            trade.quantity === '0'
        ) {
            messages.push('Quantity is invalid')
        }

        if (!isValidInteger(trade.price?.toString()) || trade.price === '0') {
            messages.push('Price is invalid')
        }

        if (!trade.execBroker) {
            messages.push('Exec broker not selected')
        }

        if (!trade.exchange) {
            messages.push('Exchange not selected')
        }

        if (!trade.timestamp) {
            messages.push('Timestamp not selected')
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

    const onSave = () => {
        const vMessage = getValidationMessage()

        if (vMessage) {
            setShowValidation(true)
            return
        }

        const trade = getTradeInfo()
        glue?.interop.invoke(METHODNAME_CREATE_TRADE, { trade })
        props.onComplete?.({})
    }

    const onCancel = () => {
        props.onComplete?.({})
    }

    const orderOptions = getOrdersOptions(orders.orders)
    const sliceOptions = getSliceOptions(selectedOrder?.slices || [])

    useEffect(() => {
        const side = getSideDisplayValue(orderSides, selectedOrder?.order?.side)

        setSideDisplayValue(side)
    }, [selectedOrder, orderSides])

    const form: JSX.Element = (
        <Form>
            <Row>
                <FormGroup className="col-sm-6 col-md-4">
                    <Label>Order</Label>
                    <Select
                        classNamePrefix="select"
                        className="flex-grow-1"
                        id={'order'}
                        name={'order'}
                        value={{
                            value: getFormValue(trade.orderId),
                            label: getFormValue(trade.orderId),
                        }}
                        options={orderOptions}
                        styles={selectStyles}
                        onChange={(event: any) => {
                            dispatchTrade({
                                type: tradeReducerActions.SET_ORDER_ID,
                                payload: { orderId: event?.value },
                            })
                        }}
                    />
                </FormGroup>
                <FormGroup className="col-sm-6 col-md-4">
                    <Label>Slice</Label>
                    <Select
                        classNamePrefix="select"
                        className="flex-grow-1"
                        id={'slice'}
                        name={'slice'}
                        value={{
                            value: getFormValue(trade.sliceId),
                            label: getFormValue(trade.sliceId),
                        }}
                        options={sliceOptions}
                        onChange={(event: any) => {
                            dispatchTrade({
                                type: tradeReducerActions.SET_SLICE_ID,
                                payload: { sliceId: event?.value },
                            })
                        }}
                    />
                </FormGroup>
                <FormGroup className="col-sm-6 col-md-4">
                    <Label>Security&nbsp;Id</Label>
                    <Input
                        id={'securityId'}
                        name={'securityId'}
                        disabled={true}
                        value={getFormValue(
                            formatInstrument(
                                selectedOrder?.order?.instrument?.ticker || '',
                                selectedOrder?.order?.instrument?.bbgExchange ||
                                    ''
                            )
                        )}
                    />
                </FormGroup>
                <FormGroup className="col-sm-6 col-md-4">
                    <Label>Side</Label>
                    <Input
                        id={'side'}
                        name={'side'}
                        value={sideDisplayValue}
                        disabled={true}
                    />
                </FormGroup>
                <FormGroup className="col-sm-6 col-md-4">
                    <Label>Quantity</Label>
                    <Input
                        type="text"
                        className={getIntegerBorderClass(
                            String(trade.quantity)
                        )}
                        id={'quantity'}
                        name={'quantity'}
                        value={getFormValue(trade.quantity)}
                        onChange={(event) => {
                            dispatchTrade({
                                type: tradeReducerActions.SET_QUANTITY,
                                payload: { quantity: event.target.value },
                            })
                        }}
                    />
                </FormGroup>
                <FormGroup className="col-sm-6 col-md-4">
                    <Label>Price</Label>
                    <Input
                        type="text"
                        className={getIntegerBorderClass(String(trade.price))}
                        id={'price'}
                        name={'price'}
                        autoComplete={'off'}
                        value={getFormValue(trade.price)}
                        onChange={(event) => {
                            dispatchTrade({
                                type: tradeReducerActions.SET_PRICE,
                                payload: { price: event.target.value },
                            })
                        }}
                    />
                </FormGroup>
                <FormGroup className="col-sm-6 col-md-4">
                    <Label>Exec&nbsp;Broker</Label>
                    <Select
                        classNamePrefix="select"
                        className="flex-grow-1"
                        id={'broker'}
                        name={'broker'}
                        value={{
                            value: getFormValue(trade.execBroker),
                            label: getFormValue(trade.execBroker),
                        }}
                        options={brokerOptions}
                        onChange={(event: any) => {
                            dispatchTrade({
                                type: tradeReducerActions.SET_BROKER,
                                payload: {
                                    execBroker: event.label,
                                    exchange: event.value,
                                },
                            })
                        }}
                    />
                </FormGroup>
                <FormGroup className="col-sm-6 col-md-4">
                    <Label>Exchange</Label>
                    <Input
                        id={'exchange'}
                        name={'exchange'}
                        value={getFormValue(trade.exchange)}
                        disabled={true}
                    />
                </FormGroup>
                <FormGroup className="col-sm-6 col-md-4">
                    <Label>Traded&nbsp;Time</Label>
                    <Datetime
                        value={getFormValue(trade.timestamp)}
                        dateFormat={
                            trade.timestamp ? 'YYYY-MM-DD' : '[Click to select]'
                        }
                        timeFormat={trade.timestamp ? 'HH:mm:ss' : '[]'}
                        closeOnSelect={true}
                        inputProps={{
                            style: {},
                            disabled: false,
                            placeholder: 'Click to select',
                            readOnly: false,
                        }}
                        onChange={(date) => {
                            dispatchTrade({
                                type: tradeReducerActions.SET_TIMESTAMP,
                                payload: {
                                    timestamp: new Date(date.valueOf()),
                                },
                            })
                        }}
                    />
                </FormGroup>
            </Row>
            <Row>&nbsp;</Row>
            <Row>
                <Label className="nof-label col-1 mr-3">Additional Instructions</Label>
                <Col>
                    <Input
                        type="textarea"
                        className="nof-textarea"
                        rows={2}
                        resize={'vertical'}
                        id={'comments'}
                        name={'comments'}
                        value={getFormValue(trade.comments)}
                        onChange={(event) => {
                            dispatchTrade({
                                type: tradeReducerActions.SET_COMMENTS,
                                payload: { comments: event.target.value },
                            })
                        }}
                    />
                </Col>
            </Row>
            {showValidation ? getValidationMessage() : null}
            <Row>&nbsp;</Row>
            <Row className="d-flex justify-content-center">
                <Button className='col-2 mr-2'onClick={onSave}>Send</Button>
                <Button className='col-2 mr-2'onClick={onCancel}>Cancel</Button>
                <Button
                    className='col-2'
                    onClick={() => {
                        dispatchTrade({
                            type: tradeReducerActions.CLEAR_TRADE,
                        })
                        setShowValidation(false)
                    }}
                >
                    Clear
                </Button>
            </Row>
        </Form>
    )
    return form
}
export default NewTradeForm

export interface NewTradeFormProps {
    intentTrade?: Fdc3Trade
    onComplete?: (result: unknown) => void
}
