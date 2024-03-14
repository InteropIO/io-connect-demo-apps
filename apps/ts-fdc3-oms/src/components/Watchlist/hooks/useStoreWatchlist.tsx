import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
    Fdc3Instrument,
    Fdc3InstrumentList,
} from '../../../models/fdc3-instrument'
import { WATCHLIST_ID_PREFIX } from '../../../constants'
import { useFdc3Instruments } from '../../../hooks/useFdc3Instruments'

export interface WatchlistMap {
    [id: string]: string
}

const useStoreWatchlist = (): {
    selectedWatchlist: Fdc3InstrumentList | undefined
    allWatchlists: WatchlistMap | undefined
    createNewWatchlist: CallableFunction
    deleteWatchlist: CallableFunction
    addInstrument: CallableFunction
    removeInstruments: CallableFunction
    selectWatchlistById: CallableFunction
    getAllWatchlists: CallableFunction
    getWatchlistById: CallableFunction
} => {
    const [allWatchlists, setAllWatchlists] = useState<WatchlistMap>()
    const [selectedWatchlist, setSelectedWatchlist] =
        useState<Fdc3InstrumentList>()
    const instruments = useFdc3Instruments()

    useEffect(() => {
        if (instruments) {
            const selectedId = JSON.parse(
                window.localStorage.getItem('selectedWatchlist') || 'null'
            )
            let initialWatchlist = selectWatchlistById(selectedId)
            if (!initialWatchlist && instruments) {
                setSelectedWatchlist(instruments)
                saveToLocalStorage(instruments)
                initialWatchlist = instruments
            }

            const watchlists = Object.keys(window.localStorage).filter((id) =>
                id.startsWith(WATCHLIST_ID_PREFIX)
            )
            setAllWatchlists(() => {
                const newState: any = {}
                watchlists.forEach((id) => {
                    const instrumentList: any = getWatchlistById(id)
                    if (instrumentList) {
                        newState[id] = instrumentList.name || ''
                    }
                })
                return { ...newState }
            })
        }
    }, [instruments])

    useEffect(() => {
        if (selectedWatchlist && selectedWatchlist.id) {
            window.localStorage.setItem(
                'selectedWatchlist',
                JSON.stringify(selectedWatchlist.id.watchlistId)
            )
            saveToLocalStorage(selectedWatchlist)
        }
    }, [selectedWatchlist])

    function getAllWatchlists(): Fdc3InstrumentList[] {
        if (allWatchlists) {
            const instrumentListArr: any = Object.entries(allWatchlists).map(
                (pair) => {
                    return getWatchlistById(pair[0])
                }
            )
            return instrumentListArr
        } else return []
    }

    function getWatchlistById(id: string): Fdc3InstrumentList | undefined {
        const localList: any = JSON.parse(window.localStorage.getItem(id) || '')
        if (localList) return localList
        return undefined
    }

    function createNewWatchlist(
        name: string,
        instrumentList?: Fdc3InstrumentList
    ) {
        let existingNames: string[] = []
        if (allWatchlists) existingNames = Object.values(allWatchlists)
        let i = 0
        let watchlistName = name
        while (existingNames.includes(watchlistName)) {
            i++
            watchlistName = name + '(' + i + ')'
        }
        const id = WATCHLIST_ID_PREFIX + uuidv4()
        let newList: Fdc3InstrumentList
        if (instrumentList) {
            newList = instrumentList
        } else {
            newList = {
                type: 'fdc3.instrumentList',
                name: watchlistName,
                id: { watchlistId: id },
                instruments: [],
            }
        }
        setSelectedWatchlist(newList)
        setAllWatchlists((prevState) => ({
            ...prevState,
            [(newList.id as any).watchlistId]: newList.name,
        }))
        return newList.id?.watchlistId
    }

    function deleteWatchlist(watchlistId: string) {
        if (allWatchlists) {
            const keys = Object.keys(allWatchlists)
            const idx = keys.findIndex((element) => element === watchlistId)
            const prevWatchlistId = idx > 0 ? keys[idx - 1] : keys[idx]
            if (prevWatchlistId === watchlistId) {
                keys[idx + 1] !== undefined
                    ? selectWatchlistById(keys[idx + 1])
                    : setSelectedWatchlist(undefined)
            } else {
                selectWatchlistById(prevWatchlistId)
            }
            delete allWatchlists[watchlistId]

            setAllWatchlists({
                ...allWatchlists,
            })

            window.localStorage.removeItem(watchlistId)
        }
    }

    function removeInstruments(idsToRemove: string[]) {
        setSelectedWatchlist((prevState: Fdc3InstrumentList | undefined) => {
            let prevInstruments = prevState?.instruments
            idsToRemove.forEach((id) => {
                if (prevInstruments) {
                    prevInstruments = prevInstruments.filter(
                        (instr) => instr.id?.customID !== id
                    )
                }
                console.log(prevInstruments)
            })
            return prevState && prevInstruments
                ? {
                      ...prevState,
                      instruments: prevInstruments,
                  }
                : prevState
        })
    }

    function addInstrument(instrument: Fdc3Instrument) {
        if (!(selectedWatchlist && instrument.id)) {
            return
        }

        //add id to instrument
        const customID = uuidv4()
        setSelectedWatchlist((prevState: Fdc3InstrumentList | undefined) => {
            return prevState
                ? {
                      ...prevState,
                      instruments: [
                          ...prevState.instruments,
                          {
                              ...instrument,
                              id: { ...instrument.id, customID },
                          },
                      ],
                  }
                : prevState
        })
    }

    function selectWatchlistById(
        watchlistId: string
    ): Fdc3InstrumentList | undefined {
        const localStoreWatchlist = window.localStorage.getItem(watchlistId)
        if (localStoreWatchlist) {
            try {
                const parsed = JSON.parse(localStoreWatchlist)
                setSelectedWatchlist(parsed)
                return parsed
            } catch (error) {
                console.error(error)
            }
        } else {
            return undefined
        }
    }

    function saveToLocalStorage(watchlist: Fdc3InstrumentList): void {
        if (watchlist.id?.watchlistId) {
            window.localStorage.setItem(
                watchlist.id?.watchlistId,
                JSON.stringify(watchlist)
            )
        }
    }

    return {
        selectedWatchlist,
        allWatchlists,
        createNewWatchlist,
        deleteWatchlist,
        addInstrument,
        removeInstruments,
        selectWatchlistById,
        getAllWatchlists,
        getWatchlistById,
    }
}

export default useStoreWatchlist
