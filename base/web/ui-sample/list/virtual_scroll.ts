import {CollectionViewer, DataSource} from '@angular/cdk/collections'
import {BehaviorSubject, Observable, Subscription, timer} from 'rxjs'

// tslint:disable: no-magic-numbers
export interface ItemData {
    readonly id: string
    readonly name: string
    readonly email: string
}

export class ItemDataSource extends DataSource<ItemData> {
    public constructor() {
        super()
        this._allMockData = mockData()
    }
    // tslint:disable-next-line: readonly-array
    public connect(viewer: CollectionViewer): Observable<ItemData[]> {
        this._subs.add(viewer.viewChange.subscribe(range => {
            const startPage = Math.floor(range.start / this._pageSize)
            const endPage = Math.floor((range.end - 1) / this._pageSize)
            for (let i = startPage; i <= endPage; i += 1)
                this._fetchPage(i)
        }))
        return this._dataStream$
    }

    public disconnect(): void {
        this._subs.unsubscribe()
    }

    private _allMockData: readonly ItemData[] = []
    private _subs = new Subscription()
    private _cachedData = Array.from<ItemData>({length: 1000})
    private _pageSize = 10
    private _fetchedPage = new Set<number>()
    // tslint:disable-next-line: readonly-array
    private _dataStream$ = new BehaviorSubject<ItemData[]>(this._cachedData)

    private _fetchPage(page: number): void {
        if (this._fetchedPage.has(page))
            return
        this._fetchedPage.add(page)
        /**
         * Simulate http request with timer here.
         */
        // tslint:disable-next-line: insecure-random
        timer(Math.random() * 1000 + 200).subscribe(() => {
            const data = this._allMockData.slice(
                page * this._pageSize,
                (page + 1) * this._pageSize,
            )
            this._cachedData
                .splice(page * this._pageSize, this._pageSize, ...data)
            this._dataStream$.next(this._cachedData)
        })
    }
}

function mockData(): readonly ItemData[] {
    // @ts-ignore
    // tslint:disable-next-line: no-unused
    return Array(1000).fill(undefined).map((e, i) => {
        return {
            email: randomEmail(),
            id: String(i),
            name: randomStr(6),
        }
    })
}

function randomEmail(): string {
    return `${randomStr(5)}@${randomStr(2)}.com`
}

/**
 * https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 */
function randomStr(length: number): string {
    // tslint:disable-next-line: insecure-random
    return Math.random().toString(36).substr(2, length)
}
