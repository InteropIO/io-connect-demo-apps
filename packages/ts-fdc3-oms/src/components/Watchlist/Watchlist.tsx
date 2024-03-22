import { useState, useContext, useEffect, useCallback, useMemo } from 'react'
import { GlueContext } from '@glue42/react-hooks'
import { AgGridReact } from 'ag-grid-react'
import {
    GetContextMenuItemsParams,
    GetRowIdParams,
    MenuItemDef,
    RowNode,
} from 'ag-grid-community'
import Select from 'react-select'
import 'ag-grid-enterprise/dist/styles/ag-grid.css'
import { Button } from 'reactstrap'
import { columnDefsWatchlist, defaultColumnDef } from '../../constants/grids'
import {
    METHODNAME_CREATE_WATCHLIST,
    METHODNAME_GET_ALL_WATCHLISTS,
    METHODNAME_GET_WATCHLIST,
    METHODNAME_MARKET_DATA,
} from '../../constants/methods'
import { attachGlueToGlobalScope } from '../../util/glue'
import SecuritiesDropdown from './SecuritiesDropdown'
import NewWatchlistModal from './NewWatchlistModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import useStoreWatchlist from './hooks/useStoreWatchlist'
import useInstrumentDetailsContext from '../../hooks/useInstrumentDetailsContext'
import { pushToBbgWorksheet } from '../../util/bbg'
import { BBG_WORKSHEET_NAME } from '../../constants'
import { useInstruments } from '../../hooks/useInstruments'
import { useMorningStarSync } from '../../hooks/useMorningStarSync'

interface WatchlistInstrument {
    instrument: {
        ticker: string
        bbgExchange: string
    }
    security: string
    description: string
    id: string
    volume?: number
    lastPrice?: number
    openPrice?: number
    lowPrice?: number
    highPrice?: number
    time?: Date
    netChange?: number
}

function calculateNetChange(last: number, open: number) {
    const netChange = (((open - last) / last) * 100.0).toFixed(0)
    return netChange
}

const Watchlist = (): JSX.Element => {
    const glue = useContext(GlueContext)

    const {
        selectedWatchlist,
        allWatchlists,
        createNewWatchlist,
        deleteWatchlist,
        addInstrument,
        removeInstruments,
        selectWatchlistById,
        getAllWatchlists,
        getWatchlistById,
    } = useStoreWatchlist()
    const [watchlistInstruments, setWatchlistInstruments] = useState<
        WatchlistInstrument[]
    >([])
    const [showNewWatchlistModal, setShowNewWatchlistModal] =
        useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const { publish } = useInstrumentDetailsContext()
    const [subscribedInstruments, setSubscribedInstruments] = useState<
        string[]
    >([])

    const instruments = useInstruments()
    const { syncInstrument } = useMorningStarSync()

    useEffect(() => {
        if (!glue) return undefined
        attachGlueToGlobalScope(glue)
        glue.interop
            .register(
                {
                    name: METHODNAME_GET_WATCHLIST,
                    accepts: 'string id',
                    returns: 'Fdc3InstrumentList instrumentList',
                    displayName: 'Get Watch list',
                    description: 'Get a list of watched instruments',
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                getWatchlistById as any
            )
            .catch((e) => {
                console.error('Exception while registering method.', e)
            })

        glue.interop
            .register(
                {
                    name: METHODNAME_GET_ALL_WATCHLISTS,
                    accepts: '',
                    returns: 'Fdc3InstrumentList[] instrumentListArr',
                    displayName: 'Get all watch lists',
                    description:
                        'Get an array of all InstrumentLists that currently exist',
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                getAllWatchlists as any
            )
            .catch((e) => {
                console.error('Exception while registering method.', e)
            })

        glue.interop
            .register(
                {
                    name: METHODNAME_CREATE_WATCHLIST,
                    accepts: 'Fdc3InstrumentList instrumentList',
                    returns: 'string watchlistId',
                    displayName: 'Create watchlist',
                    description: 'Create a watchlist',
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                createNewWatchlist as any
            )
            .catch((e) => {
                console.error('Exception while registering method.', e)
            })

        return () => {
            glue.interop.unregister(METHODNAME_GET_WATCHLIST)
            glue.interop.unregister(METHODNAME_CREATE_WATCHLIST)
            glue.interop.unregister(METHODNAME_GET_ALL_WATCHLISTS)
        }
    }, [glue])

    useEffect(() => {
        if (selectedWatchlist && selectedWatchlist.instruments?.length > 0) {
            const initWatchlist: WatchlistInstrument[] = []
            const instrToBeSubscribed: string[] = []
            selectedWatchlist.instruments.forEach((i) => {
                if (i.id && i.id.ticker) {
                    if (!subscribedInstruments?.includes(i.id.ticker)) {
                        instrToBeSubscribed.push(i.id.ticker)
                    }
                    initWatchlist.push({
                        instrument: {
                            ticker: i.id.ticker,
                            bbgExchange: i.id.BBG_EXCHANGE ?? '',
                        },
                        security: i.id.ticker,
                        description: i.name || '',
                        id: i.id.customID as string,
                    })
                }
            })
            if (instrToBeSubscribed.length > 0) {
                setSubscribedInstruments([
                    ...subscribedInstruments,
                    ...instrToBeSubscribed,
                ])
            }
            setWatchlistInstruments(initWatchlist)
        } else {
            setWatchlistInstruments([])
        }
    }, [selectedWatchlist, glue])

    useEffect(() => {
        if (selectedWatchlist == null) {
            return
        }

        const subscriptionOptions = {
            arguments: { list: selectedWatchlist },
            onData: onDataReceived,
            onClosed: () => console.warn('Subscription closed by server.'),
        }
        const subscriptionPromise = glue.interop.subscribe(
            METHODNAME_MARKET_DATA,
            subscriptionOptions
        )
        return () => {
            subscriptionPromise.then((subs: { close: CallableFunction }) => {
                if (subs) {
                    subs.close()
                }
            })
        }
    }, [subscribedInstruments])

    useEffect(() => {
        if (selectedWatchlist && selectedWatchlist.name)
            document.title = 'OMS - ' + selectedWatchlist.name
        else document.title = 'OMS - Watchlist'
    }, [selectedWatchlist])

    const getContextMenuItems = useCallback(
        (params: GetContextMenuItemsParams): (string | MenuItemDef)[] => {
            let nodes: RowNode[] = params.api.getSelectedNodes()
            const clickedNode = params.node
            if (clickedNode) {
                if (
                    nodes.find(
                        (node) => node.rowIndex === clickedNode.rowIndex
                    ) === undefined
                ) {
                    nodes = [clickedNode]
                }
            }
            if (nodes.length <= 0) {
                return []
            }

            const instrumentsToRemove = nodes.map((node) => node.data.id)

            const instrumentsToPush = nodes.map((node) => {
                const watchlistInstrument: WatchlistInstrument = node.data

                const info = instruments?.find(
                    (instr) =>
                        instr.ticker === watchlistInstrument.instrument.ticker
                )

                return {
                    ticker: info?.ticker ?? '',
                    bbgExchange: info?.bbgExchange ?? '',
                }
            })

            const result = [
                {
                    name: 'Remove',
                    action: () => removeInstruments(instrumentsToRemove),
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
        [instruments]
    )

    const onRowClicked = ({ data }: { data: WatchlistInstrument }) => {
        if (data.instrument) {
            publish({
                ticker: data.instrument.ticker,
                BBG_EXCHANGE: data.instrument.bbgExchange,
            })
            syncInstrument(data.instrument.ticker)
        }
    }

    function onDataReceived(streamData: any) {
        if (streamData.data) {
            const i = streamData.data
            setWatchlistInstruments((prevState) =>
                prevState.map((instr) => {
                    if (instr.security === i.ticker) {
                        return {
                            ...instr,
                            netChange: calculateNetChange(
                                i.lastPrice,
                                i.openPrice
                            ),
                            ...i,
                        }
                    } else return instr
                })
            )
        }
    }

    function onDeleteModalComplete(result: boolean): void {
        setShowDeleteModal(false)
        if (result) deleteWatchlist(selectedWatchlist?.id?.watchlistId)
    }

    function onNewModalComplete(result: string | undefined): void {
        if (result) createNewWatchlist(result)
        setShowNewWatchlistModal(false)
    }

    const watchlistSelectOptions = useMemo(
        () =>
            Object.entries(allWatchlists || {}).map(([id, watchlistName]) => ({
                value: id,
                label: watchlistName,
            })),
        [allWatchlists]
    )

    return (
        <div className="d-flex flex-column flex-grow-1">
            <div>
                <NewWatchlistModal
                    visible={showNewWatchlistModal}
                    onComplete={onNewModalComplete}
                />

                <DeleteConfirmationModal
                    visible={showDeleteModal}
                    onComplete={onDeleteModalComplete}
                    selectedWatchlistName={selectedWatchlist?.name}
                />
                <div className="d-flex align-items-right justify-content-between pb-3">
                    <SecuritiesDropdown
                        disabled={selectedWatchlist === undefined}
                        onClickCallback={addInstrument}
                    />
                    <div className="d-flex flex-row">
                        <Button
                            className="ml-1"
                            color="secondary"
                            onClick={() => setShowNewWatchlistModal(true)}
                        >
                            New
                        </Button>
                        <Select
                            onChange={(event) =>
                                selectWatchlistById(event?.value)
                            }
                            options={watchlistSelectOptions}
                            isSearchable={false}
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: 180,
                                }),
                            }}
                            value={{
                                value: selectedWatchlist?.id?.watchlistId,
                                label: selectedWatchlist?.name,
                            }}
                            classNamePrefix="select"
                            className="watchlist-selector ml-1"
                            isDisabled={watchlistSelectOptions.length <= 0}
                        />
                        <Button
                            className="ml-1"
                            color="danger"
                            onClick={() => setShowDeleteModal(true)}
                            disabled={watchlistSelectOptions.length <= 0}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
            <div className="ag-tick42 flex-grow-1">
                <AgGridReact
                    overlayNoRowsTemplate="No watchlist selected"
                    defaultColDef={defaultColumnDef}
                    rowData={watchlistInstruments}
                    rowSelection="multiple"
                    columnDefs={columnDefsWatchlist}
                    getRowId={({ data }: GetRowIdParams<WatchlistInstrument>) =>
                        data.id
                    }
                    onRowClicked={onRowClicked}
                    getContextMenuItems={getContextMenuItems}
                    cellFadeDelay={500}
                ></AgGridReact>
            </div>
        </div>
    )
}

export default Watchlist
