// tslint:disable: no-single-line-block-comment
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// tslint:disable: readonly-array unknown-instead-of-any
/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {Injectable, OnDestroy} from '@angular/core'
import {Impl} from '@logi/base/ts/common/mapped_types'
import {Observable, Subject, Subscription, BehaviorSubject} from 'rxjs'
import {CustomSearch} from '../addon/custom_filter'
import {DEFAULT_PAGE_SIZE_OPTIONS} from '../table/paginator_options'

import {
    LogiTableData,
    LogiTableFilterFn,
    LogiTableFilterValue,
    LogiTableQueryParams,
    LogiTableSortFn,
    LogiTableSortOrder,
} from './../table.type'

@Injectable()
export class LogiTableDataService implements OnDestroy {
    setSortCalc(sortOperator: SortOperator): void {
        this._setQueryParams({
            sort: [{key: sortOperator.key, value: sortOperator.sortOrder}],
        })
        this._sortOperator = sortOperator
        const data = this._calcListOfData()
        this._listOfCurrentData$.next(data)
    }

    setFilterCalc(filterOperators: readonly FilterOperator[]): void {
        /**
         * First changed no need to emit query params.
         */
        if (this._filterOperators !== undefined)
            this._setQueryParams({
                filter: filterOperators
                    .map(f => {return {key: f.key, value: f.filterValue}}),
            })
        this._filterOperators = filterOperators
        const data = this._calcListOfData()
        if (this._pageConf === undefined) {
            this._listOfCurrentData$.next(data)
            return
        }
        const maxPageIndex = Math.ceil(data.length / this._pageConf[1]) || 1
        if (this._pageConf[0] <= maxPageIndex)
            return
        const listOfData = data.slice(
            (this._pageConf[0] - 1) * this._pageConf[1],
            this._pageConf[0] * this._pageConf[1]
        )
        this._listOfCurrentData$.next(listOfData)
    }

    setDefaultOptions(defaultOptions: number[]): void {
        this._defaultPageSizeOptions = defaultOptions
    }

    setCustomFilter(customFilter: CustomSearch<any>): void {
        this._customFilter = customFilter
        this._searchkey = customFilter.searchFormControl.value ?? ''
        const data = this._calcListOfData()
        this._listOfCurrentData$.next(data)
    }

    searchKeyChange(searchKey: string): void {
        this._searchkey = searchKey
        const data = this._calcListOfData()
        this._listOfCurrentData$.next(data)
        if (searchKey === '') {
            const pageOptions = this._defaultPageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS
            this._setQueryParams({
                pageIndex: 0,
                pageSize: pageOptions[0],
                pageOptions: pageOptions,
                total: this._allData.length,
            })
            return
        }
        const total = data.length
        this._setQueryParams({
            pageIndex: 0,
            pageSize: total,
            pageOptions: [total],
            total: data.length,
        })
    }

    public queryParams(): Observable<Impl<LogiTableQueryParams>> {
        return this._queryParams$
    }

    public listOfCurrentPageData(): Observable<any[] | readonly any[]> {
        return this._listOfCurrentData$
    }

    setPageConf(pageIndex: number, pageSize: number): void {
        this._pageConf = [pageIndex, pageSize]
        const data = this._calcListOfData()
        this._listOfCurrentData$.next(data)
    }

    public updatePageConf(pageIndex: number, pageSize: number): void {
        this._pageConf = [pageIndex, pageSize]
        const data = this._calcListOfData()
        this._listOfCurrentData$.next(data)
        this._setQueryParams({
            pageIndex,
            pageSize,
        })
    }

    public updateAllData(list: readonly LogiTableData[]): void {
        this._allData = list
        const data = this._calcListOfData()
        this._listOfCurrentData$.next(data)
    }

    public ngOnDestroy(): void {
        this._queryParams$.complete()
        this._listOfCurrentData$.complete()
        this._subs.unsubscribe()
    }
    private _queryParams$ = new Subject<Impl<LogiTableQueryParams>>()
    private _pageConf?: readonly [pageIndex: number, pageSize: number]
    private _allData: readonly LogiTableData[] = []
    private _listOfCurrentData$ = new BehaviorSubject<readonly LogiTableData[]>([])
    private _sortOperator?: SortOperator
    private _filterOperators?: readonly FilterOperator[]
    private _customFilter?: CustomSearch<any>
    private _searchkey = ''
    private _defaultPageSizeOptions?: number[]
    private _subs = new Subscription()
    private _setQueryParams(p: Impl<LogiTableQueryParams>): void {
        const params = p
        if (params.filter === undefined && this._filterOperators)
            params.filter = this._filterOperators
                .map(o => {return {key: o.key, value: o.filterValue}})
        if (params.sort === undefined && this._sortOperator)
            params.sort = [{key: this._sortOperator.key, value: this._sortOperator.sortOrder}]
        this._queryParams$.next(params)
    }

    // tslint:disable-next-line: max-func-body-length
    private _calcListOfData(): readonly LogiTableData[] {
        let listOfDataAfterCalc = this._allData.slice()
        if (this._customFilter)
            listOfDataAfterCalc = this._customFilterFn()
        else if (this._filterOperators)
            this._filterOperators.forEach(item => {
                const {filterFn, filterValue} = item
                listOfDataAfterCalc = listOfDataAfterCalc.filter(
                    data => filterFn(filterValue, data),
                )
            })
        if (this._sortOperator)
            return this._customSort(this._sortOperator, listOfDataAfterCalc)
        if (this._pageConf !== undefined && !this._customFilter) {
            const [pageIndex, pageSize] = this._pageConf
            return listOfDataAfterCalc
                .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
        }
        return listOfDataAfterCalc
    }

    private _customSort(
        sort: SortOperator,
        currData: readonly LogiTableData[],
    ): readonly LogiTableData[] {
        const {sortFn, sortOrder} = sort
        const func = (a: any, b: any) => sortFn(a, b, sortOrder)
        if (this._searchkey === '') {
            const d = this._allData.slice().sort(func)
            if (this._pageConf === undefined)
                return d
            const [pageIndex, pageSize] = this._pageConf
            return this._allData
                .slice()
                .sort(func)
                .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
        }
        return currData.slice().sort(func)
    }

    private _customFilterFn(): LogiTableData[] {
        if (this._customFilter === undefined)
            // tslint:disable-next-line: no-throw-unless-asserts
            throw Error('not have custom filter')
        const filterFn = this._customFilter.filterFn
        if (this._searchkey === '') {
            if (this._pageConf === undefined)
                return this._allData.slice()
            const [pageIndex, pageSize] = this._pageConf
            return this._allData.slice(
                pageIndex * pageSize,
                (pageIndex + 1) * pageSize
            )
        }
        return this._allData.filter(d => filterFn(d, this._searchkey))
    }
}
interface SortOperator {
    readonly key: string
    readonly sortFn: LogiTableSortFn
    readonly sortOrder: LogiTableSortOrder
    readonly sortPriority: number | boolean
}
interface FilterOperator {
    readonly key: string
    readonly filterFn: LogiTableFilterFn
    readonly filterValue: LogiTableFilterValue
}
