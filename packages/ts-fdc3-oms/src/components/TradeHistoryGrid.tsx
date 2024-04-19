import React, { useState, useEffect, useContext } from 'react'
import { GlueContext } from '@glue42/react-hooks'
import { Fdc3Order } from '../models/fdc3-order'
import {
    ColDef,
    GetContextMenuItemsParams,
    GetRowIdParams,
    RowNode,
} from 'ag-grid-community'
import useGridHelper from '../hooks/GridHelper'
import { useCorrectRowSelection, GlueT } from '../util/glue'
import { OrderTrade } from '../models/orders'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import {
    METHODNAME_GET_ALL_TRADES,
    METHODNAME_GET_ORDER,
    METHODNAME_GET_TRADES_FOR_INSTRUMENT,
} from '../constants/methods'
import '../css/Grids.css'
import 'react-datetime/css/react-datetime.css'
import '@glue42/theme/dist/packages/rc-rdt.css'
import 'ag-grid-enterprise/dist/styles/ag-grid.css'
import { DateEndOfDay, DateIsSameDay } from '../util/datetime'

import { columnDefsTrade } from '../constants/grids'
import useInstrumentDetailsContext from '../hooks/useInstrumentDetailsContext'
import {
    usePushExecutionsToChat,
    usePushExecutionsToEmail,
    usePushExecutionsToExcel,
} from '../hooks/usePushExecutions'
import { pushToBbgWorksheet } from '../util/bbg'
import { BBG_WORKSHEET_NAME } from '../constants'
import { useOrderSides } from '../hooks/useOrderSides'
import { useMorningStarSync } from '../hooks/useMorningStarSync'
import { DelayedLatestActionExecutor } from '../util/DelayedActions'
import { Fdc3Instrument } from '../models/fdc3-instrument'
import {
    formatInstrumentFromId,
    getInstrumentIdFromString,
    getTickerFromString,
    sleep,
} from '../util/util'
import { useAcmeSettings } from '../hooks/useAcmeSettings'
import useViewInstrument from '../hooks/useViewInstrument'

const exec = new DelayedLatestActionExecutor(300)

const defaultColumnDef: ColDef = {
    resizable: true,
    filter: true,
    sortable: true,
    enableCellChangeFlash: true,
}

let glue: GlueT | undefined = undefined

function getPushExecutionDate(tradeDate: Date): Date {
    let result
    const now = new Date()

    if (DateIsSameDay(tradeDate, now)) {
        result = now
    } else {
        result = DateEndOfDay(tradeDate)
    }

    return result
}

const getOrderTrades = async (
    orderId: string,
    date: Date
): Promise<OrderTrade[]> => {
    const result = await glue?.interop.invoke(METHODNAME_GET_ORDER, {
        orderId: parseInt(orderId),
        withTrades: true,
        date,
    })
    return result?.returned?.trades || []
}

const getInstrumentTrades = async (
    instrument: Fdc3Instrument,
    date: Date
): Promise<OrderTrade[]> => {
    const result = await glue?.interop.invoke(
        METHODNAME_GET_TRADES_FOR_INSTRUMENT,
        {
            date,
            instrument,
        }
    )

    return result?.returned?.trades || []
}

const getAllTrades = async (date: Date): Promise<OrderTrade[]> => {
    const result = await glue?.interop.invoke(METHODNAME_GET_ALL_TRADES, {
        date,
    })
    return result?.returned?.trades || []
}

export interface TradeHistoryGridProps {
    intentOrder?: Fdc3Order
    intentInstrument?: Fdc3Instrument
}

const TradeHistoryGrid = (props: TradeHistoryGridProps): JSX.Element => {
    const { intentOrder, intentInstrument } = props
    glue = useContext(GlueContext)

    const grid = useGridHelper()
    ;(window as any).grid = grid

    const [rowData, setRowData] = useState<OrderTrade[]>()
    const [time, setTime] = useState(new Date())
    const { mockTimeOffset } = useAcmeSettings(glue)

    const [filtOrderId, setFiltOrderId] = useState<string>('')
    const [filtInstrument, setFiltInstrument] = useState<string>('')

    const { instrumentContext, publish } = useInstrumentDetailsContext()

    const orderSides = useOrderSides()
    const pushExecutionsToEmail = usePushExecutionsToEmail()
    const pushExecutionsToChat = usePushExecutionsToChat()
    const pushExecutionsToExcel = usePushExecutionsToExcel()
    const { syncInstrument } = useMorningStarSync()
    const viewInstrument = useViewInstrument()
    useCorrectRowSelection(grid?.api?.getSelectedNodes(), instrumentContext)

    const getRowNodeId = ({ data }: GetRowIdParams<OrderTrade>) =>
        data.sliceId.toString() + data.timestamp.toISOString()

    useEffect(() => {
        const handler = () => setTime(new Date())
        window.addEventListener('hashchange', handler)

        const timer = setInterval(() => {
            handler()
        }, 10000)

        return () => {
            window.removeEventListener('hashchange', handler)
            clearInterval(timer)
        }
    }, [])

    // update grid contents
    useEffect(() => {
        const mockTime =
            typeof mockTimeOffset === 'number'
                ? new Date(time.getTime() + mockTimeOffset)
                : time
        if (filtOrderId) {
            exec.action(async () => {
                const trades = await getOrderTrades(filtOrderId, mockTime)
                glue?.windows
                    ?.my()
                    ?.setTitle(`FDC3 Trades: Order ${filtOrderId}`)
                setRowData(trades)
            })
            return
        }

        if (filtInstrument) {
            exec.action(async () => {
                const fdc3Instrument: Fdc3Instrument = {
                    type: 'fdc3.instrument',
                    id: {
                        ticker: getTickerFromString(filtInstrument),
                    },
                }
                const trades = await getInstrumentTrades(
                    fdc3Instrument,
                    mockTime
                )
                glue?.windows?.my()?.setTitle(`FDC3 Trades: ${filtInstrument}`)
                setRowData(trades)
            })
            return
        }

        // no filter, get all trades
        exec.action(async () => {
            const trades = await getAllTrades(mockTime)
            glue?.windows?.my()?.setTitle('FDC3 Trade History')
            setRowData(trades)
        })
    }, [time, filtOrderId, filtInstrument, mockTimeOffset])

    useEffect(() => {
        if (!intentOrder) {
            setFiltOrderId('')
            return
        }
        const orderId = intentOrder.id
        if (orderId) {
            ;(async () => {
                await sleep(50) // delay slightly so that this arrives last and takes precedence
                setFiltOrderId(orderId)
            })()
        }
    }, [intentOrder])

    useEffect(() => {
        if (!intentInstrument) {
            setFiltInstrument('')
            return
        }
        const id = intentInstrument?.id
        const candidate = id?.BBG || id?.RIC
        const instrument = formatInstrumentFromId(
            getInstrumentIdFromString(candidate)
        )
        if (instrument) {
            setFiltInstrument(instrument)
            setFiltOrderId('')
        }
    }, [intentInstrument])

    const setInstrumentFromContext = (instrument: string) => {
        console.log('Setting instrument from dynamic context:', instrument)
        if (!instrument) return
        setFiltInstrument(instrument)
        setFiltOrderId('')
    }

    useEffect(() => {
        if (!instrumentContext) {
            return
        }
        const instrumentRIC = instrumentContext?.id?.RIC || ''
        setInstrumentFromContext(instrumentRIC)
    }, [instrumentContext])

    const onRowClicked = async (ev: { data: OrderTrade }) => {
        await publish({
            ticker: ev.data.instrument.ticker,
            BBG_EXCHANGE: ev.data.instrument.bbgExchange,
        })

        syncInstrument(ev.data.instrument.ticker)
        viewInstrument(ev.data.instrument)
    }

    const getContextMenuItems = (params: GetContextMenuItemsParams) => {
        const trade = params.node?.data
        let nodes: RowNode[] = params.api.getSelectedNodes()

        const clickedNode = params.node
        if (clickedNode) {
            if (
                nodes.find((node) => node.rowIndex === clickedNode.rowIndex) ===
                undefined
            ) {
                nodes = [clickedNode]
            }
        }
        if (nodes.length <= 0) {
            return []
        }
        const instrumentsToPush = nodes.map(
            ({
                data: {
                    instrument: { ticker, bbgExchange },
                },
            }: {
                data: OrderTrade
            }) => ({
                ticker,
                bbgExchange,
            })
        )
        console.log(instrumentsToPush)

        const pushDate = getPushExecutionDate(trade.timestamp)

        return trade
            ? [
                  {
                      name: 'Click to Report (Trades) via Email',
                      action: () =>
                          pushExecutionsToEmail(trade.orderId, pushDate),
                  },
                  {
                      name: 'Click to Report (Trades) via Excel',
                      action: () =>
                          pushExecutionsToExcel(trade.orderId, pushDate),
                  },
                  {
                      name: 'Click to Report (Trades) via Chat',
                      action: () =>
                          pushExecutionsToChat(trade.orderId, pushDate),
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
            : []
    }

    return (
        <>
            <div className="trade-orders-grid d-flex flex-column flex-grow-1">
                <div className="ag-tick42 flex-grow-1">
                    <AgGridReact
                        getContextMenuItems={getContextMenuItems}
                        defaultColDef={defaultColumnDef}
                        rowData={rowData}
                        context={{ sidesMap: orderSides }}
                        rowSelection={'multiple'}
                        getRowId={getRowNodeId}
                        columnDefs={columnDefsTrade}
                        onGridReady={(param) => {
                            grid.onGridReady(param)
                            param?.api.sizeColumnsToFit()
                        }}
                        onGridSizeChanged={({ api }) => {
                            api.sizeColumnsToFit()
                        }}
                        onRowClicked={onRowClicked}
                        cellFlashDelay={200}
                        cellFadeDelay={500}
                    >
                        <AgGridColumn field="Loading Data ..."></AgGridColumn>
                    </AgGridReact>
                </div>
            </div>
        </>
    )
}

export default TradeHistoryGrid
