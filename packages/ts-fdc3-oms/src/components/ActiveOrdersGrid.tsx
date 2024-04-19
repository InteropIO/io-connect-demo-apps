import React, {
    useState,
    useEffect,
    useContext,
    useRef,
    useCallback,
} from 'react'
import { GlueContext } from '@glue42/react-hooks'
import {
    GetContextMenuItemsParams,
    GetRowIdParams,
    GridApi,
    MenuItemDef,
    RowClassParams,
    RowStyle,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import useGridHelper from '../hooks/GridHelper'
import { OrderFilterEx, OrderInfo, OrderSlice } from '../models/orders'
import { ClientInfo } from '../models/clients'

import 'ag-grid-enterprise'

import 'ag-grid-enterprise/dist/styles/ag-grid.css'
import { Button } from 'reactstrap'
import '../css/Grids.css'

import ChannelSelector from './ChannelSelector'

import {
    columnDefsOrders,
    columnDefsSlices,
    defaultColumnDef,
} from '../constants/grids'
import { Fdc3Order } from '../models/fdc3-order'
import { isGlue42Enterprise, useIntents } from '../util/glue'
import OrderFilters from './OrderFilters'
import { HASH_ORDERS, HASH_ORDER_HISTORY } from '../constants/pageHashes'
import { pushToBbgWorksheet } from '../util/bbg'
import {
    BBG_WORKSHEET_NAME,
    INTENT_VIEW_ORDER_TRADE_HISTORY,
    SF_SYSTEM_NAME,
} from '../constants'
import {
    METHODNAME_ACME_SYNC_CONTACT,
    METHODNAME_PRETRADE_BMLL,
} from '../constants/methods'
import { getRelevantContextNodes } from '../util/ag-grid'
import { triggerPreTradeOrders } from '../util/pretrade'
import { useClients } from '../hooks/useClients'
import useOrders from '../hooks/useOrders'
import { useOrderSides } from '../hooks/useOrderSides'
import { useOrderTypes } from '../hooks/useOrderTypes'
import { useOrderValidity } from '../hooks/useOrderValidity'
import { useMorningStarSync } from '../hooks/useMorningStarSync'
import DateManipulator from './DateManipulator'
import { DateIsSameDay, DateEndOfDay } from '../util/datetime'
import {
    formatInstrumentFromId,
    getFdc3Instrument,
    getTickerFromString,
} from '../util/util'
import { GlueApiT } from '../util/glueTypes'
import useViewInstrument from '../hooks/useViewInstrument'
import useInstrumentDetailsContext from '../hooks/useInstrumentDetailsContext'

export interface OrderGridParam {
    setNewOrderView?: (set: boolean) => void
    historyView?: boolean
    historyFilter?: OrderFilterEx
}

const parseUrl = (url: string) => {
    const result: any = {}
    url.replace(
        /([?&])+([^=?#&]+)(?:=([^?#&]*))?/g,
        function replacer(_, type, key, value) {
            const decodedKey = decodeURIComponent(key)
            const decodedValue = decodeURIComponent(value)
            const capKey = decodedKey[0].toUpperCase() + decodedKey.slice(1)
            result['url' + capKey] = decodedValue
            return ''
        }
    )

    let hash = ''
    const hashMatch = url.match(/#([^?#&]*)/)
    if (hashMatch) {
        hash = decodeURIComponent(hashMatch[1])
    }
    result['urlHash'] = hash
    return result
}
const getOrderRowId = (params: GetRowIdParams<OrderInfo>) =>
    params.data.orderId.toString()
const getOrderSliceRowNodeId = (data: OrderInfo) => data.sliceId?.toString()
const getRowStyle = (params: RowClassParams): RowStyle => {
    const style: React.CSSProperties = {}
    const orderInfo: OrderInfo = params.data
    if (orderInfo.tradeStatus === 'Done') {
        style.opacity = 0.6
    } else {
        style.opacity = 1
    }
    return style as RowStyle
}

const getMockTime = (date: Date, offset: number): Date => {
    return new Date(date.getTime() + offset)
}

const switchHashToOrders = () => {
    window.location.hash = HASH_ORDERS
}

const switchHashToHistory = () => {
    window.location.hash = HASH_ORDER_HISTORY
}

let glue: GlueApiT | undefined = undefined

const ActiveOrdersGrid = (props: OrderGridParam): JSX.Element => {
    const { urlHash, urlFromDate, urlToDate } = parseUrl(window.location.href)
    const historyView = urlHash === HASH_ORDER_HISTORY

    const { getOrders, getOrdersHistory, getOrderSlices } = useOrders()
    const asOfDateRef = useRef<Date>()

    glue = useContext(GlueContext)

    const grid = useGridHelper()
    ;(window as any).grid = grid

    const [rowData, setRowData] = useState<OrderInfo[]>()
    const [time, setTime] = useState(new Date())
    const [timeOffset, setTimeOffset] = useState(0)

    const [filtFromDate, setFiltFromDate] = useState(
        props.historyFilter?.fromDate || new Date()
    )
    const [filtToDate, setFiltToDate] = useState(
        props.historyFilter?.toDate || new Date()
    )
    const [filtClientId, setFiltClientId] = useState(
        props.historyFilter?.clientId || ''
    )
    const [filtSecurityId, setFiltSecurityId] = useState(
        props.historyFilter?.securityId
    )

    const clients = useClients()
    const orderSides = useOrderSides()
    const orderTypes = useOrderTypes()
    const orderValidity = useOrderValidity()
    const intentsApi = useIntents()
    const { syncInstrument } = useMorningStarSync()
    const { publish } = useInstrumentDetailsContext()
    const viewInstrument = useViewInstrument()

    useEffect(() => {
        const handler = () => setTime(new Date())
        window.addEventListener('hashchange', handler)
        return () => window.removeEventListener('hashchange', handler)
    }, [])

    useEffect(() => {
        const myFromDate = new Date(urlFromDate)
        const myToDate = new Date(urlToDate)
        if (!isNaN(myFromDate.getTime())) setFiltFromDate(myFromDate)
        if (!isNaN(myToDate.getTime())) setFiltToDate(myToDate)
    }, [urlFromDate, urlToDate])

    useEffect(() => {
        props.historyFilter?.fromDate &&
            setFiltFromDate(props.historyFilter.fromDate)

        props.historyFilter?.toDate && setFiltToDate(props.historyFilter.toDate)

        props.historyFilter?.clientId != null &&
            setFiltClientId(props.historyFilter.clientId)

        props.historyFilter?.securityId != null &&
            setFiltSecurityId(props.historyFilter.securityId)

        props.historyFilter?.switchView &&
            (window.location.hash = HASH_ORDER_HISTORY)
    }, [props.historyFilter])

    useEffect(() => {
        if (!historyView) {
            glue?.windows.my().setTitle('FDC3 Orders')
            const timer = setInterval(() => {
                setTime(new Date())
            }, 5000)
            return () => clearInterval(timer)
        } else {
            glue?.windows.my().setTitle('FDC3 Order History')
        }
    }, [historyView])

    // Get orders as of some date.
    useEffect(() => {
        if (historyView) return

        const asOfDate = getMockTime(time, timeOffset)
        asOfDateRef.current = asOfDate
        getOrders(asOfDate).then((orders: OrderInfo[]) => setRowData(orders))
    }, [time, timeOffset, historyView, getOrders])

    // Get orders in a range of time when filter changed.
    useEffect(() => {
        if (!historyView) {
            return
        }
        ;(async () => {
            let ordersHistory = await getOrdersHistory({
                from: filtFromDate,
                to: filtToDate,
            })

            if (filtClientId) {
                ordersHistory = ordersHistory.filter(
                    (order: OrderInfo) => order.clientId === filtClientId
                )
            }
            if (filtSecurityId) {
                let re_security: RegExp
                try {
                    re_security = new RegExp('^' + filtSecurityId.ticker, 'i')
                } catch (e) {
                    re_security = new RegExp('not matching')
                }
                ordersHistory = ordersHistory.filter((order: OrderInfo) =>
                    order.instrument.ticker.match(re_security)
                )
            }

            setRowData(ordersHistory)
        })()
    }, [
        filtFromDate,
        filtToDate,
        filtClientId,
        filtSecurityId,
        historyView,
        getOrdersHistory,
    ])

    // TODO - handle selection and delete context handler
    // const onInstrumentReceived = useCallback(
    //     (instrument: string) => {
    //         const ticker = getTickerFromString(instrument)
    //         const selectedNodes = grid?.api?.getSelectedNodes()
    //         if (selectedNodes?.length === 1) {
    //             const node = selectedNodes[0]
    //             if (node.data?.instrument?.ticker !== ticker) {
    //                 node.setSelected(false)
    //             }
    //         }
    //     },
    //     [grid]
    // )

    const onNewOrderClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            ///const myInstance = glue?.interop.instance.instance
            if (e.ctrlKey || !props.setNewOrderView) {
                const order: Fdc3Order = e.shiftKey
                    ? {
                          type: 'fdc3.order',
                          side: '2',
                          contact: {
                              type: 'fdc3.contact',
                              name: 'CNAME',
                              id: {
                                  email: 'a@b.com',
                              },
                          },
                          instrument: {
                              type: 'fdc3.instrument',
                              name: 'instrument name',
                              id: {
                                  ticker: 'DGE',
                                  RIC: 'DGE LN',
                              },
                          },
                          quantity: 123,
                          orderType: '1', // FIX OrdType <40>
                          limitPrice: 42.42, // only valid when orderType is limit
                          timeInForce: '0', // FIX TimeInForce <59>
                          expireTime: '2020-09-01T08:00:00.000Z',
                          //expireTime: undefined as any,
                          notes: 'low touch',
                      }
                    : { type: 'fdc3.order' }

                intentsApi?.raiseIntent(
                    'NewOrder',
                    {
                        type: 'fdc3.order',
                        order,
                    },
                    { appId: 'fdc3-oms-new-order' }
                )
            } else {
                props.setNewOrderView(true)
            }
        },
        [props, intentsApi]
    )

    const onRowDataUpdated = useCallback(
        (params: any) => {
            console.log(params)

            if ((window as any).dummyNonExistent) {
                // disabled
                const rowNode1 = grid.api?.getDisplayedRowAtIndex(4)
                console.log('node1:', rowNode1)
                if (rowNode1) {
                    grid.api?.flashCells({
                        rowNodes: [rowNode1],
                        flashDelay: 200,
                        fadeDelay: 500,
                    })
                }
            }
        },
        [grid]
    )

    const onRowClicked = useCallback(
        (event: { data: OrderInfo; api: GridApi }) => {
            if (event.data == null) {
                return
            }
            // sync BMLL on left click
            const order = event.data

            glue?.interop
                .invoke(
                    METHODNAME_PRETRADE_BMLL,
                    {
                        ticker: formatInstrumentFromId(order.instrument),
                        instruments: [formatInstrumentFromId(order.instrument)],
                    },
                    'all'
                )
                .then((/*result*/) => {
                    console.log('BMLL Vantage left click sync successful')
                })
                .catch((e) => {
                    console.log('BMLL Vantage left click sync failed', e)
                })

            const selectedNodes = event.api.getSelectedNodes()

            if (selectedNodes.length > 1) {
                console.log(
                    'Multiple selection. Will not publish instrument or contact'
                )
                return
            }

            const fdc3Instrument = getFdc3Instrument(event.data.instrument)
            if (fdc3Instrument?.id) {
                publish(fdc3Instrument.id)
            }

            syncInstrument(event.data.instrument.ticker)

            viewInstrument(event.data.instrument)

            const clientId = event.data?.clientId

            const ctx = {
                type: 'fdc3.order',
                id: event.data.orderId,
                createTime: event.data.dateCreated,
            }

            intentsApi?.raiseIntent(
                INTENT_VIEW_ORDER_TRADE_HISTORY,
                {
                    type: ctx.type,
                    order: {
                        id: event.data.orderId,
                        createTime: event.data.dateCreated,
                    },
                },
                { appId: 'fdc3-oms-trade-history' }
            )

            const client = clients?.find(
                (c: ClientInfo) => c.clientId === clientId
            )
            if (client) {
                glue?.interop
                    .invoke(
                        // TODO: Changed to ACME method for conference demos.
                        METHODNAME_ACME_SYNC_CONTACT,
                        {
                            contact: {
                                ids: [
                                    {
                                        systemName: SF_SYSTEM_NAME,
                                        nativeId: client.salesforceId,
                                    },
                                ],
                                emails: [client.email],
                            },
                        },
                        'skipMine'
                    )
                    .catch(console.error)
            }
        },
        [intentsApi, clients, publish, syncInstrument]
    )

    const getContextMenuItems = useCallback(
        (params: GetContextMenuItemsParams): (string | MenuItemDef)[] => {
            const nodes = getRelevantContextNodes(params)
            if (nodes.length <= 0) {
                return []
            }

            const instrumentsToPush = nodes.map(
                ({
                    data: {
                        instrument: { ticker, bbgExchange },
                    },
                }: {
                    data: OrderInfo
                }) => ({
                    ticker,
                    bbgExchange,
                })
            )
            const firstOrder: OrderInfo = nodes[0].data
            const result: MenuItemDef[] = [
                //TODO: Rework trade history intent listener so that it can be passed in multiple orders and display history for them
                {
                    name: 'View Executions',
                    action: function () {
                        intentsApi?.raiseIntent(
                            INTENT_VIEW_ORDER_TRADE_HISTORY,
                            {
                                type: 'fdc3.order',
                                order: {
                                    id: firstOrder.orderId,
                                    createTime: firstOrder.dateCreated,
                                },
                            },
                            { appId: 'fdc3-oms-trade-history' }
                        )
                    },
                },
                {
                    name: 'Click for Pre-trade',
                    action: () => {
                        triggerPreTradeOrders(
                            glue,
                            nodes.map((node) => node.data)
                        )
                    },
                },
                {
                    name: 'Click to Track',
                    action: () => {
                        pushToBbgWorksheet(
                            instrumentsToPush,
                            glue,
                            BBG_WORKSHEET_NAME
                        )
                    },
                },
            ]
            return result
        },
        [intentsApi]
    )

    let pageHeader = undefined
    if (historyView) {
        pageHeader = (
            <div className="d-flex align-items-center justify-content-between pb-3">
                <OrderFilters
                    fromDate={filtFromDate}
                    setFromDate={setFiltFromDate}
                    toDate={filtToDate}
                    setToDate={setFiltToDate}
                    clientId={filtClientId}
                    setClientId={setFiltClientId}
                    securityId={filtSecurityId}
                    setSecurityId={setFiltSecurityId}
                />
                <Button onClick={switchHashToOrders}>Current</Button>
            </div>
        )
    } else {
        pageHeader = (
            <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center">
                    {!isGlue42Enterprise && <ChannelSelector baseSize={null} />}
                    <Button className="mx-2" onClick={onNewOrderClick}>
                        &#x2795;&nbsp;Order&nbsp;Entry
                    </Button>
                    <Button onClick={switchHashToHistory}>Order History</Button>
                </div>
                <DateManipulator
                    glue={glue}
                    time={time}
                    timeOffset={timeOffset}
                    setTimeOffset={setTimeOffset}
                />
            </div>
        )
    }

    const gridContext = {
        sidesMap: orderSides,
        orderTypeMap: orderTypes,
        orderValidityMap: orderValidity,
    }

    return (
        <>
            <div className="active-orders-grid d-flex flex-column flex-grow-1">
                {pageHeader}
                <div className="ag-tick42 flex-grow-1">
                    <AgGridReact
                        masterDetail={true}
                        detailRowAutoHeight={true}
                        detailCellRendererParams={{
                            template: ({ data }: any) => {
                                if (data.split && data.split.length > 0) {
                                    return (
                                        '<div class="p-4">' +
                                        '  <div ref="eDetailGrid"></div>' +
                                        '</div>'
                                    )
                                }

                                return `<div class="text-center p-4">
                        <span>
                          <span class="tick42-custom-icon icon-warning icon-size-16">
                              <i class="icon-info-circled"></i>
                          </span>
                        </span>
                        <span class="ml-1">No Slices</span>
                      </div>`
                            },
                            refreshStrategy: 'rows',
                            detailGridOptions: {
                                immutableData: true,
                                getRowNodeId: getOrderSliceRowNodeId,
                                columnDefs: columnDefsSlices,
                                defaultColDef: { ...defaultColumnDef, flex: 1 },
                                context: gridContext,
                            },
                            getDetailRowData: ({
                                data,
                                successCallback,
                            }: {
                                data: OrderInfo
                                successCallback: (data: OrderSlice[]) => void
                            }) => {
                                let date = asOfDateRef.current as Date

                                if (historyView) {
                                    const toDateBasis = DateEndOfDay(
                                        data.dateCreated
                                    )
                                    if (!DateIsSameDay(toDateBasis, date)) {
                                        date = toDateBasis
                                    }
                                }

                                getOrderSlices(data.orderId, date)
                                    .then(successCallback)
                                    .catch(() => successCallback([]))
                            },
                        }}
                        defaultColDef={defaultColumnDef}
                        rowData={rowData}
                        context={gridContext}
                        rowSelection={'multiple'}
                        getRowId={getOrderRowId}
                        getRowStyle={getRowStyle}
                        suppressContextMenu={false}
                        allowContextMenuWithControlKey={true}
                        getContextMenuItems={getContextMenuItems}
                        onRowDataUpdated={onRowDataUpdated}
                        onRowClicked={onRowClicked}
                        columnDefs={columnDefsOrders}
                        onGridReady={grid.onGridReady}
                        cellFlashDelay={200}
                        cellFadeDelay={500}
                    ></AgGridReact>
                </div>
            </div>
        </>
    )
}

export default ActiveOrdersGrid
