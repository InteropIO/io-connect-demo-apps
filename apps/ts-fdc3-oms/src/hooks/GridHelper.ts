
import {useRef} from 'react';

import {GridApi, ColumnApi, GridReadyEvent} from "ag-grid-community"

export class GridHelper {

    private gridApi_?:GridApi = undefined
    private columnApi_?:ColumnApi = undefined

    constructor () {
        console.log("GridHelper()  ", (new Date()).toISOString())
    }

    public onGridReady(param:GridReadyEvent): void {
        this.gridApi_ = param.api
        this.columnApi_ = param.columnApi
    }

    public get api(): GridApi | undefined {
        return this.gridApi_
    }
}

const useGridHelper = (): GridHelper => {
    const refHelper = useRef<GridHelper>(undefined as any )
    if(!refHelper.current) refHelper.current = new GridHelper()

    return refHelper.current
}

export default useGridHelper