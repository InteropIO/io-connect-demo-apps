import { useState, useEffect, useMemo, useContext, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'

import 'ag-grid-enterprise'

import 'ag-grid-enterprise/dist/styles/ag-grid.css'
import '../../css/Grids.css'

import { defaultColumnDef, columnTradePositions } from '../../constants/grids'
import { useTradingPositions } from './hooks/hooks'
import DateManipulator from '../DateManipulator'
import { OrderInfo, TradePosition } from '../../models/orders'
import useInstrumentDetailsContext from '../../hooks/useInstrumentDetailsContext'
import { useMorningStarSync } from '../../hooks/useMorningStarSync'
import {
    GetContextMenuItemsParams,
    MenuItemDef,
    RowClickedEvent,
} from 'ag-grid-community'
import { GlueContext } from '@glue42/react-hooks'
import { getRelevantContextNodes } from '../../util/ag-grid'
import { pushToBbgWorksheet } from '../../util/bbg'
import { BBG_WORKSHEET_NAME } from '../../constants'
import useEntityPublisher from '../../hooks/useContextPublisher'

const getTradePositionId = (data: TradePosition) =>
    `${data.book}${data.instrument.ticker}${data.instrument.bbgExchange}`

const addTimeOffset = (date: Date, offset: number): Date => {
    return new Date(date.getTime() + offset)
}

const TradingPositions = (): JSX.Element => {
    const glue = useContext(GlueContext)
    const [time, setTime] = useState(new Date())
    const [timeOffset, setTimeOffset] = useState(0)
    const { syncInstrument } = useMorningStarSync()
    const { publishInstrument } = useEntityPublisher(glue)

    const mockTime = useMemo(
        () => addTimeOffset(time, timeOffset),
        [time, timeOffset]
    )

    const positions = useTradingPositions(mockTime)

    const { publish } = useInstrumentDetailsContext()

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date())
        }, 10000)

        return () => clearInterval(timer)
    }, [])

    const onRowClicked = (event: RowClickedEvent<TradePosition>) => {
        if (event.data?.instrument) {
            publishInstrument(event.data.instrument)
            syncInstrument(event.data.instrument.ticker)
        }
    }

    const dateManipulator = (
        <DateManipulator
            time={time}
            timeOffset={timeOffset}
            setTimeOffset={setTimeOffset}
            glue={glue}
        />
    )

    const pageHeader = (
        <div className="d-flex align-items-center justify-content-between mb-2">
            {dateManipulator}
        </div>
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
            const result: MenuItemDef[] = [
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
        []
    )

    return (
        <div className="active-orders-grid d-flex flex-column flex-grow-1">
            {pageHeader}
            <div className="ag-tick42 flex-grow-1">
                <AgGridReact
                    defaultColDef={defaultColumnDef}
                    autoGroupColumnDef={{ headerName: 'Book', minWidth: 60 }}
                    rowData={positions}
                    immutableData={true}
                    getRowNodeId={getTradePositionId}
                    onRowClicked={onRowClicked}
                    getContextMenuItems={getContextMenuItems}
                    columnDefs={columnTradePositions}
                    cellFlashDelay={200}
                    cellFadeDelay={500}
                ></AgGridReact>
            </div>
        </div>
    )
}

export default TradingPositions
