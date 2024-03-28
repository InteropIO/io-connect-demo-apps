import { useState, useContext, useEffect, useMemo, useCallback } from 'react'
import { GlueContext } from '@glue42/react-hooks'
import { AgGridReact } from 'ag-grid-react'
import { ExcelExportParams, GetContextMenuItemsParams } from 'ag-grid-community'
import Select from 'react-select'
import { columnDefsPortfolio, defaultColumnDef } from '../../constants/grids'
import { InstrumentInfo } from '../../models/instruments'
import { FundInfo, PortfolioInstrumentInfo } from '../../models/portfolio'
import {
    Fdc3Instrument,
    Fdc3InstrumentList,
} from '../../models/fdc3-instrument'
import { METHODNAME_MARKET_DATA } from '../../constants/methods'
import { getRandomArbitrary } from '../../util/util'
import useInstrumentDetailsContext from '../../hooks/useInstrumentDetailsContext'
import { useFunds } from '../../hooks/useFunds'
import { pushToBbgWorksheet } from '../../util/bbg'
import { BBG_WORKSHEET_NAME } from '../../constants'
import { useMorningStarSync } from '../../hooks/useMorningStarSync'
import useGridHelper from '../../hooks/GridHelper'

const Portfolio = (): JSX.Element => {
    const glue = useContext(GlueContext)

    const [selectedFund, setFund] = useState<FundInfo | undefined>()
    const [investments, setInvestments] = useState<
        PortfolioInstrumentInfo[] | undefined
    >([])
    const [excelExportParams, setExcelExportParams] =
        useState<ExcelExportParams>({})
    const { syncInstrument, syncFund } = useMorningStarSync()

    const gridHelper = useGridHelper()

    const funds = useFunds()
    const { publish } = useInstrumentDetailsContext()

    useEffect(() => {
        if (selectedFund && selectedFund.instruments != null) {
            syncFund(selectedFund.isin)

            setInvestments(selectedFund.instruments ?? [])
            setExcelExportParams({
                sheetName: selectedFund.name,
                fileName: `${selectedFund.name}.xlsx`,
            })

            const subscriptionOptions = {
                arguments: {
                    list: mapToFdc3InstrumentList(selectedFund.instruments),
                },
                onData: onDataReceived,
                onClosed: () => console.log('Subscription closed by server.'),
            }
            const subscriptionPromise = glue.interop.subscribe(
                METHODNAME_MARKET_DATA,
                subscriptionOptions
            )

            return () => {
                subscriptionPromise.then(
                    (subs: { close: CallableFunction }) => {
                        if (subs) {
                            subs.close()
                        }
                    }
                )
            }
        }
    }, [selectedFund])

    function onDataReceived(streamData: any) {
        if (streamData.data) {
            const data = streamData.data

            setInvestments((prevState) => {
                if (prevState) {
                    return prevState.map((instr: PortfolioInstrumentInfo) => {
                        if (instr.ticker === data.ticker) {
                            const _value = data.lastPrice * instr.quantity
                            const _cost = getRandomArbitrary(
                                _value * 0.5,
                                _value * 0.8
                            )
                            const _percentChange = (
                                ((_value - _cost) / _value) *
                                100.0
                            ).toFixed(0)

                            return {
                                ...instr,
                                marketPrice: data.lastPrice,
                                value: _value,
                                cost: _cost,
                                change: _value - _cost,
                                changePercent: _percentChange,
                            }
                        } else
                            return {
                                ...instr,
                            }
                    })
                }
            })
        }
    }

    const getContextMenuItems = (params: GetContextMenuItemsParams) => {
        const instrumentInfo: PortfolioInstrumentInfo | null | undefined =
            params.node?.data
        if (instrumentInfo) {
            const selectedInstrument: Fdc3Instrument = {
                type: 'fdc3.instrument',
                name: instrumentInfo.description,
                id: {
                    ticker: instrumentInfo.ticker,
                    BBG_EXCHANGE: instrumentInfo.bbgExchange,
                    ISIN: instrumentInfo.isin,
                    RIC: `${instrumentInfo.ticker} ${instrumentInfo.bbgExchange}`,
                    BBG: `${instrumentInfo.ticker} ${instrumentInfo.bbgExchange}`,
                },
            }
            const result = [
                {
                    name: 'Buy',
                    action: () => raiseOrderIntent('1', selectedInstrument),
                },
                {
                    name: 'Sell',
                    action: () => raiseOrderIntent('2', selectedInstrument),
                },
                {
                    name: 'Sell All',
                    action: () =>
                        raiseOrderIntent(
                            '2',
                            selectedInstrument,
                            instrumentInfo.quantity
                        ),
                },
                {
                    name: 'Click to Track',
                    action: () => {
                        pushToBbgWorksheet(
                            [
                                {
                                    ticker: instrumentInfo.ticker,
                                    bbgExchange: instrumentInfo.bbgExchange,
                                },
                            ],
                            glue,
                            BBG_WORKSHEET_NAME
                        )
                    },
                },
            ]
            return result
        } else {
            console.warn('Selected row not an instrument')
            return []
        }
    }

    const raiseOrderIntent = useCallback((
        side: '1' | '2',
        instrument: Fdc3Instrument,
        quantity?: number
    ) => {
        if (window.fdc3) {
            window.fdc3
                .raiseIntent('NewOrder', {
                    type: 'fdc3.order',
                    order: {
                        type: 'fdc3.order',
                        side: side,
                        instrument: instrument,
                        quantity: quantity,
                        notes: selectedFund?.name
                    }
                })
            .catch(console.error)
        }
    }, [window.fdc3])

    const onRowClicked = (row: { data: PortfolioInstrumentInfo }) => {
        if (row.data) {
            const rowInstr: PortfolioInstrumentInfo = row.data
            publish({
                ticker: rowInstr.ticker,
                description: rowInstr.description,
                BBG_EXCHANGE: rowInstr.bbgExchange,
            })

            syncInstrument(rowInstr.ticker)
        }
    }

    const fundsSelectOptions = useMemo(
        () =>
            funds.map((fund: FundInfo) => ({
                value: fund,
                label: fund.name,
            })),
        [funds]
    )

    return (
        <div className="d-flex flex-column flex-grow-1">
            <div className="d-inline-flex justify-content-between pb-2">
                <div className="flex-fill">
                    <Select
                        classNamePrefix="select"
                        placeholder="Select Fund..."
                        isSearchable={false}
                        options={fundsSelectOptions}
                        onChange={(event) => setFund(event?.value)}
                    />
                </div>
                <button
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={'Export To Excel'}
                    type="button"
                    className="btn btn-icon ml-1"
                    onClick={() => gridHelper?.api?.exportDataAsExcel()}
                    disabled={selectedFund ? false : true}
                >
                    <i className="icon-file-excel"></i>
                </button>
            </div>
            <div className="ag-tick42 flex-grow-1">
                <AgGridReact
                    defaultColDef={defaultColumnDef}
                    rowData={investments}
                    columnDefs={columnDefsPortfolio}
                    immutableData={true}
                    getRowNodeId={(data: PortfolioInstrumentInfo) =>
                        data.ticker
                    }
                    onGridReady={gridHelper.onGridReady.bind(gridHelper)}
                    onRowClicked={onRowClicked}
                    getContextMenuItems={getContextMenuItems}
                    cellFadeDelay={500}
                    defaultExcelExportParams={excelExportParams}
                ></AgGridReact>
            </div>
        </div>
    )
}

const mapToFdc3InstrumentList = (
    instruments: InstrumentInfo[]
): Fdc3InstrumentList => {
    const mappedFdc3Instruments: Fdc3Instrument[] = instruments.map(
        ({ ticker }: InstrumentInfo) => {
            return {
                type: 'fdc3.instrument',
                id: { ticker },
            }
        }
    )
    return {
        type: 'fdc3.instrumentList',
        instruments: mappedFdc3Instruments,
    }
}
export default Portfolio
