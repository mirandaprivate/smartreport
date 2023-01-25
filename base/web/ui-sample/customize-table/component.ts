/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/member-ordering */
// tslint:disable: no-unnecessary-method-declaration
// tslint:disable: no-console prefer-function-over-method no-magic-numbers
// tslint:disable: member-access member-ordering
// tslint:disable: object-literal-sort-keys
// tslint:disable: no-null-keyword
// tslint:disable: unknown-instead-of-any
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core'
import {FormControl} from '@angular/forms'
import {
    CustomSearchBuilder,
    LogiTableComponent,
    LogiTableFilterFn,
    LogiTableFilterList,
    LogiTableQueryParams,
    LogiTableSortFn,
    LogiTableSortOrder,
    LogiTableSortOrderEnum,
    PaginatorOptions,
    PaginatorOptionsBuilder,
    PaginatorOptionsImpl,
} from '@logi/base/web/ui/customize-table'
import {Observable, Subject, timer} from 'rxjs'
import {map, takeUntil} from 'rxjs/operators'

interface Person {
    readonly key: string
    readonly name: string
    readonly age: number
    readonly address: string
}

interface ItemData {
    readonly id: number
    // tslint:disable-next-line: readonly-keyword
    name: string
    readonly age: number
    readonly address: string
}

interface Data {
    readonly id: number
    readonly name: string
    readonly age: number
    readonly address: string
    readonly disabled: boolean
}

interface DataItem {
    readonly name: string
    readonly age: number
    readonly address: string
}

interface ColumnItem {
    readonly name: string
    // tslint:disable-next-line: readonly-keyword
    sortOrder: LogiTableSortOrder | null
    readonly sortFn: LogiTableSortFn | null
    // tslint:disable-next-line: readonly-keyword
    listOfFilter: LogiTableFilterList
    readonly filterFn: LogiTableFilterFn | null
    readonly filterMultiple: boolean
    readonly sortDirections: readonly LogiTableSortOrder[]
}

interface Sort2Item {
    readonly name: string
    readonly chinese: number
    readonly math: number
    readonly english: number
}

interface RandomUser {
    readonly gender: string
    readonly email: string
    readonly name: {
        readonly title: string;
        readonly first: string;
        readonly last: string;
    }
}

interface Grouping {
    readonly name: string
    readonly age: number
    readonly street: string
    readonly building: string
    readonly number: number
    readonly companyAddress: string
    readonly companyName: string
    readonly gender: string
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-table-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class LogiCustomizeTableSampleComponent implements OnInit, OnDestroy, AfterViewInit {
    constructor(private readonly _cd: ChangeDetectorRef) {}
    tables: readonly string[] = []
    jumpTable(i: number): void {
        const h3 = document.querySelectorAll('logi-table')
        h3[i].scrollIntoView()
    }
    /**
     * simple example
     */
    public simpleData: readonly Person[] = Array(100).fill(1).map((t, i) => {
        return {
            address: `New York No. ${i} Lake Park ${i !== 2 ? '' : '1'
                .repeat(1000)}`,
            age: i,
            key: `${i}`,
            name: `John Brown${i}${t}`,
        }
    })
    simpleCustomFilter = new CustomSearchBuilder<Person>()
        .searchFormControl(new FormControl())
        .filterFn((person, key) => person.address.includes(key) || person.name
            .includes(key))
        .build()
    simplePaginator = new PaginatorOptionsBuilder()
        .pageIndex(0)
        .pageSize(20)
        .build()
    getObjString(paginator: PaginatorOptions): string {
        return JSON.stringify(paginator)
    }
    paginatorSample = new PaginatorOptionsBuilder().show(false).build()
    paginatorData = Array(1000).fill(1).map((t, i) => {
        return {
            name: `${t} name`,
            age: i,
        }
    })
    paginatorChanged(value: any, type: string): void {
        if (value === 0)
            return
        this.paginatorLoading = true
        this._cd.detectChanges()
        timer(1000).subscribe(() => {
            const old = this.paginatorSample as PaginatorOptionsImpl
        // @ts-expect-error
            old[type] = value
            this.paginatorSample = new PaginatorOptionsBuilder(old).build()
            this.paginatorLoading = false
            this._cd.detectChanges()
        })
    }
    paginatorLoading = false
    simpleDataNameSortFn = (
        a: Person,
        b: Person,
        order?: LogiTableSortOrder,
    ): number => {
        if (order === undefined)
            return 0
        if (order === LogiTableSortOrderEnum.ACS)
            return a.name > b.name ? 1 : -1
        if (order === LogiTableSortOrderEnum.DESC)
            return a.name > b.name ? -1 : 1
        return 0
    }
    simpleDataAgeSortFn = (
        a: Person,
        b: Person,
        order?: LogiTableSortOrder,
    ): number => {
        if (order === undefined)
            return 0
        if (order === LogiTableSortOrderEnum.ACS)
            return a.age > b.age ? 1 : -1
        if (order === LogiTableSortOrderEnum.DESC)
            return a.age > b.age ? -1 : 1
        return 0
    }
    /**
     * checkbox )   */

    listOfSelection: ReadonlyArray<any> = [
        {
            text: 'Select All Row',
            onSelect: () => {
                this.onAllChecked(true)
            },
        },
        {
            text: 'Select Odd Row',
            onSelect: () => {
                this.listOfCurrentPageData.forEach((
                    data,
                    index,
                ) => this.updateCheckedSet(data.id, index % 2 !== 0))
                this.refreshCheckedStatus()
            },
        },
        {
            text: 'Select Even Row',
            onSelect: () => {
                this.listOfCurrentPageData.forEach((
                    data,
                    index,
                ) => this.updateCheckedSet(data.id, index % 2 === 0))
                this.refreshCheckedStatus()
            },
        },
    ]
    checked = false
    indeterminate = false
    listOfCurrentPageData: ReadonlyArray<ItemData> = []
    checkBoxData: ReadonlyArray<ItemData> = []
    setOfCheckedId = new Set<number>()

    updateCheckedSet(id: number, checked: boolean): void {
        if (checked)
            this.setOfCheckedId.add(id)
        else
            this.setOfCheckedId.delete(id)
    }

    onItemChecked(id: number, checked: boolean): void {
        this.updateCheckedSet(id, checked)
        this.refreshCheckedStatus()
    }

    onAllChecked(value: boolean): void {
        this.listOfCurrentPageData
            .forEach(item => this.updateCheckedSet(item.id, value))
        this.refreshCheckedStatus()
    }

    onCurrentPageDataChange($event: ReadonlyArray<ItemData>): void {
        this.listOfCurrentPageData = $event
        this.refreshCheckedStatus()
    }

    refreshCheckedStatus(): void {
        this.checked = this.listOfCurrentPageData
            .every(item => this.setOfCheckedId.has(item.id))
        this.indeterminate = this.listOfCurrentPageData
            .some(item => this.setOfCheckedId.has(item.id)) && !this.checked
    }

    ngOnInit(): void {
        this.addRow()
        this.addRow()
        this.checkBoxData = new Array(200).fill(0).map((_, index) => {
            return {
                id: index,
                name: `Edward King ${index}`,
                age: 32,
                address: `London, Park Lane no. ${index}`,
            }
        })
        this.sendRequestData = new Array(100).fill(0).map((_, index) => {
            return {
                id: index,
                name: `Edward King ${index}`,
                age: 32,
                address: `London, Park Lane no. ${index}`,
                disabled: index % 2 === 0,
            }
        })
    }

    /**
     * checkbox has disabled
     */
    checked2 = false
    loading2 = false
    indeterminate2 = false
    sendRequestData: ReadonlyArray<Data> = []
    listOfCurrentPageData2: ReadonlyArray<Data> = []
    setOfCheckedId2 = new Set<number>()

    updateCheckedSet2(id: number, checked: boolean): void {
        if (checked)
            this.setOfCheckedId2.add(id)
        else
            this.setOfCheckedId2.delete(id)
    }

    onCurrentPageDataChange2(listOfCurrentPageData: ReadonlyArray<Data>): void {
        this.listOfCurrentPageData2 = listOfCurrentPageData
        this.refreshCheckedStatus2()
    }

    refreshCheckedStatus2(): void {
        const listOfEnabledData = this.listOfCurrentPageData2.filter((
            {disabled},
        ) => !disabled)
        this.checked2 = listOfEnabledData.every((
            {id},
        ) => this.setOfCheckedId2.has(id))
        this.indeterminate2 = listOfEnabledData.some((
            {id},
        ) => this.setOfCheckedId2.has(id)) && !this.checked2
    }

    onItemChecked2(id: number, checked: boolean): void {
        this.updateCheckedSet2(id, checked)
        this.refreshCheckedStatus2()
    }

    onAllChecked2(checked: boolean): void {
        this.listOfCurrentPageData2
            .filter(({disabled}) => !disabled)
            .forEach(({id}) => this.updateCheckedSet2(id, checked))
        this.refreshCheckedStatus2()
    }

    sendRequest2(): void {
        this.loading2 = true
        const requestData = this.sendRequestData
            .filter(data => this.setOfCheckedId2.has(data.id))
        console.log(requestData)
        setTimeout(
            () => {
                this.setOfCheckedId2.clear()
                this.refreshCheckedStatus2()
                this.loading2 = false
                this._cd.detectChanges()
            },
            1000,
        )
    }

    /**
     * sort example
     */
    sortColumns: readonly ColumnItem[] = [
        {
            name: 'Name',
            sortOrder: null,
            sortFn: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend', null],
            filterMultiple: true,
            listOfFilter: [
                {text: 'Joe', value: 'Joe'},
                {text: 'Jim', value: 'Jim', byDefault: true},
            ],
            filterFn: (list: readonly string[], item: DataItem) => list
                .some(name => item.name.indexOf(name) !== -1),
        },
        {
            name: 'Age',
            sortOrder: 'descend',
            sortFn: (a: DataItem, b: DataItem) => a.age - b.age,
            sortDirections: ['descend', null],
            listOfFilter: [],
            filterFn: null,
            filterMultiple: true,
        },
        {
            name: 'Address',
            sortOrder: null,
            sortDirections: ['ascend', 'descend', null],
            sortFn: (
                a: DataItem,
                b: DataItem,
            ) => a.address.length - b.address.length,
            filterMultiple: false,
            listOfFilter: [
                {text: 'London', value: 'London'},
                {text: 'Sidney', value: 'Sidney'},
            ],
            filterFn: (address: string, item: DataItem) => item.address
                .indexOf(address) !== -1,
        },
    ]
    sortData: readonly DataItem[] = [
        {
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
    ]
    sortByAge(): void {
        this.sortColumns.forEach(item => {
            if (item.name === 'Age')
                item.sortOrder = 'descend'
            else
                item.sortOrder = null
        })
    }

    resetFilters(): void {
        this.sortColumns.forEach(item => {
            if (item.name === 'Name')
                item.listOfFilter = [
                    {text: 'Joe', value: 'Joe'},
                    {text: 'Jim', value: 'Jim'},
                ]
            // eslint-disable-next-line max-lines
            else if (item.name === 'Address')
                item.listOfFilter = [
                    {text: 'London', value: 'London'},
                    {text: 'Sidney', value: 'Sidney'},
                ]
        })
    }

    resetSortAndFilters(): void {
        this.sortColumns.forEach(item => {
            item.sortOrder = null
        })
        this.resetFilters()
    }

    /**
     * sort 2
     */
    sort2Column: ReadonlyArray<any> = [
        {
            title: 'Name',
            compare: null,
            priority: false,
        },
        {
            title: 'Chinese Score',
            compare: (a: Sort2Item, b: Sort2Item) => a.chinese - b.chinese,
            priority: 3,
        },
        {
            title: 'Math Score',
            compare: (a: Sort2Item, b: Sort2Item) => a.math - b.math,
            priority: 2,
        },
        {
            title: 'English Score',
            compare: (a: Sort2Item, b: Sort2Item) => a.english - b.english,
            priority: 1,
        },
    ]
    sort2Data: readonly Sort2Item[] = [
        {
            name: 'John Brown',
            chinese: 98,
            math: 60,
            english: 70,
        },
        {
            name: 'Jim Green',
            chinese: 98,
            math: 66,
            english: 89,
        },
        {
            name: 'Joe Black',
            chinese: 98,
            math: 90,
            english: 70,
        },
        {
            name: 'Jim Red',
            chinese: 88,
            math: 99,
            english: 89,
        },
    ]

    public searchValue = ''

    public listOfDisplayData: ReadonlyArray<any> = [...this.sortData]
    reset(): void {
        this.searchValue = ''
        this.search()
    }

    search(): void {
        this.listOfDisplayData = this.sortData.filter((
            item: DataItem,
        ) => item.name.indexOf(this.searchValue) !== -1)
    }

    /**
     * table ajax
     */

    listOfRandomUser: readonly RandomUser[] = []
    loading3 = false
    paginatorOptions = new PaginatorOptionsBuilder()
        .total(1)
        .pageSize(10)
        .pageIndex(1)
        .build()
    noPaginator = new PaginatorOptionsBuilder().show(false).build()
    filterGender: ReadonlyArray<any> = [
        {text: 'male', value: 'male'},
        {text: 'female', value: 'female'},
    ]

    loadDataFromServer(
        // tslint:disable-next-line: max-params
        pageIndex: number,
        pageSize: number,
        sortField: string | null,
        sortOrder: string | null,
        filter: readonly { readonly key: string; readonly value: readonly string[] }[],
    ): void {
        this.loading3 = true
        console.log(pageIndex)
        console.log(sortField)
        console.log(sortOrder)
        console.log(filter)
        this.randomUserSvc(pageSize).subscribe(data => {
            this.loading3 = false
            this.paginatorOptions = new PaginatorOptionsBuilder(this.paginatorOptions)
                .total(data.results.length)
                .pageIndex(pageIndex)
                .pageSize(pageSize)
                .build()
            this.listOfRandomUser = data.results
            this._cd.detectChanges()
        })
    }

    onQueryParamsChange(params: LogiTableQueryParams): void {
        console.log(params)
        const {pageSize, pageIndex, sort, filter} = params
        const currentSort = sort.find(item => item.value !== null)
        const sortField = (currentSort && currentSort.key) || null
        const sortOrder = (currentSort && currentSort.value) || null
        this.loadDataFromServer(
            pageIndex,
            pageSize,
            sortField,
            sortOrder,
            filter,
        )
    }

    /**
     * pageIndex, pageSize, sortField, sortOrder used for Pagination
     */
    randomUserSvc(
        pageSize: number,
    ): Observable<{ readonly results: readonly RandomUser[] }> {
        const user = (r: number): RandomUser[] => {
            const data: RandomUser[] = []
            for (let i = 0; i <= r; i += 1) {
                const random = Math.floor(Math.random() * Math.floor(pageSize))

                data.push({
                    gender: random % 2 ? 'male' : 'female',
                    email: `email@${random}.com`,
                    name: {
                        title: `title ${random}`,
                        first: `first ${random}`,
                        last: `last ${random}`,
                    },
                })
            }

            return data
        }
        return timer(1000).pipe(map(() => {
            return {
                results: user(pageSize),
            }
        }))
    }

    /**
     * size table
     */
    data: ReadonlyArray<any> = [
        {
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ]
    /**
     * table bordered
     */
    dataSet: ReadonlyArray<any> = [
        {
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ]

    /**
     * expand table
     */
    expandSet = new Set<number>()
    onExpandChange(id: number, checked: boolean): void {
        if (checked)
            this.expandSet.add(id)
        else
            this.expandSet.delete(id)
    }
    expandData: ReadonlyArray<any> = [
        {
            id: 1,
            name: 'John Brown',
            age: 32,
            expand: false,
            address: 'New York No. 1 Lake Park',
            description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
        },
        {
            id: 2,
            name: 'Jim Green',
            age: 42,
            expand: false,
            address: 'London No. 1 Lake Park',
            description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
        },
        {
            id: 3,
            name: 'Joe Black',
            age: 32,
            expand: false,
            address: 'Sidney No. 1 Lake Park',
            description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
        },
    ]
    /**
     * colspan rowspan table
     */
    spanData: ReadonlyArray<any> = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            tel: '0571-22098909',
            phone: 18889898989,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            tel: '0571-22098333',
            phone: 18889898888,
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '4',
            name: 'Jim Red',
            age: 18,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '5',
            name: 'Jake White',
            age: 18,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'Dublin No. 2 Lake Park',
        },
    ]
    /**
     * fixed table
     */
    fixedData: ReadonlyArray<DataItem> = getData()
    /**
     * grouping columns table
     */
    groupingData: readonly Grouping[] = getGroupData()
    sortAgeFn = (a: Grouping, b: Grouping) => a.age - b.age
    nameFilterFn = (list: readonly string[], item: Grouping) => list
        .some(name => item.name.indexOf(name) !== -1)
    filterName: ReadonlyArray<any> = [
        {text: 'Joe', value: 'Joe'},
        {text: 'John', value: 'John'},
    ]
    /**
     * editor cell table
     */
    i = 0
    editId: number | null = null
    editorData: readonly ItemData[] = []

    startEdit(id: number): void {
        this.editId = id
    }

    stopEdit(): void {
        this.editId = null
    }

    addRow(): void {
        this.editorData = [
            ...this.editorData,
            {
                id: this.i,
                name: `Edward King ${this.i}`,
                age: 32,
                address: `London, Park Lane no. ${this.i}`,
            },
        ]
        this.i += 1
    }

    deleteRow(id: number): void {
        this.editorData = this.editorData.filter(d => d.id !== id)
    }
    /**
     * virtual table
     */
    @ViewChild(
        'virtual_table',
        {static: false},
    ) nzTableComponent?: LogiTableComponent<ItemData>
    private destroy$ = new Subject()
    virtualData: readonly ItemData[] = getVirtual()

    scrollToIndex(index: number): void {
        this.nzTableComponent?.cdkVirtualScrollViewport?.scrollToIndex(index)
    }

    trackByIndex(_: number, data: ItemData): number {
        return data.id
    }

    ngAfterViewInit(): void {
        const h3 = document.querySelectorAll('h3')
        const tables: string[] = []
        h3.forEach(h => tables.push(h.textContent ?? ''))
        this.tables = tables
        this.nzTableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: number) => {
                console.log('scroll index to', data)
            })
    }

    ngOnDestroy(): void {
        this.destroy$.next()
        this.destroy$.complete()
    }
}

function getData(): readonly DataItem[] {
    const data = []
    for (let i = 0; i < 100; i++)
        data.push({
            name: `Edward King ${i}`,
            age: 32,
            address: `London, Park Lane no. ${i}`,
        })
    return data
}

function getVirtual(): readonly ItemData[] {
    const data = []
    for (let i = 0; i < 2000; i++)
        data.push({
            id: i,
            name: 'Edward',
            age: i,
            address: 'London',
        })
    return data
}

function getGroupData(): readonly Grouping[] {
    const data = []
    for (let i = 0; i < 100; i++)
        data.push({
            name: 'John Brown',
            age: i + 1,
            street: 'Lake Park',
            building: 'C',
            number: 2035,
            companyAddress: 'Lake Street 42',
            companyName: 'SoftLake Co',
            gender: 'M',
        })
    return data
}
