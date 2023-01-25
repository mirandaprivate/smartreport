import {LogiTableQueryParams} from '@logi/src/app/ui/customize-table'
import {debounceTime} from 'rxjs/operators'
import {FormControl} from '@angular/forms'

import {ACS, Column, DESC} from './column'
import {TableDef} from './table_def'

export abstract class TableServerDef<T> extends TableDef<T> {
    // tslint:disable-next-line: max-func-body-length
    public constructor(
        public readonly columns: readonly Column<T>[],

    ) {
        super(columns)
        const debounce = 300
        this.add(this.searchFormControl.valueChanges
            .pipe(debounceTime(debounce))
            .subscribe(() => {
                if (this.queryParams)
                    this.queryParams.pageIndex = 0
                this.initList()
            }))
    }

    /**
     * sort, search and split defined in frontend.
     */
    public manualUpdate = false
    public options: readonly string[] = []
    searchFormControl = new FormControl()
    queryParams?: LogiTableQueryParams

    public onInitSelect(selectValue: string, options: readonly string[]): void {
        this.selectFormControl.setValue(selectValue)
        this.options = options
        this.add(this.selectFormControl.valueChanges.subscribe(() => {
            this.initList()
        }))
    }

    public onQueryParamsChange(e: LogiTableQueryParams): void {
        this.queryParams = e
        this.initList()
    }

    public updateSortCol(listOrder: number): void {
        this.columns.forEach(c => {
            if (c.sortOrder !== undefined || c.sortOrder !== null)
                c.updateSortOrder(undefined)
            if (c.sortAscEnum === listOrder)
                c.updateSortOrder(ACS)
            else if (c.sortDescEnum === listOrder)
                c.updateSortOrder(DESC)
        })
    }

    public getSortOrder(): number | undefined {
        const sortCol = this.queryParams?.sort[0]
        if (sortCol === undefined)
            return
        const col = this.columns.find(c => c.key === sortCol.key)
        if (col === undefined)
            return
        if (sortCol.value === ACS)
            return col.sortAscEnum
        if (sortCol.value === DESC)
            return col.sortDescEnum
        return
    }
}
